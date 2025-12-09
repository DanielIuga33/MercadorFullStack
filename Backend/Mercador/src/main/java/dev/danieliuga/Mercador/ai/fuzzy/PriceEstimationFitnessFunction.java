package dev.danieliuga.Mercador.ai.fuzzy;

import dev.danieliuga.Mercador.dto.PriceEstimationDTO;
import dev.danieliuga.Mercador.model.Car;
import org.jgap.FitnessFunction;
import org.jgap.IChromosome;
import java.time.Year;
import java.util.List;

public class PriceEstimationFitnessFunction extends FitnessFunction {

    private final List<Car> trainingData;
    private final FuzzyInferenceEngine fuzzyEngine;

    public PriceEstimationFitnessFunction(List<Car> trainingData, FuzzyInferenceEngine engine) {
        this.trainingData = trainingData;
        this.fuzzyEngine = engine;
    }

    @Override
    protected double evaluate(IChromosome chr) {
        if (trainingData == null || trainingData.isEmpty()) {
            return 0.0;
        }

        double totalSquaredError = 0;

        // Convertim cromozomul curent în reguli fuzzy
        int[] rules = convertChromosomeToRules(chr);

        for (Car car : trainingData) {
            // 1. Convertim Entitatea Car în DTO
            PriceEstimationDTO dto = createDtoFromCar(car);

            // 2. Obținem prețul REAL din baza de date (ȚINTA noastră)
            double realPrice = car.getPrice();

            // 3. Calculăm un Preț de Bază (Catalog) estimativ
            // (Asta înlocuiește "dto.get()" care îți dădea eroare)
            double estimatedBasePrice = calculateMockBasePrice(car.getBrand(), car.getYear());

            // 4. Cerem motorului Fuzzy să ne dea factorul de ajustare (ex: 0.8 sau 1.2)
            // folosind regulile din acest cromozom
            double predictedFactor = fuzzyEngine.predictPriceFactor(dto, rules);

            // 5. Calculăm prețul final prezis de acest set de reguli
            double predictedPrice = estimatedBasePrice * predictedFactor;

            // 6. Calculăm cât de mult a greșit algoritmul (Eroarea)
            // MSE (Mean Squared Error) penalizează greșelile mari
            double error = realPrice - predictedPrice;
            totalSquaredError += (error * error);
        }

        // Calculăm eroarea medie
        double mse = totalSquaredError / trainingData.size();

        // JGAP vrea un fitness MARE pentru soluții bune.
        // Dacă eroarea (mse) e mică, fitness-ul e mare.
        // Adăugăm 1.0 la numitor pentru a evita împărțirea la 0.
        return 1000000.0d / (1.0d + mse);
    }

    // --- METODE AJUTĂTOARE ---

    private int[] convertChromosomeToRules(IChromosome chr) {
        int numGenes = chr.size();
        int[] rules = new int[numGenes];
        for (int i = 0; i < numGenes; i++) {
            rules[i] = (Integer) chr.getGene(i).getAllele();
        }
        return rules;
    }

    /**
     * Construiește DTO-ul complet necesar pentru noul algoritm complex.
     */
    private PriceEstimationDTO createDtoFromCar(Car car) {
        // Atenție: Asigură-te că entitatea Car are toate aceste gettere!
        return new PriceEstimationDTO(
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getMileage(),
                car.getHp(),
                car.getCm3(),
                // Adăugăm câmpurile noi necesare pentru algoritmul actualizat
                car.getFuelType().toString(),
                car.getTransmission().toString(),
                car.getPollutionStandard(),
                car.getDriveType(),
                car.getFeatures()
        );
    }

    /**
     * Această metodă simulează un preț de catalog.
     * Algoritmul genetic va învăța să corecteze erorile acestei estimări brute.
     */
    private double calculateMockBasePrice(String brand, int year) {
        double startPrice = 20000; // Valoare default

        if (brand != null) {
            switch (brand.toUpperCase()) {
                case "BMW":
                case "MERCEDES-BENZ":
                case "AUDI":
                case "PORSCHE":
                case "LAND ROVER":
                    startPrice = 45000;
                    break;
                case "VOLKSWAGEN":
                case "VOLVO":
                case "TOYOTA":
                    startPrice = 28000;
                    break;
                case "FORD":
                case "SKODA":
                case "RENAULT":
                case "OPEL":
                    startPrice = 19000;
                    break;
                case "DACIA":
                case "FIAT":
                    startPrice = 13000;
                    break;
            }
        }

        // Calculăm deprecierea standard (fără a ține cont de KM sau stare, de aia se ocupă Fuzzy)
        int currentYear = Year.now().getValue();
        int age = currentYear - year;

        double depreciationRate = 0.12;

        // Scădem maxim 90% din valoare (să nu ajungă la 0)
        double depreciation = Math.min(age * depreciationRate, 0.90);

        return startPrice * (1.0 - depreciation);
    }
}