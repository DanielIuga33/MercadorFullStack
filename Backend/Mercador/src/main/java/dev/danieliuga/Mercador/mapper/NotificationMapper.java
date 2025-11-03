package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.NotificationDTO;
import dev.danieliuga.Mercador.model.Notification;
import dev.danieliuga.Mercador.model.NotificationMessage;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDTO convertToNotificationDTO(Notification notification){

        // 1. Mapează câmpurile de bază comune
        // TREBUIE SĂ INCLUZI TOATE ARGUMENTELE DIN @AllArgsConstructor:
        // (id, receiver, message, read, timestamp, senderName, senderId)
        NotificationDTO dto = new NotificationDTO(
                notification.getId().toHexString(),
                notification.getReceiver().toHexString(),
                notification.getMessage(),
                notification.isRead(),
                notification.getTimestamp(),
                null, // <-- Adaugă null pentru senderName (String)
                null  // <-- Adaugă null pentru senderId (String)
        );

        // 2. Verifică tipul și adaugă câmpurile specifice
        if (notification instanceof NotificationMessage) {
            NotificationMessage messageNotif = (NotificationMessage) notification;

            // Mapează idSender în senderId pe DTO
            if (messageNotif.getIdSender() != null) {
                dto.setSenderId(messageNotif.getIdSender().toHexString());
            }

            // Notă: senderName va fi setat în Service Layer.
        }

        return dto;
    }
}