package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.dto.CarDTO;
import dev.danieliuga.Mercador.mapper.CarMapper;
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

    @Autowired
    private CarMapper carMapper;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<Car> cars = carService.allCars();

        // Convertim lista de Car în CarDTO
        List<CarDTO> carDTOs = cars.stream()
                .map(carMapper::convertToCarDTO).toList();

        // Returnăm lista de CarDTO într-un ResponseEntity
        return ResponseEntity.ok(carDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Car>> getSingleCar(@PathVariable String id){
        ObjectId objectId = new ObjectId(id);
        return new ResponseEntity<Optional<Car>>(carService.singleCar(objectId), HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car carData) throws Exception {
        Car savedCar = carService.addCar(carData);
        return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
    }


}
