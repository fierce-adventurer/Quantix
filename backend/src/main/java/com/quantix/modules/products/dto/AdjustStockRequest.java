package com.quantix.modules.products.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdjustStockRequest(
    @NotNull(message = "Quantity delta is required")
    Integer quantityDelta,

    @Size(max = 255, message = "Reason must not exceed 255 characters")
    String reason
) {}
