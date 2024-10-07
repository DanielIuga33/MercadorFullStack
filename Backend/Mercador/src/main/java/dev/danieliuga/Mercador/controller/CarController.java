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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @Autowired
    private CarMapper carMapper;

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carService.allCars();

        // Convertim lista de Car în CarDTO
        List<CarDTO> carDTOs = cars.stream()
                .map(carMapper::convertToCarDTO)
                .collect(Collectors.toList());

        // Returnăm lista de CarDTO într-un ResponseEntity
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Car>> getSingleCar(@PathVariable String id){
        ObjectId objectId = new ObjectId(id);
        return new ResponseEntity<Optional<Car>>(carService.singleCar(objectId), HttpStatus.OK);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<CarDTO> getCarById(@PathVariable String id) {
//        // Convertim String-ul în ObjectId
//        ObjectId objectId;
//        try {
//            objectId = new ObjectId(id);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(null); // Poate returna un mesaj de eroare personalizat
//        }
//
//        Car car = carService.getCarById(objectId);
//
//        // Convertim Car în CarDTO
//        CarDTO carDTO = carMapper.convertToCarDTO(car);
//
//        return ResponseEntity.ok(carDTO);
//    }

    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car carData) throws Exception {
        Car savedCar = carService.addCar(carData);
        return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
    }


}
