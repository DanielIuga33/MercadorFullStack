package dev.danieliuga.Mercador.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    private ObjectId id;
    private ObjectId receiver; // utilizatorul care primește notificarea
    private String message;
    private boolean read = false;
    private LocalDateTime timestamp = LocalDateTime.now();
}
