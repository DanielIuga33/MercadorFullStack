package dev.danieliuga.Mercador.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Id
    private ObjectId id;

    private ObjectId sender;
    private ObjectId receiver;
    @NotBlank
    private String message;

    private LocalDateTime timestamp;
}
