package com.pekka.moni.customer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CustomerConfig {

    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository repository) {
        return args -> repository.saveAll(List.of(
                new Customer("pe1@p.com", "Pekka", "Pekka I", "Pekka", Role.USER),
                new Customer("pe2@p.com", "Lekka", "Pekka II", "Pekka", Role.USER)
        ));

    }
}
