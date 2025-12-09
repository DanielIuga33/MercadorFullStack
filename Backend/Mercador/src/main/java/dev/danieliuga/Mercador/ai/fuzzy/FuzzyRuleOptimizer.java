package dev.danieliuga.Mercador.ai.fuzzy;

import dev.danieliuga.Mercador.model.Car;
import dev.danieliuga.Mercador.repository.CarRepository;
import org.jgap.*;
import org.jgap.impl.DefaultConfiguration;
import org.jgap.impl.IntegerGene;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;

@Service
public class FuzzyRuleOptimizer {

    @Autowired
    private CarRepository carRepository;

    // Motorul Fuzzy de inferență, gata de utilizare
    private final FuzzyInferenceEngine fuzzyEngine = new FuzzyInferenceEngine();

    private int[] bestFuzzyRules = null;

    // Parametrii GA
    private static final int NUM_GENES = 108; // Ajustează dacă modelul tău e diferit!
    private static final int POPULATION_SIZE = 100;
    private static final int NUM_GENERATIONS = 50;
    private static final int MAX_FUZZY_VALUE = 5; // 0 (NL) la 5 (FF)

    @PostConstruct
    public void optimizeRulesAtStartup() {
        try {
            List<Car> trainingData = carRepository.findAll();
            if (trainingData.isEmpty()) {
                return;
            }

            // Configurare JGAP
            Configuration conf = new DefaultConfiguration();
            FitnessFunction myFunc = new PriceEstimationFitnessFunction(trainingData, fuzzyEngine);
            conf.setFitnessFunction(myFunc);
            conf.setPopulationSize(POPULATION_SIZE);

            // Definirea Cromozomului
            Gene[] sampleGenes = new Gene[NUM_GENES];
            for (int i = 0; i < NUM_GENES; i++) {
                sampleGenes[i] = new IntegerGene(conf, 0, MAX_FUZZY_VALUE);
            }
            IChromosome sampleChromosome = new Chromosome(conf, sampleGenes);
            conf.setSampleChromosome(sampleChromosome);

            // Rularea Evoluției
            Genotype population = Genotype.randomInitialGenotype(conf);
            for (int i = 0; i < NUM_GENERATIONS; i++) {
                population.evolve();
            }

            // Salvarea celui mai bun rezultat
            IChromosome bestChromosome = population.getFittestChromosome();
            this.bestFuzzyRules = convertChromosomeToRules(bestChromosome);
        } catch (Exception e) {
            System.err.println("GA Optimization Failed.");
            e.printStackTrace();
        }
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
        // Returnează regulile optime, sau un set default/fallback dacă optimizarea a eșuat
        return bestFuzzyRules;
    }
}