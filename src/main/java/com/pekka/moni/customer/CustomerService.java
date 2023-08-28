package com.pekka.moni.customer;

import com.pekka.moni.exception.customer.CustomerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                                 .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));

    }

    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }
}
