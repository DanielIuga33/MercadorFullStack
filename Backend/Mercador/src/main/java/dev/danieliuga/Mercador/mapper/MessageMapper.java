package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.ConversationDTO;
import dev.danieliuga.Mercador.dto.MessageDTO;
import dev.danieliuga.Mercador.model.Message;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Component
public class MessageMapper {
    public MessageDTO convertToMessageDTO(Message mess) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm") // 🔹 doar ora și minut
                .withLocale(Locale.ENGLISH);

        String formattedTime = mess.getTimestamp() != null
                ? mess.getTimestamp().format(formatter)
                : null;

        return new MessageDTO(
                mess.getId().toHexString(),
                mess.getSender().toHexString(),
                mess.getReceiver().toHexString(),
                mess.getMessage(),
                formattedTime,
                mess.isRead()
        );
    }

    public List<MessageDTO> convertListToMessageDTO(List<Message> messages) {
        if (messages == null) {
            return new ArrayList<>(); // Protecție anti-crash dacă lista e null
        }

        return messages.stream()
                .map(this::convertToMessageDTO) // Apelează funcția ta pentru fiecare element
                .collect(Collectors.toList());  // Adună rezultatele într-o listă nouă
    }
}
