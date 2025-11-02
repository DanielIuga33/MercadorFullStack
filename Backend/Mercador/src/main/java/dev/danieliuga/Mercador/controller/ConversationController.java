package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.dto.ConversationDTO;
import dev.danieliuga.Mercador.dto.MessageDTO;
import dev.danieliuga.Mercador.model.*;
import dev.danieliuga.Mercador.service.ConversationService;
import dev.danieliuga.Mercador.service.NotificationService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    @Autowired
    private NotificationService notificationService;


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

    @GetMapping("/unreadMessages/{id}")
    public ResponseEntity<Integer> getCountOfUnreadMessages(@PathVariable("id") String id) throws Exception {
        int count = 0;
        for (ConversationDTO conversation : conversationService.findConversationsDTO(new ObjectId(id))){
            if (conversationService.hasUnreadMessages(conversation, new ObjectId(id))) count +=1;
        }
        return new ResponseEntity<>(count, HttpStatus.OK);
    }


    @PutMapping("/markMessagesAsRead/{id}")
    public ResponseEntity<Integer> markAllMessagesAsRead(@PathVariable("id") String id) throws Exception {
        Conversation conversation = conversationService.findTheConversationWithThisMessage(new ObjectId(id));
        int counter = conversationService.markMessageAsReadForConversation(conversation, new ObjectId(id));
        return new ResponseEntity<>(counter, HttpStatus.OK);
    }

    @PostMapping("/conversation/message/")
    public ResponseEntity<Conversation> sendMessage(@RequestBody MessageDTO message) throws Exception {
        ObjectId sender = new ObjectId(message.getSender());
        ObjectId receiver = new ObjectId(message.getReceiver());
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
//        messageService.addMessage(mess);
        MessageNotification notification = new MessageNotification();
        notification.setId(new ObjectId());
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setTimestamp(LocalDateTime.now());
        notification.setMessage(mess.getMessage());
        notificationService.saveNotification(notification);
        return new ResponseEntity<>(conversation, HttpStatus.OK);
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(conversationService.getMessagesFromAConversation(new ObjectId(id)), HttpStatus.OK);
    }
}
