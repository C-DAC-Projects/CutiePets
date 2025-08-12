package com.cutiepets.controllers;

import com.cutiepets.petdtos.BreedDTO;
import com.cutiepets.petdtos.PetDTO;
import com.cutiepets.petdtos.PetTypeDTO;
import com.cutiepets.services.BreedService;
import com.cutiepets.services.PetService;
import com.cutiepets.services.PetTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private PetTypeService petTypeService;

    @Autowired
    private BreedService breedService;

    @GetMapping
    public List<PetDTO> getAllAvailablePets() {
        return petService.getAllAvailablePets();
    }

    @GetMapping("/types")
    public List<PetTypeDTO> getAllPetTypes() {
        return petTypeService.getAllPetTypes();
    }

    @GetMapping("/breeds")
    public List<BreedDTO> getAllBreeds(@RequestParam(required = false) Integer typeId) {
        return breedService.getBreedsByPetType(typeId); // Or all breeds if null
    }

    @GetMapping("/type/{typeId}")
    public List<PetDTO> getPetsByPetType(@PathVariable Integer typeId) {
        return petService.getPetsByPetType(typeId);
    }

    @GetMapping("/type/{typeId}/breed/{breedId}")
    public List<PetDTO> getPetsByTypeAndBreed(@PathVariable Integer typeId,
                                              @PathVariable Integer breedId) {
        return petService.getPetsByTypeAndBreed(typeId, breedId);
    }

    @GetMapping("/filter")
    public List<PetDTO> filterPets(@RequestParam(required = false) Integer typeId,
                                   @RequestParam(required = false) Integer breedId,
                                   @RequestParam(required = false) Integer minAge,
                                   @RequestParam(required = false) Integer maxAge,
                                   @RequestParam(required = false) String gender,
                                   @RequestParam(required = false) Double minPrice,
                                   @RequestParam(required = false) Double maxPrice) {
        return petService.filterPets(typeId, breedId, minAge, maxAge, gender, minPrice, maxPrice);
    }

    @GetMapping("/{id}")
    public PetDTO getPetById(@PathVariable Integer id) {
        return petService.getPetById(id);
    }
}
