package com.quantix.modules.products.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "products",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_tenant_sku", columnNames = {"tenant_id", "sku"})
    },
    indexes = {
        @Index(name = "idx_product_tenant", columnList = "tenant_id")
    }
)
public class Product {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String sku;

    @Column(length = 1000)
    private String description;

    @Builder.Default
    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand = 0;

    @Column(name = "cost_price", precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "selling_price", precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold;

    @Builder.Default
    @Column(name = "currency", length = 10)
    private String currency = "USD";

    @Column(name = "location_type", length = 100)
    private String locationType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Product(
            String tenantId,
            String name,
            String sku,
            String description,
            Integer quantityOnHand,
            BigDecimal costPrice,
            BigDecimal sellingPrice,
            Integer lowStockThreshold,
            String currency,
            String locationType
    ) {
        this.tenantId = tenantId;
        this.name = name;
        this.sku = sku;
        this.description = description;
        this.quantityOnHand = quantityOnHand != null ? quantityOnHand : 0;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.lowStockThreshold = lowStockThreshold;
        this.currency = (currency != null && !currency.isBlank()) ? currency.trim().toUpperCase() : "USD";
        this.locationType = locationType != null ? locationType.trim() : null;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.quantityOnHand == null) {
            this.quantityOnHand = 0;
        }
        if (this.currency == null || this.currency.isBlank()) {
            this.currency = "USD";
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = Instant.now();
        if (this.currency == null || this.currency.isBlank()) {
            this.currency = "USD";
        }
    }

    public void setCurrency(String currency) {
        this.currency = (currency != null && !currency.isBlank()) ? currency.trim().toUpperCase() : "USD";
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType != null ? locationType.trim() : null;
    }
}
