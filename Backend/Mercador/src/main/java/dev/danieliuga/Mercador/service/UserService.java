package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.exception.UserAlreadyExistsException;
import dev.danieliuga.Mercador.model.User;
import dev.danieliuga.Mercador.repository.UserRepository;
import dev.danieliuga.Mercador.security.PasswordUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> allUsers(){
        return  userRepository.findAll();
    }

    public Optional<User> singleUser(ObjectId id){
        return userRepository.findById(id);
    }

    public boolean userExistsByEmail(String email) {
        return userRepository.findByEmail(email) != null;
    }

    public User userFindByEmail(String email){return userRepository.findByEmail(email); }

    public User addUser(User user) {
        if (userExistsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(PasswordUtils.hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean verifyUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        return user != null && PasswordUtils.checkPassword(password, user.getPassword());
    }
}
