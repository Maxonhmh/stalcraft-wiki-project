package com.example.demo.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminInitializer(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        appUserRepository.findByUsername(adminUsername)
                .orElseGet(() -> {
                    AppUser admin = AppUser.builder()
                            .username(adminUsername)
                            .password(passwordEncoder.encode(adminPassword))
                            .role("ADMIN")
                            .build();

                    return appUserRepository.save(admin);
                });
    }
}