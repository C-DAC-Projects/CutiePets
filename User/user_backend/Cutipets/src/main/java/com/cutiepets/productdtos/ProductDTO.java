package com.cutiepets.productdtos;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {
    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer stockQuantity;
    private String description;
    private Boolean available;
    private String categoryName;
    private String petTypeName;
    private List<String> imageUrls;
}
