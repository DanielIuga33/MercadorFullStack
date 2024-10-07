package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.dto.CarDTO;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.stream.Collectors;

@Component
public class CarMapper {
    public CarDTO convertToCarDTO(Car car) {
        return new CarDTO(
                car.getId().toHexString(),
                car.getTitle(),
                car.getBrand(),
                car.getModel(),
                car.getBody(),
                car.getVin(),
                car.getYear(),
                car.getPrice(),
                car.getCurrency(),
                car.getColor(),
                car.getFuelType().name(),
                car.getTransmission().name(),
                car.getCondition().name(),
                car.getImages().get(0)
        );
    }
}
