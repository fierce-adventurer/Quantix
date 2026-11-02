package com.quantix.modules.auth.dto;

public record AuthResponse(
    String token,
    UserResponse user,
    TenantResponse tenant
) {}
