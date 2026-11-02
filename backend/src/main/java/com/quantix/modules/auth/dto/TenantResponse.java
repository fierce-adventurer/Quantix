package com.quantix.modules.auth.dto;

import com.quantix.modules.auth.entity.Tenant;

public record TenantResponse(
    String id,
    String name,
    String slug,
    Integer defaultLowStockThreshold,
    String currency,
    String theme
) {
    public static TenantResponse from(Tenant tenant) {
        return new TenantResponse(
            tenant.getId(),
            tenant.getName(),
            tenant.getSlug(),
            tenant.getDefaultLowStockThreshold() != null ? tenant.getDefaultLowStockThreshold() : 5,
            tenant.getCurrency() != null ? tenant.getCurrency() : "USD",
            tenant.getTheme() != null ? tenant.getTheme() : "dark"
        );
    }
}
