package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.dto.CarDTO;
import dev.danieliuga.Mercador.dto.PriceEstimationDTO;
import dev.danieliuga.Mercador.mapper.CarMapper;
import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.service.CarService;
import dev.danieliuga.Mercador.service.PriceEstimationService;
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

    @Autowired
    private PriceEstimationService priceEstimationService;

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
    @GetMapping("/owner/{id}")
    public ResponseEntity<Optional<String>> getOwnerId(@PathVariable String id){
        ObjectId objectId = new ObjectId(id);
        return new ResponseEntity<Optional<String>>(Optional.of(carService.getIdOwner(objectId).toHexString()), HttpStatus.OK);
    }

    @GetMapping("dto/{id}")
    public ResponseEntity<Optional<CarDTO>> getSingleDTOCar(@PathVariable String id){
        ObjectId objectId = new ObjectId(id);
        Optional<Car> optionalCar = carService.singleCar(objectId);

        // Verifică dacă optional-ul conține o valoare
        if (optionalCar.isPresent()) {
            // Conversie la CarDTO
            CarDTO carDTO = carMapper.convertToCarDTO(optionalCar.get());
            return new ResponseEntity<>(Optional.of(carDTO), HttpStatus.OK);
        } else {
            // Dacă nu există, returnează un 404
            return new ResponseEntity<>(Optional.empty(), HttpStatus.NOT_FOUND);
        }
    }
    @PatchMapping("/increaseView/{id}")
    public ResponseEntity<Car> increaseViewCount(@PathVariable String id) throws Exception {
        ObjectId objectId = new ObjectId(id);
        Optional<Car> optionalCar = carService.singleCar(objectId);
        Car car =  optionalCar.orElse(new Car());
        if (!car.equals(new Car())){
            car.setViews(car.getViews() + 1);
            carService.addCar(car);
            return new ResponseEntity<>(car, HttpStatus.OK);
        }
        return new ResponseEntity<>(new Car(), HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car carData) throws Exception {
        Car savedCar = carService.addCar(carData);
        return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
    }

    @PostMapping("/estimatePrice")
    public ResponseEntity<Double> estimateCarPrice(@RequestBody PriceEstimationDTO dto) {
        try {
            double estimatedPrice = priceEstimationService.predictCarPrice(dto);
            return new ResponseEntity<>(estimatedPrice, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error estimating price: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
