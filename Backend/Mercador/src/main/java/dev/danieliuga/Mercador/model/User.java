package dev.danieliuga.Mercador.model;

import dev.danieliuga.Mercador.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private ObjectId id;
    @NotBlank(message = "Name is mandatory")
    private String name;
    private String surname;
    @NotBlank(message = "Username is mandatory")
    private String username;
    @Email(message = "Email should be valid")
    private String email;
    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    private LocalDate birthDate;
    private String country;
    private String county;
    private String city;
    private String street;
    private Role role;
    private List<ObjectId> carIds;    // Lista de ID-uri ale mașinilor deținute de utilizator

}
