package com.backend.soundrentals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer dni;
    private String nombre;
    private String apellido;
    private String celular;
    private String email;
    private String password;
    private String direccion;
    private String img;


    @ManyToOne
    @JoinColumn (name = "city_id")
    private Ciudad ciudad;

    @ManyToOne
    @JoinColumn (name = "country_id")
    private Pais pais;

    @ManyToOne
    @JoinColumn (name = "province_id")
    private Provincia provincia;

    @ManyToOne
    @JoinColumn (name = "roles_id")
    private Roles rol;

    @ManyToOne
    @JoinColumn (name = "user_state_id")
    private EstadoUsuario estadousuario;


}