package com.pekka.moni.exception.account;

import com.pekka.moni.exception.ApiRequestException;

public class InvalidAccountDataException extends ApiRequestException {

    public InvalidAccountDataException(String message) {
        super(message);
    }
}
