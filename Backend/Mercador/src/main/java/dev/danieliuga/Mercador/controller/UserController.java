package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.dto.UserDTO;
import dev.danieliuga.Mercador.mapper.UserMapper;
import dev.danieliuga.Mercador.model.Role;
import dev.danieliuga.Mercador.model.User;
import dev.danieliuga.Mercador.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.allUsers();

        // Convertim lista de User în UserDTO
        List<UserDTO> userDTOs = users.stream()
                .map(userMapper::convertToUserDTO)
                .collect(Collectors.toList());

        // Returnăm lista de UserDTO într-un ResponseEntity
        return ResponseEntity.ok(userDTOs);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        // Verificăm dacă ID-ul este valid
        if (!ObjectId.isValid(id)) {
            return ResponseEntity.badRequest().build(); // Returnăm un răspuns 400 Bad Request dacă ID-ul nu este valid
        }

        // Convertim String-ul în ObjectId
        ObjectId objectId = new ObjectId(id);

        // Căutăm utilizatorul folosind ObjectId
        User user = userService.singleUser(objectId);

        // Convertim User în UserDTO
        UserDTO userDTO = userMapper.convertToUserDTO(user);

        return ResponseEntity.ok(userDTO);
    }


    @GetMapping("/check-email")
    public boolean checkEmailExists(@RequestParam String email) {
        return userService.userExistsByEmail(email);
    }

    @GetMapping("/findByEmail")
    public ResponseEntity<UserDTO> findByEmail(@RequestParam String email) {
        User user = userService.userFindByEmail(email);
        UserDTO userDTO = userMapper.convertToUserDTO(user);

        if (userDTO != null) {
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Returnează 404 dacă utilizatorul nu este găsit
        }
    }

//    @PatchMapping("/{email}")
//    public ResponseEntity<User> updateUser(@PathVariable String email, @RequestBody User updatedUser) {
//        try {
//            User user = userService.updateUser(email, updatedUser);
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null);
//        }
//    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        ObjectId userId =  new ObjectId(id);
        try {
            User user = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
