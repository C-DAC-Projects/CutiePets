package com.cutiepets.repositories;

import com.cutiepets.pojos.Breed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BreedRepository extends JpaRepository<Breed, Integer> {
    List<Breed> findByPetTypeId(Integer petTypeId);
}
