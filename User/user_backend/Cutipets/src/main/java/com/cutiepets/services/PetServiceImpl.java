package com.cutiepets.services;

import com.cutiepets.petdtos.PetDTO;
import com.cutiepets.pojos.Pet;
import com.cutiepets.repositories.PetRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<PetDTO> getAllAvailablePets() {
        return petRepository.findByAvailableTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PetDTO> getPetsByPetType(Integer typeId) {
        return petRepository.findByBreed_PetType_IdAndAvailableTrue(typeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PetDTO> getPetsByTypeAndBreed(Integer typeId, Integer breedId) {
        return petRepository.findByBreed_PetType_IdAndBreed_IdAndAvailableTrue(typeId, breedId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PetDTO> filterPets(Integer typeId, Integer breedId, Integer minAge, Integer maxAge,
                                   String gender, Double minPrice, Double maxPrice) {
        return petRepository.filterPets(typeId, breedId, minAge, maxAge, gender, minPrice, maxPrice)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PetDTO getPetById(Integer id) {
        Pet pet = petRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getAvailable()))
                .orElseThrow(() -> new RuntimeException("Available (approved) pet not found with id: " + id));

        return convertToDTO(pet);
    }

    // Helper method to convert Pet → PetDTO
    private PetDTO convertToDTO(Pet pet) {
        PetDTO dto = modelMapper.map(pet, PetDTO.class);
        dto.setBreedName(pet.getBreed().getName());
        dto.setPetTypeName(pet.getBreed().getPetType().getName());
        dto.setImageUrls(
        	    pet.getImages().stream()
        	        .map(image -> {
        	            String path = image.getImageUrl();
        	            // Remove any "D:/" or full path prefix if mistakenly stored
        	            if (path.contains("Resources/Pets/")) {
        	                path = path.substring(path.indexOf("Resources/Pets/") + "Resources/Pets/".length());
        	            }
        	            return "/images/view/" + path.replace("\\", "/");
        	        })
        	        .collect(Collectors.toList())
        	);

        return dto;
    }
}
