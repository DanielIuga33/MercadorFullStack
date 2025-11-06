// Presupunem structura DTO: NotificationDTO(id, receiver, senderId, message, read, timestamp)
// (7 argumente inițiale - 1 eliminat = 6 argumente)

package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.NotificationDTO;
import dev.danieliuga.Mercador.model.Notification;
import dev.danieliuga.Mercador.model.NotificationMessage;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDTO convertToNotificationDTO(Notification notification){

        // 1. Mapează câmpurile de bază comune și setează câmpul 'sender' (senderId) inițial pe null

        // 💡 ATENȚIE: Trebuie să te asiguri că constructorul NotificationDTO primește ordinea corectă
        // și numărul corect de argumente (6, dacă senderName a fost eliminat).
        NotificationDTO dto = new NotificationDTO(
                notification.getId().toHexString(),
                notification.getReceiver().toHexString(),
                null, // Aici se pune ID-ul expeditorului (senderId), inițial null
                notification.getMessage(),
                notification.isRead(),
                notification.getTimestamp()
        );

        // 2. Verifică dacă notificarea este de tip MESSAGE (caz în care are un expeditor)
        if (notification instanceof NotificationMessage messageNotif) {

            // Această operațiune (casting) este valabilă doar dacă NotificationMessage EXTINDE Notification.

            // 3. Dacă e de tip Message, setează ID-ul expeditorului (senderId/sender)
            if (messageNotif.getSender() != null) {
                // Setează câmpul 'sender' (care probabil este senderId) pe DTO
                dto.setSender(messageNotif.getSender().toHexString());
            }

            // Notă: Nu mai este nevoie de "senderName" aici.
        }

        // 4. Dacă nu este un Message, senderId rămâne null (sau Service-ul îl va popula ulterior)
        return dto;
    }
}