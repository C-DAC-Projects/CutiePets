package com.cutiepets.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="product_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;
}
