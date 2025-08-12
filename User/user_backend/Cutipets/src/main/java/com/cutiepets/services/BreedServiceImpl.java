package com.cutiepets.services;

import com.cutiepets.petdtos.BreedDTO;
import com.cutiepets.pojos.Breed;
import com.cutiepets.repositories.BreedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BreedServiceImpl implements BreedService {

    @Autowired
    private BreedRepository breedRepository;

    @Override
    public List<BreedDTO> getAllBreeds() {
        List<Breed> breeds = breedRepository.findAll();
        return breeds.stream()
                .map(b -> new BreedDTO(b.getId(), b.getName(), b.getPetType().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<BreedDTO> getBreedsByPetType(Integer petTypeId) {
        List<Breed> breeds = breedRepository.findByPetTypeId(petTypeId);
        return breeds.stream()
                .map(b -> new BreedDTO(b.getId(), b.getName(), petTypeId))
                .collect(Collectors.toList());
    }
}
