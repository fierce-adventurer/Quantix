package com.quantix.modules.products.service;

import com.quantix.modules.products.dto.CreateProductRequest;
import com.quantix.modules.products.dto.ProductResponse;
import com.quantix.modules.products.dto.UpdateProductRequest;
import com.quantix.modules.products.entity.Product;
import com.quantix.modules.products.repository.ProductRepository;
import com.quantix.shared.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class ProductService {

    private static final int DEFAULT_LOW_STOCK_THRESHOLD = 5;

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(String tenantId, String search) {
        List<Product> products;
        if (search != null && !search.trim().isBlank()) {
            String term = search.trim();
            products = productRepository.findByTenantIdAndNameContainingIgnoreCaseOrTenantIdAndSkuContainingIgnoreCaseOrderByCreatedAtDesc(
                    tenantId, term, tenantId, term
            );
        } else {
            products = productRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
        }
        return products.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(String tenantId, String productId) {
        Product product = productRepository.findByIdAndTenantId(productId, tenantId)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(String tenantId, CreateProductRequest request) {
        String normalizedSku = request.sku().trim().toUpperCase(Locale.ROOT);

        if (productRepository.existsByTenantIdAndSku(tenantId, normalizedSku)) {
            throw new ApiException("SKU '" + normalizedSku + "' is already in use in this store", HttpStatus.CONFLICT);
        }

        Product product = new Product(
                tenantId,
                request.name().trim(),
                normalizedSku,
                request.description() != null ? request.description().trim() : null,
                request.quantityOnHand() != null ? request.quantityOnHand() : 0,
                request.costPrice(),
                request.sellingPrice(),
                request.lowStockThreshold(),
                request.currency(),
                request.locationType()
        );

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(String tenantId, String productId, UpdateProductRequest request) {
        Product product = productRepository.findByIdAndTenantId(productId, tenantId)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        String normalizedSku = request.sku().trim().toUpperCase(Locale.ROOT);

        if (productRepository.existsByTenantIdAndSkuAndIdNot(tenantId, normalizedSku, productId)) {
            throw new ApiException("SKU '" + normalizedSku + "' is already in use by another product", HttpStatus.CONFLICT);
        }

        product.setName(request.name().trim());
        product.setSku(normalizedSku);
        product.setDescription(request.description() != null ? request.description().trim() : null);
        product.setQuantityOnHand(request.quantityOnHand() != null ? request.quantityOnHand() : 0);
        product.setCostPrice(request.costPrice());
        product.setSellingPrice(request.sellingPrice());
        product.setLowStockThreshold(request.lowStockThreshold());
        if (request.currency() != null && !request.currency().isBlank()) {
            product.setCurrency(request.currency());
        }
        if (request.locationType() != null) {
            product.setLocationType(request.locationType());
        }

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public void deleteProduct(String tenantId, String productId) {
        Product product = productRepository.findByIdAndTenantId(productId, tenantId)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
        productRepository.delete(product);
    }

    private ProductResponse toResponse(Product product) {
        int threshold = product.getLowStockThreshold() != null
                ? product.getLowStockThreshold()
                : DEFAULT_LOW_STOCK_THRESHOLD;
        boolean isLowStock = product.getQuantityOnHand() <= threshold;

        return new ProductResponse(
                product.getId(),
                product.getTenantId(),
                product.getName(),
                product.getSku(),
                product.getDescription(),
                product.getQuantityOnHand(),
                product.getCostPrice(),
                product.getSellingPrice(),
                product.getLowStockThreshold(),
                isLowStock,
                product.getCurrency(),
                product.getLocationType(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
