package com.cutiepets.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="pet_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "petType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Breed> breeds;

    @OneToMany(mappedBy = "petType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products;
}
