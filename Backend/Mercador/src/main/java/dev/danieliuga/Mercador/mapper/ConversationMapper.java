package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.ConversationDTO;
import dev.danieliuga.Mercador.model.Conversation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapper {
    @Autowired
    private MessageMapper messageMapper;
    public ConversationDTO convertToConversationDTO(Conversation conv) {
        return new ConversationDTO(
                conv.getId().toHexString(),
                conv.getUser1().toHexString(),
                conv.getUser2().toHexString(),
                messageMapper.convertListToMessageDTO(conv.getMessages()),
                conv.getCreatedAt()
        );
    }

}