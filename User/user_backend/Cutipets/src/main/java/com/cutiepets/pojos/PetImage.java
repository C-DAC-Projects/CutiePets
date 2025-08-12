package com.cutiepets.pojos;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="pet_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String imageUrl;

    private Boolean isPrimary = false;

    @CreationTimestamp
    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}
