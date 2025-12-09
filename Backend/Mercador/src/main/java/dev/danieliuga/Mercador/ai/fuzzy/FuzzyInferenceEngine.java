package dev.danieliuga.Mercador.ai.fuzzy;

import core.FuzzyPetriLogic.FuzzyDriver;
import core.FuzzyPetriLogic.FuzzyToken;
import core.FuzzyPetriLogic.FuzzyValue;
import core.FuzzyPetriLogic.Tables.TwoXOneTable;
import core.FuzzyPetriLogic.Tables.TwoXTwoTable;

import dev.danieliuga.Mercador.dto.PriceEstimationDTO;
import java.util.HashMap;
import java.util.Map;

public class FuzzyInferenceEngine {

    private final FuzzyDriver driver = FuzzyDriver.createDriverFromMinMax(-1, 1);

    // Ponderile rămân aceleași (sunt bune pentru a diferenția mașinile)
    private static final Map<String, Double> FEATURE_WEIGHTS = new HashMap<>();

    static {
        // --- Siguranță & Standard ---
        FEATURE_WEIGHTS.put("ABS", 0.2);
        FEATURE_WEIGHTS.put("ESP", 0.2);
        FEATURE_WEIGHTS.put("Fog Lights", 0.3);
        FEATURE_WEIGHTS.put("Tire Pressure Monitoring", 0.3);
        FEATURE_WEIGHTS.put("Traffic Sign Recognition", 0.5);
        FEATURE_WEIGHTS.put("Cruise Control", 0.6);
        FEATURE_WEIGHTS.put("Tow Hook", 0.5);
        FEATURE_WEIGHTS.put("Tinted Windows", 0.5);
        FEATURE_WEIGHTS.put("Air Conditioning", 0.5);
        FEATURE_WEIGHTS.put("Bluetooth", 0.5);

        // --- Confort & Mediu ---
        FEATURE_WEIGHTS.put("Automatic Climate Control (2 Zones)", 1.0);
        FEATURE_WEIGHTS.put("Heated Front Seats", 1.0);
        FEATURE_WEIGHTS.put("Heated Rear Seats", 1.2);
        FEATURE_WEIGHTS.put("Multifunction Steering Wheel", 0.8);
        FEATURE_WEIGHTS.put("Heated Steering Wheel", 1.0);
        FEATURE_WEIGHTS.put("Navigation System", 1.0);
        FEATURE_WEIGHTS.put("Parking Sensors", 0.8);
        FEATURE_WEIGHTS.put("Alloy Wheels", 1.0);
        FEATURE_WEIGHTS.put("Keyless Entry", 1.2);
        FEATURE_WEIGHTS.put("Keyless Go", 1.2);
        FEATURE_WEIGHTS.put("Wireless Charging", 0.8);
        FEATURE_WEIGHTS.put("Rear View Camera", 1.2);
        FEATURE_WEIGHTS.put("Lane Assist", 1.2);
        FEATURE_WEIGHTS.put("Blind Spot Monitor", 1.2);

        // --- Premium & High Tech ---
        FEATURE_WEIGHTS.put("Automatic Climate Control (4 Zones)", 1.5);
        FEATURE_WEIGHTS.put("Leather Interior", 1.5);
        FEATURE_WEIGHTS.put("Alcantara Interior", 1.5);
        FEATURE_WEIGHTS.put("Electric Tailgate", 1.5);
        FEATURE_WEIGHTS.put("Apple CarPlay / Android Auto", 1.5);
        FEATURE_WEIGHTS.put("Digital Cockpit", 1.5);
        FEATURE_WEIGHTS.put("LED Headlights", 1.5);

        // --- Luxury & Exclusivist ---
        FEATURE_WEIGHTS.put("Matrix / Laser Headlights", 3.0);
        FEATURE_WEIGHTS.put("Sunroof", 2.0);
        FEATURE_WEIGHTS.put("Panoramic Roof", 3.0);
        FEATURE_WEIGHTS.put("Air Suspension", 3.5);
        FEATURE_WEIGHTS.put("Ventilated Seats", 2.5);
        FEATURE_WEIGHTS.put("Electric Seats with Memory", 2.0);
        FEATURE_WEIGHTS.put("Massage Seats", 3.0);
        FEATURE_WEIGHTS.put("Soft Close", 2.5);
        FEATURE_WEIGHTS.put("Webasto", 2.0);
        FEATURE_WEIGHTS.put("Head-up Display", 2.5);
        FEATURE_WEIGHTS.put("Premium Sound System", 2.0);
        FEATURE_WEIGHTS.put("Adaptive Cruise Control (Distronic)", 2.5);
        FEATURE_WEIGHTS.put("360° Camera", 2.5);
        FEATURE_WEIGHTS.put("Self-Parking System", 2.0);
    }

    private static final FuzzyValue[] FUZZY_VALUES = {
            FuzzyValue.NL, FuzzyValue.NM, FuzzyValue.ZR,
            FuzzyValue.PM, FuzzyValue.PL, FuzzyValue.FF
    };

    private FuzzyValue mapGeneToFuzzyValue(int geneIndex) {
        switch (geneIndex) {
            case 0: return FuzzyValue.NL;
            case 1: return FuzzyValue.NM;
            case 2: return FuzzyValue.ZR;
            case 3: return FuzzyValue.PM;
            case 4: return FuzzyValue.PL;
            case 5: return FuzzyValue.FF;
            default: return FuzzyValue.FF;
        }
    }

    public TwoXOneTable buildFLRS1(int[] rules, int startIndex) {
        Map<FuzzyValue, Map<FuzzyValue, FuzzyValue>> rulesMap = new HashMap<>();
        int geneIndex = startIndex;
        for (FuzzyValue x1Val : FUZZY_VALUES) {
            Map<FuzzyValue, FuzzyValue> x1Rules = new HashMap<>();
            for (FuzzyValue x2Val : FUZZY_VALUES) {
                if (geneIndex >= rules.length) break;
                FuzzyValue zVal = mapGeneToFuzzyValue(rules[geneIndex]);
                x1Rules.put(x2Val, zVal);
                geneIndex++;
            }
            rulesMap.put(x1Val, x1Rules);
        }
        return new TwoXOneTable(rulesMap);
    }

    public TwoXTwoTable buildFLRS2(int[] rules, int startIndex) { return null; }

    // Normalizări
    private double normalizeYear(int year) { return 2.0 * ((double) year - 2000) / 25 - 1.0; }
    private double normalizeMileage(double mileage) { return 1.0 - 2.0 * mileage / 300000; }

    // 1. Cutie: Am scăzut bonusul la 6%
    private double getTransmissionBonus(String transmission) {
        if (transmission == null) return 0.0;
        if (transmission.equalsIgnoreCase("AUTOMATIC")) return 0.05;
        return 0.0;
    }

    // 2. Combustibil: Am ajustat ușor
    private double getFuelBonus(String fuel) {
        if (fuel == null) return 0.0;
        return switch (fuel.toUpperCase()) {
            case "ELECTRIC" -> 0.12;
            case "HYBRID" -> 0.08;
            case "DIESEL" -> 0.02;
            case "PETROL" -> 0.0;
            case "GPL" -> -0.05;
            default -> 0.0;
        };
    }

    // 3. Poluare: Am redus impactul pentru că anul deja crește prețul
    private double getPollutionBonus(String pollution) {
        if (pollution == null) return 0.0;
        return switch (pollution) {
            case "Euro 6" -> 0.05;
            case "Euro 5" -> 0.0;
            case "Euro 4" -> -0.10;
            case "Euro 3" -> -0.20;
            case "Euro 2" -> -0.25;
            case "Euro 1", "Non-Euro" -> -0.30;
            default -> 0.0;
        };
    }

    // 4. Motor:
    private double getEngineBonus(int cm3) {
        if (cm3 <= 0) return 0.0;
        if (cm3 > 3500) return 0.15;
        if (cm3 >= 2500) return 0.08;
        if (cm3 >= 1800) return 0.03;
        if (cm3 < 1200) return -0.03;
        return 0.0;
    }

    public double predictPriceFactor(PriceEstimationDTO dto, int[] rules) {
        // ... (partea de Fuzzy buildFLRS1 și fuzzifie rămâne la fel) ...
        TwoXOneTable FLRS1 = buildFLRS1(rules, 0);
        FuzzyToken yearToken = driver.fuzzifie(normalizeYear(dto.getYear()));
        FuzzyToken mileageToken = driver.fuzzifie(normalizeMileage(dto.getMileage()));

        FuzzyToken[] zTokens = FLRS1.execute(new FuzzyToken[]{yearToken, mileageToken});
        FuzzyToken zToken = zTokens[0];
        Double baseFactor = driver.defuzzify(zToken);
        if (baseFactor == null) baseFactor = 0.0;

        // --- FIX CRITIC: Punctul de start ---
        // 0.85 înseamnă că din start considerăm că prețul mediu e un pic sub cel de catalog
        // Influența fuzzy redusă la 0.25
        double coreFactor = 0.85 + (baseFactor * 0.25);

        // Dotări
        double totalFeatureScore = 0.0;
        if (dto.getFeatures() != null) {
            for (String feature : dto.getFeatures()) {
                totalFeatureScore += FEATURE_WEIGHTS.getOrDefault(feature, 0.5);
            }
        }
        // --- FIX DOTĂRI: Maxim 20% bonus pentru Full Option ---
        double maxPossibleScore = 60.0;
        double featuresBonus = (Math.min(totalFeatureScore, maxPossibleScore) / maxPossibleScore) * 0.20;

        // Modificatori tehnici
        double technicalModifiers = getTransmissionBonus(dto.getTransmission()) +
                getFuelBonus(dto.getFuelType()) +
                getPollutionBonus(dto.getPollutionStandard()) +
                getEngineBonus(dto.getCm3());

        double finalFactor = coreFactor * (1.0 + featuresBonus + technicalModifiers);

        // Asigurăm că nu scade sub 500 EUR (epave)
        return Math.max(finalFactor, 0.05);
    }
}