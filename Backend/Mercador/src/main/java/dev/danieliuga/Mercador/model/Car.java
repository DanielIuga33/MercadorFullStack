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
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cars")
public class Car {
    @Id
    private ObjectId id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Brand is mandatory")
    private String brand;

    @NotBlank(message = "Model is mandatory")
    private String model;

    @NotBlank(message = "Body is mandatory")
    private String body;

    private String vin;

    @NotNull(message = "Year is mandatory")
    @Min(value = 1886, message = "Year must be no earlier than 1886") // First car was invented in 1886
    private int year;

    private int cm3;

    private int hp;

    @DecimalMin(value = "0.0", inclusive = false, message = "Mileage must be a positive number")
    private double mileage;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be a positive number")
    private double price;

    @NotBlank(message = "Currency is mandatory")
    private String currency;

    private String color;

    @NotNull(message = "Fuel type is mandatory")
    private FuelType fuelType;

    private int numberOfDoors;

    @NotNull(message = "Transmission is mandatory")
    private Transmission transmission;

    @NotNull(message = "Condition is mandatory")
    private Condition condition;

    private String description;

    private String steeringwheel;

    private ObjectId ownerId; // ID-ul utilizatorului care deține mașina

    // O listă de imagini asociate cu mașina, sub formă de URL-uri
    private List<String> images;

    @NotBlank(message = "City is mandatory")
    private String city;

    @NotBlank(message = "County is mandatory")
    private String county;

    // 2. Detalii Tehnice Extra
    @NotBlank(message = "Pollution standard is mandatory")
    private String pollutionStandard; // Euro 6, Euro 5...

    private String driveType; // FWD, RWD, AWD

    // 3. Detalii Vânzare
    private boolean negotiable; // Preț negociabil
    private boolean exchange;   // Acceptă schimburi

    // 4. Dotări (pentru filtrare avansată)
    private List<String> features;

    private LocalDateTime createdAt = LocalDateTime.now(); // Inițializat automat
    private boolean active = true; // Implicit activ la creare
    private boolean sold = false;
    private int views = 0;

    // Enum-uri pentru valori limitate
    public enum FuelType {
        PETROL,
        DIESEL,
        GPL,
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
