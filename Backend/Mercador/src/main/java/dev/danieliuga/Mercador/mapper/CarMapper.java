package dev.danieliuga.Mercador.mapper;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.dto.CarDTO;
import org.springframework.stereotype.Component;


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
                car.getCm3(),
                car.getHp(),
                car.getPrice(),
                car.getCurrency(),
                car.getColor(),
                car.getFuelType().name(),
                car.getTransmission().name(),
                car.getCondition().name(),
                car.getSteeringwheel(),
                car.getMileage(),
                car.getNumberOfDoors(),
                car.getImages().getFirst(),
                car.getCity(),
                car.getCounty(),
                car.getPollutionStandard(),
                car.getDriveType(),
                car.isNegotiable(),
                car.isExchange(),
                car.getFeatures(),
                car.getCreatedAt(),
                car.getViews()
        );
    }
}
