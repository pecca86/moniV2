package com.pekka.moni.exception.customer;

import com.pekka.moni.exception.ApiRequestException;

public class CustomerAlreadyExistsException extends ApiRequestException {
    public CustomerAlreadyExistsException(String message) {
        super(message);
    }
}
