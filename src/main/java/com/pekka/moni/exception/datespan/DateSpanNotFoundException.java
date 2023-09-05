package com.pekka.moni.exception.datespan;

import com.pekka.moni.exception.ApiRequestException;

public class DateSpanNotFoundException extends ApiRequestException {

    public DateSpanNotFoundException(String message) {
        super(message);
    }
}
