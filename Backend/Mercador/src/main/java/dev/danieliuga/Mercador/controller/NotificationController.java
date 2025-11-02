package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.dto.NotificationDTO;
import dev.danieliuga.Mercador.model.Notification;
import dev.danieliuga.Mercador.service.NotificationService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable String userId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsForUser(new ObjectId(userId));
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/")
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        return ResponseEntity.ok(notificationService.saveNotification(notification));
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<Void> markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(new ObjectId(notificationId));
        return ResponseEntity.ok().build();
    }

}
