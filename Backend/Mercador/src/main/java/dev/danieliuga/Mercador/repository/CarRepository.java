package dev.danieliuga.Mercador.repository;

import dev.danieliuga.Mercador.model.Car;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends MongoRepository<Car, ObjectId> {
}
