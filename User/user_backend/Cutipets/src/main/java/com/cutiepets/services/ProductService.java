package com.cutiepets.services;

import java.util.List;

import com.cutiepets.productdtos.ProductDTO;

public interface ProductService {

    // 1. Get all available products
    List<ProductDTO> getAllAvailableProducts();

    // 2. Get available products by pet type
    List<ProductDTO> getProductsByPetType(Integer petTypeId);

    // 3. Get available products by category and pet type
    List<ProductDTO> getProductsByCategoryAndPetType(Integer categoryId, Integer petTypeId);

    // 4. Filter available products based on optional criteria
    List<ProductDTO> filterProducts(Integer petTypeId, Integer categoryId,
                                    Double minPrice, Double maxPrice);

    // 5. Get one available product by ID
    ProductDTO getProductById(Integer id);
}
