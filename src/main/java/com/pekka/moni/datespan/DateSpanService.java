package com.pekka.moni.datespan;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.account.AccountAccessException;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import com.pekka.moni.exception.datespan.DateSpanNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DateSpanService {

    private final DateSpanRepository dateSpanRepository;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;

    public DateSpanService(DateSpanRepository dateSpanRepository,
                           CustomerRepository customerRepository,
                           AccountRepository accountRepository) {
        this.dateSpanRepository = dateSpanRepository;
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    public void createDateSpan(DateSpan dateSpan, Long accountId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new CustomerNotFoundException("Customer with id 1 not found"));

        isLoggedInUsersAccount(accountId, loggedInCustomer);
        Account account = accountRepository.findById(accountId)
                                           .orElseThrow(() -> new AccountAccessException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));
        account.addDateSpan(dateSpan);
        accountRepository.save(account);
    }

    public DateSpan getDateSpan(Long accountId, Long dateSpanId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new CustomerNotFoundException("Customer with id 1 not found"));

        isLoggedInUsersAccount(accountId, loggedInCustomer);
        return dateSpanRepository.findById(dateSpanId)
                                 .orElseThrow(() -> new DateSpanNotFoundException("Date span with id " + dateSpanId + " not found"));
    }

    public List<DateSpan> getAllDateSpans(Long accountId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new CustomerNotFoundException("Customer with id 1 not found"));

        isLoggedInUsersAccount(accountId, loggedInCustomer);

        return dateSpanRepository.findAllByAccountId(accountId);
    }

    public void deleteDateSpan(Long accountId, Long dateSpanId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new CustomerNotFoundException("Customer with id 1 not found"));

        isLoggedInUsersAccount(accountId, loggedInCustomer);
        Account account = accountRepository.findById(accountId)
                                           .orElseThrow(() -> new AccountAccessException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));

        DateSpan dateSpan = dateSpanRepository.findById(dateSpanId)
                                               .orElseThrow(() -> new DateSpanNotFoundException("Date span with id " + dateSpanId + " not found"));
        account.removeDateSpan(dateSpan);
        dateSpanRepository.deleteById(dateSpanId);
    }

    private static void isLoggedInUsersAccount(Long accountId, Customer loggedInCustomer) {
        boolean isLoggedInUsersAccount = loggedInCustomer.getAccounts()
                                                         .stream()
                                                         .anyMatch(account -> account.getId().equals(accountId));

        if (!isLoggedInUsersAccount) {
            throw new AccountAccessException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId());
        }
    }
}
