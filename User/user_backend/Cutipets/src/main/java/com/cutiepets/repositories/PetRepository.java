package com.cutiepets.repositories;

import com.cutiepets.pojos.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Integer> {

    // 1. Get all pets where available = true and fetch images
    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.images WHERE p.available = true")
    List<Pet> findByAvailableTrue();

    // 2. Get pets by pet type and fetch images
    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.images WHERE p.breed.petType.id = :typeId AND p.available = true")
    List<Pet> findByBreed_PetType_IdAndAvailableTrue(@Param("typeId") Integer typeId);

    // 3. Get pets by pet type and breed and fetch images
    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.images WHERE p.breed.petType.id = :typeId AND p.breed.id = :breedId AND p.available = true")
    List<Pet> findByBreed_PetType_IdAndBreed_IdAndAvailableTrue(@Param("typeId") Integer typeId,
                                                                @Param("breedId") Integer breedId);

    // 4. Filter pets by multiple optional conditions and fetch images
    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.images WHERE " +
           "(:typeId IS NULL OR p.breed.petType.id = :typeId) AND " +
           "(:breedId IS NULL OR p.breed.id = :breedId) AND " +
           "(:minAge IS NULL OR p.age >= :minAge) AND " +
           "(:maxAge IS NULL OR p.age <= :maxAge) AND " +
           "(:gender IS NULL OR p.gender = :gender) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "p.available = true")
    List<Pet> filterPets(
            @Param("typeId") Integer typeId,
            @Param("breedId") Integer breedId,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("gender") String gender,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}
