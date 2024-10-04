package dev.danieliuga.Mercador.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generează automat getter și setter pentru toate câmpurile
@NoArgsConstructor // Constructor fără argumente
@AllArgsConstructor // Constructor cu toate câmpurile
public class CarDTO {
    private String id;
    private String title;
    private String brand;
    private String model;
    private String body;
    private String vin;
    private int year;
    private double price;
    private String currency;
    private String color;
    private String fuelType;
    private String transmission;
    private String condition;
    private List<String> images;
}
