package com.cutiepets.services;

import com.cutiepets.petdtos.PetTypeDTO;
import java.util.List;

public interface PetTypeService {
    List<PetTypeDTO> getAllPetTypes();
}
