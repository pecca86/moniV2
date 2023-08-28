package com.pekka.moni.exception.customer;

import com.pekka.moni.exception.ApiRequestException;

public class CustomerNotFoundException extends ApiRequestException {
    public CustomerNotFoundException(String message) {
        super(message);
    }
}
