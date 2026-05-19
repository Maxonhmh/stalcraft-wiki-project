package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class CorsConfig {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://localhost:3000",
                                "https://stalcraft-wiki-project.ru",
                                "https://www.stalcraft-wiki-project.ru"
                        )
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);

                registry.addMapping("/uploads/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://localhost:3000",
                                "https://stalcraft-wiki-project.ru",
                                "https://www.stalcraft-wiki-project.ru"
                        )
                        .allowedMethods("GET", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                Path uploadPath = Paths.get(uploadDir).toAbsolutePath();

                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:" + uploadPath + "/");
            }
        };
    }
}