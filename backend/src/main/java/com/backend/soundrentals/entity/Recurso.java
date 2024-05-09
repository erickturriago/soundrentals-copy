package com.backend.soundrentals.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter
@Getter
public class Recurso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String dni;

    @ManyToOne
    @JoinColumn(name = "categoria_id") // Nombre de la columna de clave foránea
    private Categoria categoria;
}
