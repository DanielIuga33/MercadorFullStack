package dev.danieliuga.Mercador.model;


import lombok.Data;
import lombok.EqualsAndHashCode;
import org.bson.types.ObjectId;

@Data
@EqualsAndHashCode(callSuper = true)
public class MessageNotification extends Notification {
    private ObjectId sender;
    private ObjectId conversationId;
}
