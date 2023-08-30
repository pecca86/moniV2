package com.pekka.moni.exception.account;

import com.pekka.moni.exception.ApiRequestException;

public class AccountAccessException extends ApiRequestException {
    public AccountAccessException(String message) {
        super(message);
    }
}
