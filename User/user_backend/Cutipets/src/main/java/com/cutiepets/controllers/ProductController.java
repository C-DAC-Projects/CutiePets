package com.cutiepets.controllers;

import com.cutiepets.productdtos.ProductDTO;
import com.cutiepets.services.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductDTO> getAllAvailableProducts() {
        return productService.getAllAvailableProducts();
    }

    @GetMapping("/pet-type/{petTypeId}")
    public List<ProductDTO> getProductsByPetType(@PathVariable Integer petTypeId) {
        return productService.getProductsByPetType(petTypeId);
    }

    @GetMapping("/category/{categoryId}/pet-type/{petTypeId}")
    public List<ProductDTO> getProductsByCategoryAndPetType(@PathVariable Integer categoryId,
                                                            @PathVariable Integer petTypeId) {
        return productService.getProductsByCategoryAndPetType(categoryId, petTypeId);
    }

    @GetMapping("/filter")
    public List<ProductDTO> filterProducts(@RequestParam(required = false) Integer petTypeId,
                                           @RequestParam(required = false) Integer categoryId,
                                           @RequestParam(required = false) Double minPrice,
                                           @RequestParam(required = false) Double maxPrice) {
        return productService.filterProducts(petTypeId, categoryId, minPrice, maxPrice);
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }
}
