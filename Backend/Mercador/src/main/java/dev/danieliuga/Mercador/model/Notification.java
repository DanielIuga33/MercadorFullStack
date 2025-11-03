package dev.danieliuga.Mercador.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@TypeAlias("BaseNotification")
@Data
@SuperBuilder // <-- ESENȚIAL PENTRU MOȘTENIRE
@AllArgsConstructor
@NoArgsConstructor
public abstract class Notification { // <-- Marcată ca abstractă
    @Id
    private ObjectId id;
    private ObjectId receiver;
    private String message;
    private boolean read = false;
    private LocalDateTime timestamp = LocalDateTime.now();
}
