package com.quantix.modules.products.dto;

import com.quantix.modules.products.entity.StockMovement;

import java.time.Instant;

public record StockMovementResponse(
    String id,
    String productId,
    Integer previousQuantity,
    Integer quantityDelta,
    Integer resultingQuantity,
    String reason,
    String adjustedBy,
    Instant createdAt
) {
    public static StockMovementResponse from(StockMovement m) {
        return new StockMovementResponse(
            m.getId(),
            m.getProductId(),
            m.getPreviousQuantity(),
            m.getQuantityDelta(),
            m.getResultingQuantity(),
            m.getReason(),
            m.getAdjustedBy(),
            m.getCreatedAt()
        );
    }
}
