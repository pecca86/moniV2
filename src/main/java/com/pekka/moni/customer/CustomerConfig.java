package com.pekka.moni.customer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomerConfig {

    @Value("${app.environment}")
    private String environment;

    @Bean
    CommandLineRunner commandLineRunner(CustomerService customerService) {
        return args -> {
            System.out.println("You are running the app in " + environment + " environment");
        };
    }
}
