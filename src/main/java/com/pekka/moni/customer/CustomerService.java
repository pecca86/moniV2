package com.pekka.moni.customer;

import com.pekka.moni.exception.customer.CustomerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getCustomer(Long id) {
        return findCustomer(id);

    }

    public Page<Customer> getCustomers(String sortBy, String sortDirection, int page, int pageSize) {
        PageRequest pageRequest = PageRequest.of(page, pageSize);
        return switch (Sort.Direction.fromString(sortDirection)) {
            case ASC -> customerRepository.findAll(pageRequest.withSort(Sort.by(sortBy).ascending()));
            case DESC -> customerRepository.findAll(pageRequest.withSort(Sort.by(sortBy).descending()));
        };
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
        customerRepository.deleteById(id);
    }

    public void updateCustomer(Customer customer, Long id) {
        Customer customerToUpdate = findCustomer(id);

        customerToUpdate.setEmail(customer.getEmail());
        customerToUpdate.setFirstName(customer.getFirstName());
        customerToUpdate.setLastName(customer.getLastName());
        customerRepository.save(customerToUpdate);
    }

    private Customer findCustomer(Long id) {
        return customerRepository.findById(id)
                                 .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));
    }
}
