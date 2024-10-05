package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.model.User;
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

    @Autowired
    private UserService userService;

    public List<Car> allCars(){
        return carRepository.findAll();
    }

    public Optional<Car> singleCar(ObjectId id){
        return carRepository.findById(id);
    }
    public Car addCar(Car car) throws Exception {
        Car savedCar = carRepository.save(car);
        User user = userService.singleUser((car.getOwnerId()));
        List<ObjectId> newCarIds = user.getCarIds();
        if (!newCarIds.contains(savedCar.getId())){
            newCarIds.add(savedCar.getId());
            user.setCarIds(newCarIds);
        }
        userService.updateUser(user.getId(), user);
        return carRepository.save(car);
    }
}
