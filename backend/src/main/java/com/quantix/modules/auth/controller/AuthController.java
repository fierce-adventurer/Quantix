package com.quantix.modules.auth.controller;

import com.quantix.modules.auth.dto.AuthResponse;
import com.quantix.modules.auth.dto.LoginRequest;
import com.quantix.modules.auth.dto.SignupRequest;
import com.quantix.modules.auth.service.AuthService;
import com.quantix.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Store and admin created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> me(Authentication authentication) {
        String userId = authentication.getName();
        AuthResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Session details retrieved"));
    }
}
