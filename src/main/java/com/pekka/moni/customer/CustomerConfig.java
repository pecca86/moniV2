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
                new Customer("pe1@p.com", "Pekka", "Pekka I", "Pekka"),
                new Customer("pe2@p.com", "Lekka", "Pekka II", "Pekka"),
                new Customer("pe3@p.com", "Snekka", "Pekka III", "Pekka"),
                new Customer("pep4@p.com", "Knekka", "Pekka V", "Pekka"),
                new Customer("pep5@p.com", "Fnekka", "Pekka VII", "Pekka"),
                new Customer("pep6@p.com", "Qnekka", "Pekka VIII", "Pekka"),
                new Customer("pep7@p.com", "Hnekka", "Pekka IX", "Pekka"),
                new Customer("pep8@p.com", "Onekka", "Pekka IV", "Pekka")
        ));
    }
}
