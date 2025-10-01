package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.model.Conversation;
import dev.danieliuga.Mercador.model.Message;
import dev.danieliuga.Mercador.service.ConversationService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    @PostMapping("/message")
    public ResponseEntity<Conversation> createConversation(@RequestBody Conversation conv) throws Exception {
        System.out.println(conv);
        Conversation savedConversation = conversationService.addConversation(conv);
        return new ResponseEntity<>(savedConversation, HttpStatus.CREATED);
    }
}
