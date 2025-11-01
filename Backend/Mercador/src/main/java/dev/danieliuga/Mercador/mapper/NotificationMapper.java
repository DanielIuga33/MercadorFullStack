package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.NotificationDTO;
import dev.danieliuga.Mercador.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDTO convertToNotificationDTO(Notification notification){
        return new NotificationDTO(
                notification.getId().toHexString(),
                notification.getReceiver().toHexString(),
                notification.getMessage(),
                notification.isRead(),
                notification.getTimestamp()
        );
    }
}
