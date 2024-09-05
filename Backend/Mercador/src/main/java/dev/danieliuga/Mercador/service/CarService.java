package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.repository.CarRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    public List<Car> allCars(){
        return carRepository.findAll();
    }

    public Optional<Car> singleCar(ObjectId id){
        return carRepository.findById(id);
    }
    public Car addCar(Car car){
        return carRepository.save(car);
    }
}
