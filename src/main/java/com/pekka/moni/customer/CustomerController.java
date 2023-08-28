package com.pekka.moni.customer;

import com.pekka.moni.exception.customer.CustomerNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getCustomers() {
        return List.of(new Customer(1L, "p@p.com", "pekka", "Kuk-bytta", "kei"));
    }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) {
        if (id.equals(20L)) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
        return customerService.getCustomer(id);
    }

    @PostMapping
    public void registerNewCustomer(@RequestBody @Valid Customer customer) {
        System.out.println(customer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        System.out.println(id);
    }

    @PutMapping("/{id}")
    public void updateCustomer(@RequestBody Customer customer, @PathVariable Long id) {
        System.out.println("Updating customer with id: " + id);
        System.out.println(customer);
    }

}
