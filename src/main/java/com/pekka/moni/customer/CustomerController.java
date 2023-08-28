package com.pekka.moni.customer;

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
        return List.of(new Customer(1L, "pekka", "Kuk-bytta", "kei"));
    }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) {
        return customerService.getCustomer(id);
    }

    @PostMapping
    public void registerNewCustomer(@RequestBody Customer customer) {
        System.out.println(customer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        System.out.println(id);
    }

    @PutMapping("/{id}")
    public void updateCustomer(@PathVariable Long id, Customer customer) {
        System.out.println(String.format("%s %s", id, customer));
    }

}
