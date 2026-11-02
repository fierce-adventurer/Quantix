package com.quantix.modules.auth.repository;

import com.quantix.modules.auth.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {
    Optional<Tenant> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
