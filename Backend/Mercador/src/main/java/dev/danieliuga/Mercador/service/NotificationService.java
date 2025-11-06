package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.dto.NotificationDTO;
import dev.danieliuga.Mercador.mapper.NotificationMapper;
import dev.danieliuga.Mercador.model.Notification;
import dev.danieliuga.Mercador.model.NotificationMessage;
import dev.danieliuga.Mercador.repository.NotificationMessageRepository;
import dev.danieliuga.Mercador.repository.NotificationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private NotificationMapper notificationMapper;
    @Autowired
    private NotificationMessageRepository notificationMessageRepository;


    public List<NotificationDTO> getNotificationsForUser(ObjectId receiver) {
        List<NotificationDTO> result = new ArrayList<>();
        for (NotificationMessage notification : notificationMessageRepository.findByReceiver(receiver)){
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

    public void markMessageAsRead(ObjectId notificationId) {
        NotificationMessage notif = notificationMessageRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        notificationMessageRepository.save(notif);
    }

    private List<NotificationMessage> findBySenderAndReceiver(ObjectId sender, ObjectId receiver){
        List<NotificationMessage> result = new ArrayList<>();
        for (NotificationMessage notif: notificationMessageRepository.findAll()){
            if (notif.getSender().equals(sender) && notif.getReceiver().equals(receiver) && !notif.isRead()){
                result.add(notif);
            }
        }
        return result;
    }

    public void markAsReadIds(ObjectId sender, ObjectId receiver) {
        for (NotificationMessage notif : findBySenderAndReceiver(sender, receiver)){
            markMessageAsRead(notif.getId());
        }
    }
}
