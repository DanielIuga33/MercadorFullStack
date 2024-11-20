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

    public User singleUser(ObjectId id){
        return userRepository.findById(id).orElse(null);
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
    public User updateUser(ObjectId id, User user) throws Exception {
        // Căutăm utilizatorul existent în baza de date pe baza ID-ului
        User existingUser = singleUser(id);

        // Actualizează doar câmpurile care au fost trimise (cele care nu sunt null)
        if (user.getName() != null && !user.getName().equals(existingUser.getName())) {
            existingUser.setName(user.getName());
        }
        if (user.getSurname() != null && !user.getSurname().equals(existingUser.getSurname())) {
            existingUser.setSurname(user.getSurname());
        }
        if (user.getUsername() != null && !user.getUsername().equals(existingUser.getUsername())) {
            existingUser.setUsername(user.getUsername());
        }
        if (user.getEmail() != null && !user.getEmail().equals(existingUser.getEmail())) {
            // Verifică dacă email-ul există deja
            User userWithEmail = userRepository.findByEmail(user.getEmail());
            if (userWithEmail != null) {
                throw new Exception("Email already in use");
            }
            existingUser.setEmail(user.getEmail());
        }
        if (user.getBirthDate() != null) {
            existingUser.setBirthDate(user.getBirthDate());
        }
        if (user.getPassword() != null){
            if (!user.getPassword().equals(existingUser.getPassword())) {
                existingUser.setPassword(PasswordUtils.hashPassword(user.getPassword()));
            }
        }
        if (user.getCountry() != null && !user.getCountry().equals(existingUser.getCountry())) {
            existingUser.setCountry(user.getCountry());
        }
        if (user.getCounty() != null && !user.getCounty().equals(existingUser.getCounty())) {
            existingUser.setCounty(user.getCounty());
        }
        if (user.getCity() != null && !user.getCity().equals(existingUser.getCity())) {
            existingUser.setCity(user.getCity());
        }
        if (user.getStreet() != null && !user.getStreet().equals(existingUser.getStreet())) {
            existingUser.setStreet(user.getStreet());
        }

        if (!user.getCarIds().equals(existingUser.getCarIds())){
            existingUser.setCarIds(user.getCarIds());
        }

        // Salvăm modificările în baza de date
        return userRepository.save(existingUser);
    }

}
