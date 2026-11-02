package com.quantix.modules.products.repository;

import com.quantix.modules.products.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, String> {
    List<StockMovement> findByTenantIdAndProductIdOrderByCreatedAtDesc(String tenantId, String productId);
}
