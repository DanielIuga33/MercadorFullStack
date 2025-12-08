package dev.danieliuga.Mercador.service;

import dev.danieliuga.Mercador.ai.fuzzy.FuzzyInferenceEngine;
import dev.danieliuga.Mercador.ai.fuzzy.FuzzyRuleOptimizer;
import dev.danieliuga.Mercador.dto.PriceEstimationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PriceEstimationService {

    @Autowired
    private FuzzyRuleOptimizer fuzzyRuleOptimizer;

    // Motorul Fuzzy (același obiect folosit și în optimizare)
    private final FuzzyInferenceEngine fuzzyEngine = new FuzzyInferenceEngine();

    public double estimatePrice(PriceEstimationDTO dto) {

        int[] optimizedRules = fuzzyRuleOptimizer.getBestRules();

        if (optimizedRules == null) {
            // Logica fallback dacă GA a eșuat
            System.err.println("Fuzzy Rules not loaded. Using fallback logic.");
            return dto.getBasePrice() * 1.05;
        }

        // 1. Obține factorul de ajustare folosind motorul Fuzzy cu regulile optime
        double priceFactor = fuzzyEngine.predictPriceFactor(dto, optimizedRules);

        // 2. Aplică Factorul la Prețul de Bază
        double finalPrice = dto.getBasePrice() * priceFactor;

        return Math.round(finalPrice);
    }
}