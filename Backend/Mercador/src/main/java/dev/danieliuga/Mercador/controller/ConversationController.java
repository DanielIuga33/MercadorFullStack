package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.model.Conversation;
import dev.danieliuga.Mercador.service.ConversationService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    @PostMapping("/message/{list}")
    public ResponseEntity<Conversation> createConversation(@PathVariable List<String> list)
            throws Exception {
        Conversation conv = new Conversation();
        conv.setId(new ObjectId(list.get(0)));
        conv.setUser2(new ObjectId(list.get(1)));
        Conversation savedConversation = conversationService.addConversation(conv);
        return new ResponseEntity<>(savedConversation, HttpStatus.CREATED);
    }
}
