package com.pekka.moni.customer;

import java.util.List;

public interface CustomerRepository {

    Customer getCustomer(Long id);
    List<Customer> getCustomers();
}
