package dev.danieliuga.Mercador.ai.fuzzy;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.repository.CarRepository;
import jakarta.annotation.PostConstruct;
import org.jgap.*;
import org.jgap.impl.DefaultConfiguration;
import org.jgap.impl.IntegerGene;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuzzyRuleOptimizer {

    @Autowired
    private CarRepository carRepository;

    private final FuzzyInferenceEngine fuzzyEngine = new FuzzyInferenceEngine();

    // --- FIX 1: Calcul Corect al Genelor ---
    // Avem 6 valori fuzzy (NL...FF). Tabelul combină 2 intrări.
    // 6 * 6 = 36 reguli necesare.
    private static final int NUM_GENES = 36;
    private static final int POPULATION_SIZE = 50; // 50 e suficient pentru viteză
    private static final int NUM_GENERATIONS = 30; // 30 e ok pentru start
    private static final int MAX_FUZZY_VALUE = 5;

    // --- FIX 3: Inițializare Default (Anti-NullPointer) ---
    // Umplem cu 0 (sau 2-ZR) ca să nu fie null până termină optimizarea
    private int[] bestFuzzyRules = new int[NUM_GENES];

    @PostConstruct
    public void optimizeRulesAtStartup() {
        new Thread(() -> { // Rulăm pe un thread separat ca să nu blocăm pornirea serverului
//            System.out.println("🚀 Starting AI Optimization...");
            try {
                // --- FIX 2: Limitarea datelor de antrenament ---
                // Luăm doar ultimele 500 de mașini pentru a nu bloca memoria RAM
                List<Car> trainingData = carRepository.findAll(PageRequest.of(0, 500)).getContent();

                if (trainingData.isEmpty()) {
                    System.out.println("⚠️ No cars found for training. Using default rules.");
                    return;
                }

                // Configurare JGAP
                Configuration conf = new DefaultConfiguration();
                // Resetăm configuratia pentru a evita erori la reload
                Configuration.reset();
                conf = new DefaultConfiguration();

                FitnessFunction myFunc = new PriceEstimationFitnessFunction(trainingData, fuzzyEngine);
                conf.setFitnessFunction(myFunc);
                conf.setPopulationSize(POPULATION_SIZE);
                conf.setPreservFittestIndividual(true);

                Gene[] sampleGenes = new Gene[NUM_GENES];
                for (int i = 0; i < NUM_GENES; i++) {
                    sampleGenes[i] = new IntegerGene(conf, 0, MAX_FUZZY_VALUE);
                }
                IChromosome sampleChromosome = new Chromosome(conf, sampleGenes);
                conf.setSampleChromosome(sampleChromosome);

                Genotype population = Genotype.randomInitialGenotype(conf);

                // Evoluție
                for (int i = 0; i < NUM_GENERATIONS; i++) {
                    population.evolve();
                    // Optional: Log progres
                    // System.out.println("Generation " + i + " finished.");
                }

                IChromosome bestChromosome = population.getFittestChromosome();
                this.bestFuzzyRules = convertChromosomeToRules(bestChromosome);

//                System.out.println(" AI Optimization Finished. Rules updated.");
//                System.out.println("Best Rules: " + Arrays.toString(bestFuzzyRules));

            } catch (Exception e) {
                System.err.println(" GA Optimization Failed. Keeping default rules.");
                e.printStackTrace();
            }
        }).start();
    }

    private int[] convertChromosomeToRules(IChromosome chr) {
        int numGenes = chr.size();
        int[] rules = new int[numGenes];
        for (int i = 0; i < numGenes; i++) {
            rules[i] = (Integer) chr.getGene(i).getAllele();
        }
        return rules;
    }

    public int[] getBestRules() {
        return bestFuzzyRules;
    }
}