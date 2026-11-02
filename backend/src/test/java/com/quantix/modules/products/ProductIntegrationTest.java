package com.quantix.modules.products;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantix.modules.auth.dto.AuthResponse;
import com.quantix.modules.auth.dto.SignupRequest;
import com.quantix.modules.auth.service.AuthService;
import com.quantix.modules.products.dto.CreateProductRequest;
import com.quantix.modules.products.dto.UpdateProductRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    private String storeAToken;
    private String storeBToken;

    @BeforeEach
    void setUp() {
        AuthResponse storeA = authService.signup(new SignupRequest(
                "Store Alpha", "alpha" + System.nanoTime() + "@store.com", "Password123!"
        ));
        storeAToken = storeA.token();

        AuthResponse storeB = authService.signup(new SignupRequest(
                "Store Beta", "beta" + System.nanoTime() + "@store.com", "Password123!"
        ));
        storeBToken = storeB.token();
    }

    @Test
    void testProductCrudAndTenantIsolation() throws Exception {
        CreateProductRequest createProd = new CreateProductRequest(
                "Mechanical Keyboard",
                "KEY-MECH-01",
                "RGB mechanical gaming keyboard",
                45,
                new BigDecimal("65.00"),
                new BigDecimal("120.00"),
                10
        );

        String createResponse = mockMvc.perform(post("/api/products")
                        .header("Authorization", "Bearer " + storeAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createProd)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Mechanical Keyboard"))
                .andExpect(jsonPath("$.data.sku").value("KEY-MECH-01"))
                .andExpect(jsonPath("$.data.isLowStock").value(false))
                .andReturn().getResponse().getContentAsString();

        String productId = objectMapper.readTree(createResponse).path("data").path("id").asText();

        mockMvc.perform(post("/api/products")
                        .header("Authorization", "Bearer " + storeAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createProd)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(post("/api/products")
                        .header("Authorization", "Bearer " + storeBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createProd)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sku").value("KEY-MECH-01"));

        mockMvc.perform(get("/api/products?search=Keyboard")
                        .header("Authorization", "Bearer " + storeAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1));

        UpdateProductRequest updateProd = new UpdateProductRequest(
                "Mechanical Keyboard Pro",
                "KEY-MECH-01",
                "Updated description",
                4,
                new BigDecimal("70.00"),
                new BigDecimal("140.00"),
                10
        );

        mockMvc.perform(put("/api/products/" + productId)
                        .header("Authorization", "Bearer " + storeAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateProd)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Mechanical Keyboard Pro"))
                .andExpect(jsonPath("$.data.isLowStock").value(true));

        mockMvc.perform(delete("/api/products/" + productId)
                        .header("Authorization", "Bearer " + storeAToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/products/" + productId)
                        .header("Authorization", "Bearer " + storeAToken))
                .andExpect(status().isNotFound());
    }
}
