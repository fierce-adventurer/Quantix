package com.quantix.modules.auth.dto;

public record TenantResponse(
    String id,
    String name,
    String slug
) {}
