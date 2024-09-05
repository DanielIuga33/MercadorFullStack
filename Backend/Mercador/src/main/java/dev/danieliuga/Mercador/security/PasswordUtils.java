package dev.danieliuga.Mercador.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtils {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Generează un hash pentru o parolă
    public static String hashPassword(String password) {
        return encoder.encode(password);
    }

    // Verifică dacă o parolă raw corespunde cu un hash
    public static boolean checkPassword(String rawPassword, String hashedPassword) {
        return encoder.matches(rawPassword, hashedPassword);
    }
}
