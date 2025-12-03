package dev.danieliuga.Mercador.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private int cm3;
    private int hp;
    private double price;
    private String currency;
    private String color;
    private String fuelType;
    private String transmission;
    private String condition;
    private String steeringwheel;
    private double mileage;
    private int numberOfDoors;
    private String image;
    private String city;
    private String county;
    private String pollutionStandard;
    private String driveType;
    private boolean negotiable;
    private boolean exchange;
    private List<String> features;
    private LocalDateTime createdAt;
    private int views;
}
