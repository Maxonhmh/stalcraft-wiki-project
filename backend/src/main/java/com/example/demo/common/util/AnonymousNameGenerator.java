package com.example.demo.common.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class AnonymousNameGenerator {

    private AnonymousNameGenerator() {
    }

    public static String generate(String anonKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(anonKey.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();

            for (int i = 0; i < 3; i++) {
                hex.append(String.format("%02X", hash[i]));
            }

            return "Anon-" + hex;
        } catch (NoSuchAlgorithmException exception) {
            throw new RuntimeException("Could not generate anonymous name");
        }
    }
}