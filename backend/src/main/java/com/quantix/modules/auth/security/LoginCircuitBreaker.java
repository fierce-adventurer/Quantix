package com.quantix.modules.auth.security;

import com.quantix.shared.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginCircuitBreaker {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long COOLDOWN_DURATION_SECONDS = 300;

    private enum State {
        CLOSED,
        OPEN,
        HALF_OPEN
    }

    private static class IpState {
        private State state = State.CLOSED;
        private int failureCount = 0;
        private Instant lastFailureTime = Instant.now();
        private Instant openUntil = Instant.EPOCH;

        synchronized boolean isBlocked() {
            Instant now = Instant.now();
            if (state == State.OPEN) {
                if (now.isAfter(openUntil)) {
                    state = State.HALF_OPEN;
                    return false;
                }
                return true;
            }
            return false;
        }

        synchronized void recordFailure() {
            Instant now = Instant.now();
            if (state == State.HALF_OPEN) {
                state = State.OPEN;
                openUntil = now.plusSeconds(COOLDOWN_DURATION_SECONDS);
                return;
            }

            if (now.getEpochSecond() - lastFailureTime.getEpochSecond() > COOLDOWN_DURATION_SECONDS) {
                failureCount = 1;
            } else {
                failureCount++;
            }
            lastFailureTime = now;

            if (failureCount >= MAX_FAILED_ATTEMPTS) {
                state = State.OPEN;
                openUntil = now.plusSeconds(COOLDOWN_DURATION_SECONDS);
            }
        }

        synchronized void recordSuccess() {
            state = State.CLOSED;
            failureCount = 0;
            openUntil = Instant.EPOCH;
        }

        synchronized long getRemainingLockoutSeconds() {
            long remaining = openUntil.getEpochSecond() - Instant.now().getEpochSecond();
            return Math.max(0, remaining);
        }
    }

    private final Map<String, IpState> ipStates = new ConcurrentHashMap<>();

    public void checkIp(String ip) {
        IpState state = ipStates.get(ip);
        if (state != null && state.isBlocked()) {
            long remaining = state.getRemainingLockoutSeconds();
            throw new ApiException(
                    "Too many failed login attempts from this IP. Circuit open. Please retry in " + remaining + " seconds.",
                    HttpStatus.TOO_MANY_REQUESTS
            );
        }
    }

    public void recordFailure(String ip) {
        ipStates.computeIfAbsent(ip, k -> new IpState()).recordFailure();
    }

    public void recordSuccess(String ip) {
        IpState state = ipStates.get(ip);
        if (state != null) {
            state.recordSuccess();
        }
    }
}
