package com.cutiepets.services;

import com.cutiepets.pojos.Product;
import com.cutiepets.productdtos.ProductDTO;
import com.cutiepets.repositories.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductDTO> getAllAvailableProducts() {
        return productRepository.findByAvailableTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByPetType(Integer petTypeId) {
        return productRepository.findByPetType_IdAndAvailableTrue(petTypeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCategoryAndPetType(Integer categoryId, Integer petTypeId) {
        return productRepository.findByCategory_IdAndPetType_IdAndAvailableTrue(categoryId, petTypeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> filterProducts(Integer petTypeId, Integer categoryId, Double minPrice, Double maxPrice) {
        return productRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getAvailable()))
                .filter(p -> categoryId == null || (p.getCategory() != null && categoryId.equals(p.getCategory().getId())))
                .filter(p -> petTypeId == null || (p.getPetType() != null && petTypeId.equals(p.getPetType().getId())))
                .filter(p -> minPrice == null || p.getPrice() >= minPrice)
                .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getAvailable()))
                .orElseThrow(() -> new RuntimeException("Available product not found with id: " + id));

        return convertToDTO(product);
    }

    // Helper method to convert Product → ProductDTO using ModelMapper + manual enhancements
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        dto.setPetTypeName(product.getPetType() != null ? product.getPetType().getName() : null);
        dto.setImageUrls(
                product.getImages().stream()
                        .map(image -> image.getImageUrl())
                        .collect(Collectors.toList())
        );
        return dto;
    }
}
