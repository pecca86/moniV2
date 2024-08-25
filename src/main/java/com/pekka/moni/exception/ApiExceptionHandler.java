package com.pekka.moni.exception;

import com.pekka.moni.exception.account.AccountAccessException;
import com.pekka.moni.exception.account.AccountNotFoundException;
import com.pekka.moni.exception.account.InvalidAccountDataException;
import com.pekka.moni.exception.customer.CustomerAlreadyExistsException;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import com.pekka.moni.exception.datespan.DateSpanNotFoundException;
import com.pekka.moni.exception.datespan.InvalidDateSpanException;
import com.pekka.moni.exception.transaction.TransactionNotFoundException;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.ZonedDateTime;

@ControllerAdvice // This annotation makes this class a global exception handler
public class ApiExceptionHandler {
    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(value = {InvalidAccountDataException.class})
    public ResponseEntity<Object> handleInvalidAccountDataException(InvalidAccountDataException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {HttpMessageNotReadableException.class})
    public ResponseEntity<Object> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        // capture all text that is inside the first pair of brackets
        int a  = exception.message().indexOf("[");
        int b = exception.message().indexOf("]");
        String parsedMessage = "Allowed account types are: " + exception.message().substring(a + 1, b);
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(parsedMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {UsernameNotFoundException.class})
    public ResponseEntity<Object> handleUsernameNotFoundException(UsernameNotFoundException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Object> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
    }

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

    @ExceptionHandler(value = {InvalidDateSpanException.class})
    public ResponseEntity<Object> handleInvalidDateSpanException(InvalidDateSpanException e) {
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

    @ExceptionHandler(value = {TransactionNotFoundException.class})
    public ResponseEntity<Object> handleTransactionNotFoundException(TransactionNotFoundException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {AccountAccessException.class})
    public ResponseEntity<Object> handleAccountAccessException(AccountAccessException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.FORBIDDEN,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {DateSpanNotFoundException.class})
    public ResponseEntity<Object> handleDateSpanNotFoundException(DateSpanNotFoundException e) {
        ApiException exception = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error("ApiRequestException: ", e);
        return new ResponseEntity<>(exception, HttpStatus.NOT_FOUND);
    }

}
