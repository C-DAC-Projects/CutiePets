package com.cutiepets.services;

import com.cutiepets.petdtos.PetTypeDTO;
import com.cutiepets.pojos.PetType;
import com.cutiepets.repositories.PetTypeRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class PetTypeServiceImpl implements PetTypeService {

    private final PetTypeRepository petTypeRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<PetTypeDTO> getAllPetTypes() {
        return petTypeRepository.findAll()
                .stream()
                .map(pt -> modelMapper.map(pt, PetTypeDTO.class))
                .collect(Collectors.toList());
    }
}
