package dev.danieliuga.Mercador.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.danieliuga.Mercador.dto.ConversationDTO;
import dev.danieliuga.Mercador.dto.MessageDTO;
import dev.danieliuga.Mercador.mapper.ConversationMapper;
import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.model.Conversation;
import dev.danieliuga.Mercador.model.Message;
import dev.danieliuga.Mercador.service.ConversationService;
import dev.danieliuga.Mercador.service.MessageService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    @Autowired
    private MessageService messageService;


    @PostMapping("/message")
    public ResponseEntity<Conversation> createConversation(@RequestBody Conversation conv) throws Exception {
        if (!conversationService.exists(conv.getUser1(), conv.getUser2())){
            Conversation savedConversation = conversationService.addConversation(conv);
            return new ResponseEntity<>(savedConversation, HttpStatus.CREATED);
        }
        return null;
    }
    @GetMapping("/{id}")
    public ResponseEntity<List<ConversationDTO>> getConversations(@PathVariable("id") String id) throws Exception {
        return new ResponseEntity<>(conversationService.findConversationsDTO(new ObjectId(id)), HttpStatus.OK);
    }


    @PostMapping("/conversation/message/")
    public ResponseEntity<Conversation> sendMessage(@RequestBody MessageDTO message) throws Exception {
        ObjectId sender = new ObjectId(message.getSender());
        System.out.println(message.getSender());
        ObjectId receiver = new ObjectId(message.getReceiver());
        System.out.println("Da Ba");
        Message mess = new Message();
        mess.setId(new ObjectId());
        mess.setMessage(message.getMessage());
        mess.setSender(sender);
        mess.setReceiver(receiver);
        mess.setTimestamp(LocalDateTime.now());

        Conversation conversation = new Conversation();
        conversation.setUser1(new ObjectId(message.getSender()));
        conversation.setUser2(new ObjectId(message.getReceiver()));
        if(conversationService.exists(conversation.getUser1(), conversation.getUser2())) {
            conversationService.addMessageToConversation(sender, receiver, mess);
        }
        else{
            List<Message> messages = new ArrayList<>();
            messages.add(mess);
            conversation.setMessages(messages);
            conversationService.addConversation(conversation);
        }
        messageService.addMessage(mess);
        return new ResponseEntity<>(conversation, HttpStatus.OK);
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(conversationService.getMessagesFromAConversation(new ObjectId(id)), HttpStatus.OK);
    }
}
