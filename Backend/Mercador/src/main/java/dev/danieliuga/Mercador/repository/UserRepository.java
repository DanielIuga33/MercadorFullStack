package dev.danieliuga.Mercador.repository;

import dev.danieliuga.Mercador.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findByEmail(String email);
}
