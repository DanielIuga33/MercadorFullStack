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
    private String receiver;
    private String message;
    private boolean read;
    private LocalDateTime timestamp;

    // Câmpuri suplimentare pentru NotificationMessage
    private String senderName; // Populat în Service Layer
    private String senderId;   // Extras din NotificationMessage

    // Câmpul 'conversationId' a fost eliminat
}