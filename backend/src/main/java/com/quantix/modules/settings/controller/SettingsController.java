package com.quantix.modules.settings.controller;

import com.quantix.modules.auth.dto.TenantResponse;
import com.quantix.modules.auth.entity.Tenant;
import com.quantix.modules.auth.repository.TenantRepository;
import com.quantix.modules.settings.dto.UpdateSettingsRequest;
import com.quantix.shared.context.TenantContext;
import com.quantix.shared.dto.ApiResponse;
import com.quantix.shared.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final TenantRepository tenantRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<TenantResponse>> getSettings() {
        String tenantId = requireTenantId();
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ApiException("Store tenant not found", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.ok(TenantResponse.from(tenant), "Settings retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<TenantResponse>> updateSettings(@RequestBody UpdateSettingsRequest request) {
        String tenantId = requireTenantId();
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ApiException("Store tenant not found", HttpStatus.NOT_FOUND));

        if (request.name() != null && !request.name().trim().isBlank()) {
            tenant.setName(request.name().trim());
        }
        if (request.defaultLowStockThreshold() != null) {
            if (request.defaultLowStockThreshold() < 0) {
                throw new ApiException("Default low stock threshold cannot be negative", HttpStatus.BAD_REQUEST);
            }
            tenant.setDefaultLowStockThreshold(request.defaultLowStockThreshold());
        }
        if (request.currency() != null && !request.currency().trim().isBlank()) {
            tenant.setCurrency(request.currency().trim());
        }
        if (request.theme() != null && !request.theme().trim().isBlank()) {
            tenant.setTheme(request.theme().trim().toLowerCase());
        }

        tenant = tenantRepository.save(tenant);
        return ResponseEntity.ok(ApiResponse.ok(TenantResponse.from(tenant), "Settings updated successfully"));
    }

    private String requireTenantId() {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            throw new ApiException("Store tenant context is missing", HttpStatus.UNAUTHORIZED);
        }
        return tenantId;
    }
}
