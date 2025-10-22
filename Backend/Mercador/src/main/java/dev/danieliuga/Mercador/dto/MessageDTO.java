package dev.danieliuga.Mercador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Generează automat getter și setter pentru toate câmpurile
@NoArgsConstructor // Constructor fără argumente
@AllArgsConstructor // Constructor cu toate câmpurile
public class MessageDTO {
    private String id;
    private String sender;
    private String receiver;
    private String message;
    private String time;
}
