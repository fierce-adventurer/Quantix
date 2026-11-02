package com.quantix.modules.settings.dto;

public record UpdateSettingsRequest(
    String name,
    Integer defaultLowStockThreshold,
    String currency,
    String theme
) {}
