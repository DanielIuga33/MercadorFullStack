package dev.danieliuga.Mercador.controller;

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
    public ResponseEntity<Car> addCar(@RequestParam Map<String, String> carData,
                                      @RequestParam("images") MultipartFile[] images) {
        Car car = new Car();
        // Populați obiectul car cu datele din carData
        car.setTitle(carData.get("title"));
        car.setBrand(carData.get("brand"));
        car.setModel(carData.get("model"));
        car.setBody(carData.get("body"));
        car.setYear(Integer.parseInt(carData.get("year"))); // Convertește string în int
        car.setCm3(Integer.parseInt(carData.get("cm3"))); // Convertește string în int
        car.setHp(Integer.parseInt(carData.get("hp"))); // Convertește string în int
        car.setMileage(Double.parseDouble(carData.get("mileage"))); // Convertește string în double
        car.setPrice(Double.parseDouble(carData.get("price"))); // Convertește string în double
        car.setCurrency(carData.get("currency"));
        car.setColor(carData.get("color"));

        // Populează fuelType, transmission și condition folosind enum-urile
        car.setFuelType(Car.FuelType.valueOf(carData.get("fuelType").toUpperCase())); // Convertește în enum
        car.setTransmission(Car.Transmission.valueOf(carData.get("transmission").toUpperCase())); // Convertește în enum
        car.setCondition(Car.Condition.valueOf(carData.get("condition").toUpperCase())); // Convertește în enum

        // Obține data înregistrării
        car.setRegistrationDate(LocalDate.now()); // Data curentă

        car.setDescription(carData.get("description"));
        car.setSteeringwheel(carData.get("steeringwheel"));
        car.setNumberOfDoors(Integer.parseInt(carData.get("numberOfDoors"))); // Convertește string în int

        List<byte[]> imageBlobs = new ArrayList<>();
        for (MultipartFile image : images) {
            try {
                byte[] imageBytes = image.getBytes();
                imageBlobs.add(imageBytes); // Adaugă imaginea ca BLOB
            } catch (IOException e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        car.setImages(imageBlobs); // Stochează imaginile ca BLOB-uri

        Car savedCar = carService.addCar(car);
        return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
    }

}
