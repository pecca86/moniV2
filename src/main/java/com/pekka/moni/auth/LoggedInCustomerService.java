package com.pekka.moni.auth;

import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class LoggedInCustomerService {
    private final CustomerRepository customerRepository;

    @Autowired
    public LoggedInCustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getLoggerInCustomer(Authentication authentication) {
         return customerRepository.findCustomerByEmail(authentication.getName()).orElseThrow(
                 () -> new CustomerNotFoundException("Customer with not found")
         );
     }
}
