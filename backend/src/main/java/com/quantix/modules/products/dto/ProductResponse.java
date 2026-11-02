package com.quantix.modules.products.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ProductResponse(
    String id,
    String tenantId,
    String name,
    String sku,
    String description,
    Integer quantityOnHand,
    BigDecimal costPrice,
    BigDecimal sellingPrice,
    Integer lowStockThreshold,
    boolean isLowStock,
    String currency,
    String locationType,
    Instant createdAt,
    Instant updatedAt
) {}
