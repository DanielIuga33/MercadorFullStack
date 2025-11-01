package dev.danieliuga.Mercador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String id;
    private String receiver; // utilizatorul care primește notificarea
    private String message;
    private boolean read;
    private LocalDateTime timestamp;
}
