package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.dto.FavoriteRequest;
import dev.danieliuga.Mercador.dto.UserDTO;
import dev.danieliuga.Mercador.mapper.UserMapper;
import dev.danieliuga.Mercador.model.User;
import dev.danieliuga.Mercador.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
//@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        User createdUser = userService.addUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

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

    @PostMapping("/favorites/add")
    public ResponseEntity<Void> addToFavorite(@RequestBody FavoriteRequest request) {
        try {
            // 1. Găsim utilizatorul folosind userId-ul primit din JSON
            User user = userService.singleUser(new ObjectId(request.getUserId()));

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // 2. Luăm lista actuală de favorite
            List<ObjectId> favouriteCars = user.getFavoriteCars();

            // Protecție: dacă lista e null (de exemplu la utilizatori noi), o inițializăm
            if (favouriteCars == null) {
                favouriteCars = new ArrayList<>();
            }

            ObjectId carObjectId = new ObjectId(request.getCarId());

            // Protecție: adăugăm mașina doar dacă nu este deja în listă (să nu avem duplicate)
            if (!favouriteCars.contains(carObjectId)) {
                favouriteCars.add(carObjectId);
                user.setFavoriteCars(favouriteCars);
                userService.updateUser(user.getId(), user);
            }
            System.out.println(user);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            System.out.println("Error adding to favorites: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/favorites/remove")
    public ResponseEntity<Void> removeFromFavorites(@RequestBody FavoriteRequest request) {
        try {
            User user = userService.singleUser(new ObjectId(request.getUserId()));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            List<ObjectId> favouriteCars = user.getFavoriteCars();

            if (favouriteCars == null) {
                favouriteCars = new ArrayList<>();
            }
            ObjectId carObjectId = new ObjectId(request.getCarId());

            if (favouriteCars.contains(carObjectId)) {
                favouriteCars.remove(carObjectId);
                user.setFavoriteCars(favouriteCars);
                userService.updateUser(user.getId(), user);
            }
            } catch (Exception e) {
            System.out.println("Error adding to favorites: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/favoriteCars/{id}")
    public ResponseEntity<List<ObjectId>> getFavoriteCars(@PathVariable String id) {
        if (!ObjectId.isValid(id)) {
            return ResponseEntity.badRequest().build(); // Returnăm un răspuns 400 Bad Request dacă ID-ul nu este valid
        }
        return new ResponseEntity<>(userService.singleUser(new ObjectId(id)).getFavoriteCars(), HttpStatus.OK);
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
