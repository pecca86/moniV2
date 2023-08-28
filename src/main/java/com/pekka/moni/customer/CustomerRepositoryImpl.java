package com.pekka.moni.customer;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomerRepositoryImpl implements CustomerRepository {
    @Override
    public Customer getCustomer(Long id) {
        return new Customer(id,  "p@p.com", "repo-pekka", "reve-aho", "kei");
    }

    @Override
    public List<Customer> getCustomers() {
        return null;
    }
}
