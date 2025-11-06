package dev.danieliuga.Mercador.repository;

import dev.danieliuga.Mercador.model.NotificationMessage;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationMessageRepository extends MongoRepository<NotificationMessage, ObjectId>{
    List<NotificationMessage> findByReceiver(ObjectId receiver);
}
