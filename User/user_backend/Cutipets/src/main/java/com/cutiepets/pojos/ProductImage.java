package com.cutiepets.pojos;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="product_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String imageUrl;

    private Boolean isPrimary = false;

    @CreationTimestamp
    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}

