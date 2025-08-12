package com.cutiepets.petdtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetDTO {
    private Integer id;
    private String name;
    private Integer age;
    private String gender;
    private Double price;
    private String description;
    private Boolean available;
    private String breedName;
    private String petTypeName;
    private List<String> imageUrls;
}
