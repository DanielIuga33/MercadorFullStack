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

    // Definim valorile pentru fiecare dotare (Ponderi)
    // 0.5 = Standard/Ieftin, 1.0 = Mediu, 2.0 = Scump, 3.0 = Premium/Rar
    private static final Map<String, Double> FEATURE_WEIGHTS = new HashMap<>();

    static {
        // --- Siguranță & Standard (0.2 - 0.5 puncte) ---
        FEATURE_WEIGHTS.put("ABS", 0.2);
        FEATURE_WEIGHTS.put("ESP", 0.2);
        FEATURE_WEIGHTS.put("Fog Lights", 0.3);
        FEATURE_WEIGHTS.put("Tire Pressure Monitoring", 0.3);
        FEATURE_WEIGHTS.put("Traffic Sign Recognition", 0.5);
        FEATURE_WEIGHTS.put("Cruise Control", 0.6); // <--- AM ADĂUGAT ASTA (lipsea)
        FEATURE_WEIGHTS.put("Tow Hook", 0.5);
        FEATURE_WEIGHTS.put("Tinted Windows", 0.5);
        FEATURE_WEIGHTS.put("Air Conditioning", 0.5);
        FEATURE_WEIGHTS.put("Bluetooth", 0.5);

        // --- Confort & Mediu (0.8 - 1.2 puncte) ---
        FEATURE_WEIGHTS.put("Automatic Climate Control (2 Zones)", 1.0);
        FEATURE_WEIGHTS.put("Heated Front Seats", 1.0);
        FEATURE_WEIGHTS.put("Heated Rear Seats", 1.2); // E mai rară decât față
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

        // --- Premium & High Tech (1.5 puncte) ---
        FEATURE_WEIGHTS.put("Automatic Climate Control (4 Zones)", 1.5);
        FEATURE_WEIGHTS.put("Leather Interior", 1.5);
        FEATURE_WEIGHTS.put("Alcantara Interior", 1.5);
        FEATURE_WEIGHTS.put("Electric Tailgate", 1.5);
        FEATURE_WEIGHTS.put("Apple CarPlay / Android Auto", 1.5);
        FEATURE_WEIGHTS.put("Digital Cockpit", 1.5);
        FEATURE_WEIGHTS.put("LED Headlights", 1.5);

        // --- Luxury & Exclusivist (2.0 - 3.5 puncte) ---
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

    public TwoXTwoTable buildFLRS2(int[] rules, int startIndex) {
        return null;
    }

    // Normalizări
    private double normalizeYear(int year) { return 2.0 * ((double) year - 2000) / 25 - 1.0; }
    private double normalizeMileage(double mileage) { return 1.0 - 2.0 * mileage / 300000; }

    /**
     * Metoda principală: Calculează Factorul de Preț prezis.
     */
    public double predictPriceFactor(PriceEstimationDTO dto, int[] rules) {

        // 1. Reconstruiește tabelul fuzzy
        TwoXOneTable FLRS1 = buildFLRS1(rules, 0);

        // 2. Fuzzifică Intrările
        FuzzyToken yearToken = driver.fuzzifie(normalizeYear(dto.getYear()));
        FuzzyToken mileageToken = driver.fuzzifie(normalizeMileage(dto.getMileage()));

        // --- CALCUL NOU PENTRU DOTĂRI (Weighted Score) ---
        double totalFeatureScore = 0.0;

        if (dto.getFeatures() != null) {
            for (String feature : dto.getFeatures()) {
                // Adunăm valoarea fiecărei dotări găsite
                // Dacă o dotare nu e în listă, primește valoarea default 0.5
                totalFeatureScore += FEATURE_WEIGHTS.getOrDefault(feature, 0.5);
            }
        }

        // Definim un scor maxim teoretic (ex: o mașină "Full de Full" ar aduna cam 50-60 puncte)
        double maxPossibleScore = 60.0;

        // Normalizăm scorul între 0.0 și 1.0 (sau chiar mai mult dacă e ultra-full)
        // Math.min asigură că nu depășim 1.0 prea mult, dar lăsăm loc de excepții
        double normalizedFeatureBonus = Math.min(totalFeatureScore, maxPossibleScore) / maxPossibleScore;
        // -------------------------------------------------

        // 3. Execuția Rețelei Fuzzy (An vs Rulaj)
        FuzzyToken[] zTokens = FLRS1.execute(new FuzzyToken[]{yearToken, mileageToken});
        FuzzyToken zToken = zTokens[0];

        // 4. Defuzzificarea
        Double baseFactor = driver.defuzzify(zToken);
        if (baseFactor == null) baseFactor = 0.0;

        // 5. Calcul Final
        // Formula: Preț Bază (An/Km) + Bonus Dotări
        // Aici am pus că dotările pot crește prețul cu până la 35% (0.35) față de baza mașinii
        double finalFactor = (1.0 + baseFactor * 0.5) + (normalizedFeatureBonus * 0.35);

        return finalFactor;
    }
}