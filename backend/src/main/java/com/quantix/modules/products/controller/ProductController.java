package com.quantix.modules.products.controller;

import com.quantix.modules.products.dto.CreateProductRequest;
import com.quantix.modules.products.dto.ProductResponse;
import com.quantix.modules.products.dto.UpdateProductRequest;
import com.quantix.modules.products.service.ProductService;
import com.quantix.shared.context.TenantContext;
import com.quantix.shared.dto.ApiResponse;
import com.quantix.shared.exception.ApiException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> listProducts(
            @RequestParam(required = false) String search
    ) {
        String tenantId = requireTenantId();
        List<ProductResponse> products = productService.getProducts(tenantId, search);
        return ResponseEntity.ok(ApiResponse.ok(products, "Products retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable String id) {
        String tenantId = requireTenantId();
        ProductResponse product = productService.getProduct(tenantId, id);
        return ResponseEntity.ok(ApiResponse.ok(product, "Product details retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody CreateProductRequest request
    ) {
        String tenantId = requireTenantId();
        ProductResponse product = productService.createProduct(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(product, "Product created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        String tenantId = requireTenantId();
        ProductResponse product = productService.updateProduct(tenantId, id, request);
        return ResponseEntity.ok(ApiResponse.ok(product, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        String tenantId = requireTenantId();
        productService.deleteProduct(tenantId, id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted successfully"));
    }

    private String requireTenantId() {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            throw new ApiException("Authenticated tenant context is missing", HttpStatus.UNAUTHORIZED);
        }
        return tenantId;
    }
}
