package com.pekka.moni.customer;

import com.pekka.moni.exception.customer.CustomerAlreadyExistsException;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
// TODO, Make work with logger in user as customer
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

    public Page<Customer> getCustomers(String sortBy, String sortDirection, int page, int pageSize) {
        //TODO: Mapper to map Page<Customer> to Page<CustomerDto>
        PageRequest pageRequest = PageRequest.of(page, pageSize);
        return switch (Sort.Direction.fromString(sortDirection)) {
            case ASC -> customerRepository.findAll(pageRequest.withSort(Sort.by(sortBy).ascending()));
            case DESC -> customerRepository.findAll(pageRequest.withSort(Sort.by(sortBy).descending()));
        };
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
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
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
