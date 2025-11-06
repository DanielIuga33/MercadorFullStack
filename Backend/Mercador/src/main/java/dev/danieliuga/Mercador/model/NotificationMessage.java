package dev.danieliuga.Mercador.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder; // Import NOU
import org.bson.types.ObjectId;

// Deoarece Notification are deja @Document, nu-l mai pui aici.
@Data
@SuperBuilder // <-- ESENȚIAL: Moștenește Builder-ul de la părinte
@NoArgsConstructor
@AllArgsConstructor
@org.springframework.data.annotation.TypeAlias("Message") // Alias specific
public class NotificationMessage extends Notification {

    // Numele câmpului 'sender' este mai clar ca 'idSender'
    private ObjectId sender;

}