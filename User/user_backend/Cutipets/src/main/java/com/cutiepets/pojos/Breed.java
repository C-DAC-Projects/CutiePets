package com.cutiepets.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="breeds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Breed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "pet_type_id")
    private PetType petType;

    @OneToMany(mappedBy = "breed", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets;
}

