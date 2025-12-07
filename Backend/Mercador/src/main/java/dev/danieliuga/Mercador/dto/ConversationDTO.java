package dev.danieliuga.Mercador.dto;

import dev.danieliuga.Mercador.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data // Generează automat getter și setter pentru toate câmpurile
@NoArgsConstructor // Constructor fără argumente
@AllArgsConstructor // Constructor cu toate câmpurile
public class ConversationDTO {
    private String id;
    private String user1;
    private String user2;
    private List<MessageDTO> messages;
    private LocalDateTime createdAt;
}