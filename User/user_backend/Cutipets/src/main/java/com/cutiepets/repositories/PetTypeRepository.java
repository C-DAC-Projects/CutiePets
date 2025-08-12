package com.cutiepets.repositories;

import com.cutiepets.pojos.PetType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetTypeRepository extends JpaRepository<PetType, Integer> {
}
