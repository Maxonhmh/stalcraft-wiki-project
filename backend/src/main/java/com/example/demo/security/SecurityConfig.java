package com.example.demo.security;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // Static uploads
                        .requestMatchers("/uploads/**").permitAll()

                        // WebSocket endpoint
                        .requestMatchers("/ws/**").permitAll()

                        // Public API
                        .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/quests/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/items/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/forum/**").permitAll()

                        // Forum messages are anonymous
                        .requestMatchers(HttpMethod.POST, "/api/forum/messages").permitAll()

                        // Admin API
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Protected mutations
                        .requestMatchers(HttpMethod.POST, "/api/articles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/articles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/articles/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/quests/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/quests/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/quests/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/forum/topics/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/forum/topics/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/forum/messages/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/admin/items/import").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/forum/topics/**").hasRole("ADMIN")
                        
                        .requestMatchers(HttpMethod.POST, "/api/uploads/images").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}