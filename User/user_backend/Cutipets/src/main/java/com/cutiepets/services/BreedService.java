package com.cutiepets.services;

import com.cutiepets.petdtos.BreedDTO;
import java.util.List;

public interface BreedService {
    List<BreedDTO> getAllBreeds(); // All breeds
    List<BreedDTO> getBreedsByPetType(Integer petTypeId); // Filtered by type
}
