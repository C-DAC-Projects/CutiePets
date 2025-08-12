package com.cutiepets.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private Integer age;
    private String gender;
    private Double price;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PetImage> images;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Boolean available;

    @ManyToOne
    @JoinColumn(name = "breed_id")
    private Breed breed;

    private LocalDateTime submittedAt;

    public boolean isAvailable() {
        return Boolean.TRUE.equals(available);
    }
}
