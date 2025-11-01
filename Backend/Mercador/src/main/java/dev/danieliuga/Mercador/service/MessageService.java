package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.exception.UserAlreadyExistsException;
import dev.danieliuga.Mercador.model.Message;
import dev.danieliuga.Mercador.repository.ConversationRepository;
import dev.danieliuga.Mercador.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;


    public Message addMessage(Message message) throws Exception{
        return messageRepository.save(message);
    }

    public Message modifyMessage(Message oldMessage, Message newMessage){
        return oldMessage;
    }




}
