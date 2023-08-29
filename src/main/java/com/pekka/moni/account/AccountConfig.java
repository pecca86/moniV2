package com.pekka.moni.account;

import com.pekka.moni.customer.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AccountConfig {

    @Bean
    CommandLineRunner accountCommandLineRunner(AccountRepository accountRepository, CustomerRepository customerRepository) {
        return args -> System.out.println("Account config");
    }
}
