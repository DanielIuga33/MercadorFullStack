package dev.danieliuga.Mercador.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceEstimationDTO {
    private String brand;
    private String model;
    private int year;
    private double mileage;
    private int hp;
    private int cm3;
    private String fuelType;
    private String transmission;
    private String pollutionStandard;
    private String driveType;
    private List<String> features;
}