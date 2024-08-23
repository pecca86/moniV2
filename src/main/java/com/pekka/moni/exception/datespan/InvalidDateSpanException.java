package com.pekka.moni.exception.datespan;

import com.pekka.moni.exception.ApiRequestException;

public class InvalidDateSpanException extends ApiRequestException {

    public InvalidDateSpanException(String message) {
        super(message);
    }
}
