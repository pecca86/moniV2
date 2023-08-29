package com.pekka.moni.customer;

import com.pekka.moni.exception.customer.CustomerAlreadyExistsException;
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

    public void addNewCustomer(Customer customer) {
        customerRepository.findCustomerByEmail(customer.getEmail())
                          .ifPresentOrElse(
                                  c -> {
                                      throw new CustomerAlreadyExistsException("Email taken");
                                  },
                                  () -> customerRepository.save(customer)
                          );
    }

    public void deleteCustomer(Long id) {
        customerRepository.findById(id)
                          .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));
        customerRepository.deleteById(id);
    }

    public void updateCustomer(Customer customer, Long id) {
        Customer customerToUpdate = customerRepository.findById(id)
                                       .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));

        customerToUpdate.setEmail(customer.getEmail());
        customerToUpdate.setFirstName(customer.getFirstName());
        customerToUpdate.setLastName(customer.getLastName());
        customerRepository.save(customerToUpdate);
    }
}
