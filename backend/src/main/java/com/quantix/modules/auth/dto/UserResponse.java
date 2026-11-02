package com.quantix.modules.auth.dto;

public record UserResponse(
    String id,
    String email,
    String role,
    String tenantId
) {}
