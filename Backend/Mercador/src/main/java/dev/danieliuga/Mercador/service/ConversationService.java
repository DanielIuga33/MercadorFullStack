package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.dto.ConversationDTO;
import dev.danieliuga.Mercador.dto.MessageDTO;
import dev.danieliuga.Mercador.mapper.ConversationMapper;
import dev.danieliuga.Mercador.mapper.MessageMapper;
import dev.danieliuga.Mercador.model.Conversation;
import dev.danieliuga.Mercador.model.Message;
import dev.danieliuga.Mercador.repository.ConversationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private MessageService messageService;
    @Autowired
    private ConversationMapper conversationMapper;
    @Autowired
    private MessageMapper messageMapper;

    public Conversation addConversation(Conversation conversation) throws Exception{
        if (!exists(conversation.getUser1(), conversation.getUser2())) {
            return conversationRepository.save(conversation);
        }
        else throw new Exception("Conversation already exist !");
    }

    public boolean exists(ObjectId user1, ObjectId user2){
        return conversationRepository.findConversationBetween(user1, user2) != null;
    }
    public ObjectId getConversation(ObjectId user1, ObjectId user2){
        if (exists(user1, user2)){
            return conversationRepository.findConversationBetween(user1, user2).getId();
        }
        else return null;
    }
    public void addMessageToConversation(ObjectId user1, ObjectId user2, Message message) throws Exception{
        if (exists(user1, user2)){
            Conversation conversation = conversationRepository.findConversationBetween(user1, user2);
            List<Message> messages = new ArrayList<>();
            if (conversation.getMessages()!=null) {
                messages.addAll(conversation.getMessages());
            }
            message.setId(new ObjectId());
            messageService.addMessage(message);
            messages.add(message);
            conversation.setMessages(messages);
            conversationRepository.deleteById(conversation.getId());
            conversationRepository.save(conversation);
        }
    }
    public void deleteConversation(ObjectId user1, ObjectId user2){
        if (exists(user1, user2)) {
            conversationRepository.delete(conversationRepository.findConversationBetween(user1, user2));
        }
    }
    public List<Conversation> findConversations(ObjectId id){
        List<Conversation> conversations = new ArrayList<>();
        for (Conversation conversation : conversationRepository.findAll()){
            if (conversation.getUser1().equals(id) || conversation.getUser2().equals(id)){
                conversations.add(conversation);
            }
        }
        return conversations;
    }
    public List<ConversationDTO> findConversationsDTO(ObjectId id){
        System.out.println(id);
        List<Conversation> conversations = findConversations(id);
        List<ConversationDTO> result = new ArrayList<>();
        for (Conversation conv : conversations){
            result.add(conversationMapper.convertToConversationDTO(conv));
        }
        return result;
    }

    public Conversation findConversationById(ObjectId id){
        return conversationRepository.findById(id).orElse(null);
    }

    public List<MessageDTO> getMessagesFromAConversation(ObjectId id){
        List<MessageDTO> result = new ArrayList<>();
        for (Message message : findConversationById(id).getMessages()){
            System.out.println(message);
            result.add(messageMapper.convertToMessageDTO(message));
        }
        return result;
    }
}
