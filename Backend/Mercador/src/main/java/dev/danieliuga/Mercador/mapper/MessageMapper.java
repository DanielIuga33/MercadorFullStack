package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.ConversationDTO;
import dev.danieliuga.Mercador.dto.MessageDTO;
import dev.danieliuga.Mercador.model.Message;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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
                formattedTime
        );
    }
}
