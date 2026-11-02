package com.quantix.modules.auth.service;

import com.quantix.modules.auth.dto.AuthResponse;
import com.quantix.modules.auth.dto.LoginRequest;
import com.quantix.modules.auth.dto.SignupRequest;
import com.quantix.modules.auth.dto.TenantResponse;
import com.quantix.modules.auth.dto.UserResponse;
import com.quantix.modules.auth.entity.Tenant;
import com.quantix.modules.auth.entity.User;
import com.quantix.modules.auth.repository.TenantRepository;
import com.quantix.modules.auth.repository.UserRepository;
import com.quantix.modules.auth.security.LoginCircuitBreaker;
import com.quantix.shared.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LoginCircuitBreaker circuitBreaker;

    public AuthService(
            TenantRepository tenantRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            LoginCircuitBreaker circuitBreaker
    ) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.circuitBreaker = circuitBreaker;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ApiException("Email is already registered", HttpStatus.CONFLICT);
        }

        String baseSlug = request.organizationName().trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (baseSlug.isBlank()) {
            baseSlug = "store";
        }

        String slug = baseSlug;
        if (tenantRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        Tenant tenant = new Tenant(request.organizationName().trim(), slug);
        tenant = tenantRepository.save(tenant);

        String encodedPassword = passwordEncoder.encode(request.password());
        User user = new User(tenant.getId(), normalizedEmail, encodedPassword, "OWNER");
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), tenant.getId(), user.getRole());

        UserResponse userResponse = new UserResponse(user.getId(), user.getEmail(), user.getRole(), tenant.getId());
        TenantResponse tenantResponse = new TenantResponse(tenant.getId(), tenant.getName(), tenant.getSlug());

        return new AuthResponse(token, userResponse, tenantResponse);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String clientIp) {
        circuitBreaker.checkIp(clientIp);

        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            circuitBreaker.recordFailure(clientIp);
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        Tenant tenant = tenantRepository.findById(user.getTenantId())
                .orElseThrow(() -> new ApiException("Store tenant not found", HttpStatus.NOT_FOUND));

        circuitBreaker.recordSuccess(clientIp);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), tenant.getId(), user.getRole());

        UserResponse userResponse = new UserResponse(user.getId(), user.getEmail(), user.getRole(), tenant.getId());
        TenantResponse tenantResponse = new TenantResponse(tenant.getId(), tenant.getName(), tenant.getSlug());

        return new AuthResponse(token, userResponse, tenantResponse);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        return login(request, "127.0.0.1");
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Tenant tenant = tenantRepository.findById(user.getTenantId())
                .orElseThrow(() -> new ApiException("Store tenant not found", HttpStatus.NOT_FOUND));

        UserResponse userResponse = new UserResponse(user.getId(), user.getEmail(), user.getRole(), tenant.getId());
        TenantResponse tenantResponse = new TenantResponse(tenant.getId(), tenant.getName(), tenant.getSlug());

        return new AuthResponse(null, userResponse, tenantResponse);
    }
}
