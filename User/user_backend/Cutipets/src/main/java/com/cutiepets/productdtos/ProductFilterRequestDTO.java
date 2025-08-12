package com.cutiepets.productdtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductFilterRequestDTO {
    private Integer petTypeId;      // Filter by pet type (e.g., dog, cat)
    private Integer categoryId;     // Filter by product category
    private BigDecimal minPrice;    // Minimum price filter
    private BigDecimal maxPrice;    // Maximum price filter
    private Boolean available;      // Filter by availability status
    private Integer minStockQuantity;  // Minimum stock quantity filter
    private Integer maxStockQuantity;  // Maximum stock quantity filter
}
