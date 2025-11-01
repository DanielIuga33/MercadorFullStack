package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.dto.NotificationDTO;
import dev.danieliuga.Mercador.mapper.NotificationMapper;
import dev.danieliuga.Mercador.model.Notification;
import dev.danieliuga.Mercador.repository.NotificationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private NotificationMapper notificationMapper;


    public List<NotificationDTO> getNotificationsForUser(ObjectId receiver) {
        List<NotificationDTO> result = new ArrayList<>();
        for (Notification notification : notificationRepository.findByReceiver(receiver)){
            result.add(notificationMapper.convertToNotificationDTO(notification));
        }
        return result;
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void markAsRead(ObjectId notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        notificationRepository.save(notif);
    }
}
