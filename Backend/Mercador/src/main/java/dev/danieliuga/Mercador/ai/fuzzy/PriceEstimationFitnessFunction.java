package dev.danieliuga.Mercador.ai.fuzzy;

import dev.danieliuga.Mercador.dto.PriceEstimationDTO;
import dev.danieliuga.Mercador.model.Car;
import org.jgap.FitnessFunction;
import org.jgap.IChromosome;
import java.util.List;

public class PriceEstimationFitnessFunction extends FitnessFunction {

    private final List<Car> trainingData;
    private final FuzzyInferenceEngine fuzzyEngine;

    // Constructorul primește datele de antrenament și motorul de inferență
    public PriceEstimationFitnessFunction(List<Car> trainingData, FuzzyInferenceEngine engine) {
        this.trainingData = trainingData;
        this.fuzzyEngine = engine;
    }

    @Override
    protected double evaluate(IChromosome chr) {
        if (trainingData == null || trainingData.isEmpty()) {
            return 0.0; // Fitness minim (sau 0.0)
        }

        double totalSquaredError = 0;
        int[] rules = convertChromosomeToRules(chr);

        for (Car car : trainingData) {

            // 1. Pregătește DTO și Prețul Real
            PriceEstimationDTO dto = createDtoFromCar(car);
            double realPrice = car.getPrice(); // Prețul real din DB
            double basePrice = dto.getBasePrice(); // Prețul de bază/mediu

            // 2. Calculează Factorul de Preț prezis
            double predictedPriceFactor = fuzzyEngine.predictPriceFactor(dto, rules);

            // 3. Calculează Prețul Prezis: Preț de Bază * Factorul Fuzzy
            double predictedPrice = basePrice * predictedPriceFactor;

            // 4. Calculează Eroarea Pătratică (MSE)
            double error = realPrice - predictedPrice;
            totalSquaredError += (error * error);
        }

        double mse = totalSquaredError / trainingData.size();
        // JGAP MAXIMIZEAZĂ: Returnează inversul MSE pentru a face eroarea mică să însemne fitness mare.
        return 1.0 / (1.0 + mse);
    }

    // Metodă helper pentru a converti IChromosome în array de int[]
    private int[] convertChromosomeToRules(IChromosome chr) {
        int numGenes = chr.size();
        int[] rules = new int[numGenes];
        for (int i = 0; i < numGenes; i++) {
            rules[i] = (Integer) chr.getGene(i).getAllele();
        }
        return rules;
    }

    // Metodă helper: Creează DTO din Entitatea Car (TREBUIE adaptată la câmpurile tale reale din Car)
    private PriceEstimationDTO createDtoFromCar(Car car) {
        return new PriceEstimationDTO(
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getMileage(),
                car.getHp(),
                car.getCm3(),
                car.getFeatures(), // Presupune că Car are getFeatures()
                car.getPrice()  // Presupune că Car are getBasePrice()
        );
    }
}