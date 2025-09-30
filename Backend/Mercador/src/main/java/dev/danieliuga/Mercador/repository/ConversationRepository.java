package dev.danieliuga.Mercador.repository;

import dev.danieliuga.Mercador.model.Conversation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ConversationRepository extends MongoRepository<Conversation, ObjectId> {
    @Query("{ $or: [ { $and: [ { 'user1': ?0 }, { 'user2': ?1 } ] }, { $and: [ { 'user1': ?1 }, { 'user2': ?0 } ] } ] }")
    Conversation findConversationBetween(ObjectId user1, ObjectId user2);
}
