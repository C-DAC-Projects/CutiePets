package com.cutiepets.services;

import com.cutiepets.petdtos.PetDTO;

import java.util.List;

public interface PetService {

    // Get all available (i.e., approved) pets
    List<PetDTO> getAllAvailablePets();

    // Get all available pets by pet type
    List<PetDTO> getPetsByPetType(Integer typeId);

    // Get all available pets by type and breed
    List<PetDTO> getPetsByTypeAndBreed(Integer typeId, Integer breedId);

    // Filter available pets based on given criteria
    List<PetDTO> filterPets(Integer typeId, Integer breedId, Integer minAge, Integer maxAge,
                             String gender, Double minPrice, Double maxPrice);

    // Get one available pet by ID
    PetDTO getPetById(Integer id);
}
