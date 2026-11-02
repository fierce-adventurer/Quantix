package com.quantix.shared.context;

import com.quantix.modules.auth.dto.TenantResponse;

public final class TenantContext {
    private static final ThreadLocal<TenantResponse> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {}

    public static void setTenant(TenantResponse tenant) {
        CURRENT_TENANT.set(tenant);
    }

    public static TenantResponse getTenant() {
        return CURRENT_TENANT.get();
    }

    public static String getTenantId() {
        TenantResponse tenant = CURRENT_TENANT.get();
        return tenant != null ? tenant.id() : null;
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
