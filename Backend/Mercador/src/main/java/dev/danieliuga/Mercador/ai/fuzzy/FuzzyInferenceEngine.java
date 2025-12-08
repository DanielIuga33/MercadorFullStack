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
    private static final FuzzyValue[] FUZZY_VALUES = {
            FuzzyValue.NL, FuzzyValue.NM, FuzzyValue.ZR,
            FuzzyValue.PM, FuzzyValue.PL, FuzzyValue.FF
    };

    // Helper pentru maparea genelor
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

    // A. Metoda de Reconstrucție a Tabelelor (Exemplu pentru T0)
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

    // B. Metoda de Reconstrucție a Tabelelor (Exemplu pentru T1 - TwoXTwoTable necesită logică de mapare a ieșirilor Y1, Y2)
    // ⚠️ ATENȚIE: Trebuie să implementezi buildFLRS2(rules, 36) separat, urmând modelul anterior cu 72 de gene.
    public TwoXTwoTable buildFLRS2(int[] rules, int startIndex) {
        // Implementează logica pentru a construi TwoXTwoTable
        // (Lăsat ca placeholder pentru simplificare)
        return null;
    }

    // C. Metode de Normalizare
    private double normalizeYear(int year) { return 2.0 * ((double) year - 2000) / 25 - 1.0; }
    private double normalizeMileage(int mileage) { return 1.0 - 2.0 * (double) mileage / 300000; }
    private double normalizeFeatures(int count) { return 2.0 * (double) count / 40 - 1.0; }

    /**
     * Metoda principală: Calculează Factorul de Preț prezis.
     */
    public double predictPriceFactor(PriceEstimationDTO dto, int[] rules) {

        // 1. Reconstruiește tabelele din genele primite (reguli)
        TwoXOneTable FLRS1 = buildFLRS1(rules, 0);
        // TwoXTwoTable FLRS2 = buildFLRS2(rules, 36);

        // 2. Fuzzifică Intrările (An, Rulaj, Număr de Dotări)
        FuzzyToken yearToken = driver.fuzzifie(normalizeYear(dto.getYear()));
        FuzzyToken mileageToken = driver.fuzzifie(normalizeMileage(dto.getMileage()));
        FuzzyToken featuresToken = driver.fuzzifie(normalizeFeatures(dto.getFeatures().size()));

        // 3. Execuția Rețelei Fuzzy (Inferența)

        // Ex: Z = T0(An, Rulaj)
        FuzzyToken[] zTokens = FLRS1.execute(new FuzzyToken[]{yearToken, mileageToken});
        FuzzyToken zToken = zTokens[0];

        // ⚠️ ATENȚIE: Presupunem că P_Factor este rezultat din T1(Z, Dotări)
        // FuzzyToken[] outputTokens = FLRS2.execute(new FuzzyToken[]{zToken, featuresToken});

        // 4. Defuzzificarea (Factorul de Preț)
        // Placeholder: Defuzzificăm doar rezultatul Z pentru a demonstra fluxul
        Double finalFactor = driver.defuzzify(zToken);

        // Returnează rezultatul defuzzificat (ajustat)
        return (finalFactor != null) ? (1.0 + finalFactor * 0.5) : 1.0;
    }
}