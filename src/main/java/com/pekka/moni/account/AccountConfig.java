package com.pekka.moni.account;

import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AccountConfig {

    @Bean
    CommandLineRunner accountCommandLineRunner(AccountRepository accountRepository, CustomerRepository customerRepository) {
        return args -> {
            Customer c = new Customer("pexi@p.com", "Pekka", "Pekka I", "Pekka");
            Account a = new Account(c, "FI1234567890123456", "Pekka's account", 1000.0, "Savings", 100.0);
            Account a2 = new Account(c, "FI1234567822123456", "Pekka's account 2", 10100.0, "Savings", 100.0);
            Account a3 = new Account(c, "FI12345672230123456", "Pekka's account 3", 10200.0, "Savings", 100.0);
            c.addAccount(a);
            c.addAccount(a2);
            c.addAccount(a3);
            customerRepository.save(c);

            customerRepository.deleteById(c.getId());
        };
    }
}
