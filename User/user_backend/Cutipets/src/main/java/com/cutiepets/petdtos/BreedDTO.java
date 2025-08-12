package com.cutiepets.petdtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BreedDTO {
    private Integer id;
    private String name;
    private Integer petTypeId;
}
