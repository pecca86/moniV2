package com.pekka.moni.exception.account;

import com.pekka.moni.exception.ApiRequestException;

public class AccountNotFoundException extends ApiRequestException {
    public AccountNotFoundException(String message) {
        super(message);
    }

}
