package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.service.CarService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars(){
        return new ResponseEntity<List<Car>>(carService.allCars(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Car>> getSingleCar(@PathVariable ObjectId id){
        return new ResponseEntity<Optional<Car>>(carService.singleCar(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car car){
        return new ResponseEntity<Car>(carService.addCar(car), HttpStatus.OK);
    }
}
