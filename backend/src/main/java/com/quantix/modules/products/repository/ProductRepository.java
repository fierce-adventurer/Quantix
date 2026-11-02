package com.quantix.modules.products.repository;

import com.quantix.modules.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByTenantIdOrderByCreatedAtDesc(String tenantId);

    List<Product> findByTenantIdAndNameContainingIgnoreCaseOrTenantIdAndSkuContainingIgnoreCaseOrderByCreatedAtDesc(
            String tenantId1, String name, String tenantId2, String sku
    );

    Optional<Product> findByIdAndTenantId(String id, String tenantId);

    boolean existsByTenantIdAndSku(String tenantId, String sku);

    boolean existsByTenantIdAndSkuAndIdNot(String tenantId, String sku, String id);

    boolean existsByIdAndTenantId(String id, String tenantId);

    void deleteByIdAndTenantId(String id, String tenantId);
}
