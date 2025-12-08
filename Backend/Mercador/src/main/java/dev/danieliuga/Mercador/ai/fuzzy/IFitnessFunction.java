package dev.danieliuga.Mercador.ai.fuzzy;

public interface IFitnessFunction {

    /**
     * Evaluează calitatea unei soluții (set de reguli).
     * @param rules Array-ul de numere întregi care codifică regulile Fuzzy (cromozomul).
     * @return Valoarea erorii (costul). Obiectivul este MINIMIZAREA acestei valori.
     */
    double evaluate(int[] rules);
}
