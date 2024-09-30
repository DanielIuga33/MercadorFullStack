package dev.danieliuga.Mercador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id; // Id-ul ca String, convertit din ObjectId
    private String name;
    private String surname;
    private String username;
    private String email;
    private LocalDate birthDate;
    private String country;
    private String city;
    private String street;
    private String role; // Poate fi util să fie un String pentru a simplifica expunerea
    private List<String> carIds; // Convertim ObjectId la String
}
