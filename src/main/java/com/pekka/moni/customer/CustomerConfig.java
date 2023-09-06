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
                new Customer("p@p.com", "Pekka", "Pekka I", "$2a$10$t8xyrKSgxp6gSHpxIyXXo.N37Jrzx.F8C65.d8fGECwh3NT1kHx4G", Role.ROLE_ADMIN),
                new Customer("pe2@p.com", "Lekka", "Pekka II", "Pekka", Role.ROLE_USER)
        ));

    }
}
