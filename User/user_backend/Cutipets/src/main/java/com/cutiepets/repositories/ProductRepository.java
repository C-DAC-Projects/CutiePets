package com.cutiepets.repositories;

import com.cutiepets.pojos.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 1. Get all products where available = true (i.e. approved)
    List<Product> findByAvailableTrue();

    // 2. Get products by category
    List<Product> findByCategory_IdAndAvailableTrue(Integer categoryId);

    // 3. Get products by pet type
    List<Product> findByPetType_IdAndAvailableTrue(Integer petTypeId);

    // 4. Get products by category and pet type
    List<Product> findByCategory_IdAndPetType_IdAndAvailableTrue(Integer categoryId, Integer petTypeId);

    // 5. Filter products by optional conditions (advanced)
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:petTypeId IS NULL OR p.petType.id = :petTypeId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "p.available = true")
    List<Product> filterProducts(
            @Param("categoryId") Integer categoryId,
            @Param("petTypeId") Integer petTypeId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}
