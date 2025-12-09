package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.ai.fuzzy.FuzzyInferenceEngine;
import dev.danieliuga.Mercador.ai.fuzzy.FuzzyRuleOptimizer;
import dev.danieliuga.Mercador.dto.PriceEstimationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
public class PriceEstimationService {

    @Autowired
    private FuzzyRuleOptimizer ruleOptimizer;

    // Instanțiem motorul fuzzy (sau îl poți face Bean)
    private final FuzzyInferenceEngine fuzzyEngine = new FuzzyInferenceEngine();

    public double predictCarPrice(PriceEstimationDTO dto) {
        // 1. Calculăm un Preț de Bază (Estimare grosieră fără Fuzzy)
        double basePrice = calculateBasePrice(dto.getBrand(), dto.getModel(), dto.getYear());

        // 2. Obținem regulile optime din algoritmul genetic
        int[] rules = ruleOptimizer.getBestRules();

        // 3. Calculăm Factorul de Ajustare folosind Logica Fuzzy
        // (Ex: 0.8 pentru mașină uzată, 1.2 pentru mașină dotată)
        double fuzzyFactor = fuzzyEngine.predictPriceFactor(dto, rules);

//        System.out.println("Base Price: " + basePrice);
//        System.out.println("Fuzzy Factor: " + fuzzyFactor);

        // 4. Prețul Final
        double finalPrice = basePrice * fuzzyFactor;

        // Siguranță: Să nu returnăm preț negativ
        return Math.max(finalPrice, 500.0);
    }

    /**
     * O metodă simplistă pentru a stabili un preț de pornire.
     * Într-o aplicație reală, ai lua asta dintr-o bază de date cu prețuri medii.
     */
    private double calculateBasePrice(String brand, String model, int year) {
        double startingPrice = 20000; // Default

        // Ajustare după Brand (Exemple)
        if (brand != null) {
            switch (brand.toUpperCase()) {
                case "BMW":
                case "MERCEDES-BENZ":
                case "AUDI":
                    startingPrice = 45000;
                    break;
                case "VOLKSWAGEN":
                case "TOYOTA":
                    startingPrice = 25000;
                    break;
                case "DACIA":
                    startingPrice = 12000;
                    break;
                case "PORSCHE":
                    startingPrice = 80000;
                    break;
            }
        }

        // Ajustare după Vechime (Depreciere)
        int currentYear = Year.now().getValue();
        int age = currentYear - year;

        // Scădem 5% pentru fiecare an de vechime, dar nu mai mult de 80%
        double depreciation = Math.min(age * 0.05, 0.80);

        return startingPrice * (1.0 - depreciation);
    }
}