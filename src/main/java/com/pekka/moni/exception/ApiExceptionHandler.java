package com.pekka.moni.exception;

import com.pekka.moni.exception.account.AccountNotFoundException;
import com.pekka.moni.exception.customer.CustomerAlreadyExistsException;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;

@ControllerAdvice // This annotation makes this class a global exception handler
public class ApiExceptionHandler {
    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(value = {ApiRequestException.class})
    public ResponseEntity<Object> handleApiRequestException(ApiRequestException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {CustomerNotFoundException.class})
    public ResponseEntity<Object> handleCustomerNotFoundException(CustomerNotFoundException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {CustomerAlreadyExistsException.class})
    public ResponseEntity<Object> handleCustomerAlreadyExistsException(CustomerAlreadyExistsException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.CONFLICT,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = {AccountNotFoundException.class})
    public ResponseEntity<Object> handleAccountNotFoundException(AccountNotFoundException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.NOT_FOUND);
    }
}