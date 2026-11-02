package com.quantix.modules.products.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateProductRequest(
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 150, message = "Product name must be between 2 and 150 characters")
    String name,

    @NotBlank(message = "SKU is required")
    @Size(min = 2, max = 50, message = "SKU must be between 2 and 50 characters")
    String sku,

    String description,

    @Min(value = 0, message = "Quantity on hand cannot be negative")
    Integer quantityOnHand,

    @DecimalMin(value = "0.00", message = "Cost price cannot be negative")
    BigDecimal costPrice,

    @DecimalMin(value = "0.00", message = "Selling price cannot be negative")
    BigDecimal sellingPrice,

    @Min(value = 0, message = "Low stock threshold cannot be negative")
    Integer lowStockThreshold,

    @Size(max = 10, message = "Currency code must not exceed 10 characters")
    String currency,

    @Size(max = 100, message = "Location type must not exceed 100 characters")
    String locationType
) {}
