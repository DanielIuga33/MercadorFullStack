package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.dto.UserDTO;
import dev.danieliuga.Mercador.model.Role;
import dev.danieliuga.Mercador.model.User;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    // Metodă pentru conversia din User în UserDTO
    public UserDTO convertToUserDTO(User user) {
        return new UserDTO(
                user.getId().toHexString(), // Convertim ObjectId la string
                user.getName(),
                user.getSurname(),
                user.getUsername(),
                user.getEmail(),
                user.getBirthDate(),
                user.getCountry(),
                user.getCounty(),
                user.getCity(),
                user.getStreet(),
                user.getRole().name(), // Convertim enum-ul Role la string
                user.getCarIds().stream().map(ObjectId::toHexString).collect(Collectors.toList()) // Convertim ObjectId-uri la String
        );
    }

    // Metodă pentru conversia din UserDTO în User
//    public User convertToUser(UserDTO userDTO) {
//        return new User(
//                new ObjectId(userDTO.getId()), // Convertim string-ul în ObjectId
//                userDTO.getName(),
//                userDTO.getSurname(),
//                userDTO.getUsername(),
//                userDTO.getEmail(),
//                userDTO.getBirthDate(),
//                userDTO.getCountry(),
//                userDTO.getCity(),
//                userDTO.getStreet(),
//                Role.valueOf(userDTO.getRole()), // Convertim string-ul în enum
//                userDTO.getCarIds().stream().map(ObjectId::new).collect(Collectors.toList()) // Convertim string-uri în ObjectId-uri
//        );
//    }
}
