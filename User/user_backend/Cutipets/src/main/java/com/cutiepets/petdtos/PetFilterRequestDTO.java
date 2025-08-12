package com.cutiepets.petdtos;

import lombok.Data;

@Data
public class PetFilterRequestDTO {
    private Integer typeId;
    private Integer breedId;
    private Integer minAge;
    private Integer maxAge;
    private String gender;
    private Double minPrice;
    private Double maxPrice;
}
