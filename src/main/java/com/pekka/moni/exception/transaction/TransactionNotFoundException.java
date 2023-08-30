package com.pekka.moni.exception.transaction;

import com.pekka.moni.exception.ApiRequestException;

public class TransactionNotFoundException extends ApiRequestException {

    public TransactionNotFoundException(String message) {
        super(message);
    }
}
