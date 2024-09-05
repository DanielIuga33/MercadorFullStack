package dev.danieliuga.Mercador.controller;

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

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers(){
        return new ResponseEntity<List<User>>(userService.allUsers(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<User>> getSingleUser(@PathVariable ObjectId id){
        return new ResponseEntity<Optional<User>>(userService.singleUser(id),HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        User createdUser = userService.addUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/check-email")
    public boolean checkEmailExists(@RequestParam String email) {
        return userService.userExistsByEmail(email);
    }

    @GetMapping("/findByEmail")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        User user = userService.userFindByEmail(email);

        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Returnează 404 dacă utilizatorul nu este găsit
        }
    }

//    @PostMapping("/update")
//    public ResponseEntity<User> updateUser(@RequestBody UpdateUserRequest updateUserRequest) {

    @PostMapping("/test-add")
    public ResponseEntity<User> addTestUser() {
        User testUser = new User();
        testUser.setName("Test");
        testUser.setSurname("User");
        testUser.setUsername("testuser");
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password123");  // Asigură-te că folosești hashing pentru parole în aplicația reală

        // Creăm adresa pentru utilizator
        testUser.setCountry("TestCountry");
        testUser.setCity("TestCity");
        testUser.setStreet("TestStreet");

        testUser.setBirthDate(LocalDate.of(2000, 1, 1));
        testUser.setRole(Role.USER);  // Asigură-te că Role este un enum valid
        testUser.setCarIds(Collections.emptyList()); // Dacă ai o listă de ID-uri de mașini, poți adăuga ID-uri valide aici

        // Salvăm utilizatorul în baza de date
        User createdUser = userService.addUser(testUser);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }


}
