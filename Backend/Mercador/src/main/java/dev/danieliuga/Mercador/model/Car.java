package dev.danieliuga.Mercador.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cars")
public class Car {
    @Id
    private ObjectId id;

    @NotBlank(message = "Make is mandatory")
    private String make;

    @NotBlank(message = "Model is mandatory")
    private String model;

    @NotNull(message = "Year is mandatory")
    @Min(value = 1886, message = "Year must be no earlier than 1886") // First car was invented in 1886
    private int year;

    @DecimalMin(value = "0.0", inclusive = false, message = "Mileage must be a positive number")
    private double mileage;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be a positive number")
    private double price;

    private String color;

    @NotNull(message = "Fuel type is mandatory")
    private FuelType fuelType;

    private int numberOfDoors;

    @NotNull(message = "Transmission is mandatory")
    private Transmission transmission;

    @NotNull(message = "Condition is mandatory")
    private Condition condition;

    private LocalDate registrationDate;

    private String description;

    private ObjectId ownerId; // ID-ul utilizatorului care deține mașina

    // Enum-uri pentru valori limitate
    public enum FuelType {
        PETROL,
        DIESEL,
        ELECTRIC,
        HYBRID
    }

    public enum Transmission {
        MANUAL,
        AUTOMATIC
    }

    public enum Condition {
        NEW,
        USED
    }
}
