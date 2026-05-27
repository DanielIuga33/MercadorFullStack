package dev.danieliuga.Mercador.dto;

public class FavoriteRequest {
    private String userId;
    private String carId;

    // Getters și Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCarId() { return carId; }
    public void setCarId(String carId) { this.carId = carId; }
}
