package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.model.Conversation;
import dev.danieliuga.Mercador.repository.ConversationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;

    private Conversation addConversation(Conversation conversation) throws Exception{
        return conversationRepository.save(conversation);
    }

    private boolean exists(ObjectId user1, ObjectId user2){
        return conversationRepository.findConversationBetween(user1, user2) != null;
    }
}
