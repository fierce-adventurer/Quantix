package com.quantix.modules.auth.controller;

import com.quantix.modules.auth.repository.TenantRepository;
import com.quantix.shared.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final TenantRepository tenantRepository;

    public HealthController(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("timestamp", Instant.now().toString());

        try {
            tenantRepository.count();
            healthData.put("database", "CONNECTED");
        } catch (Exception ex) {
            healthData.put("database", "DISCONNECTED");
            healthData.put("databaseError", ex.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.ok(healthData, "System operational"));
    }
}
