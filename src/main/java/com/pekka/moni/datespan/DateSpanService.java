package com.pekka.moni.datespan;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.exception.account.AccountAccessException;
import com.pekka.moni.exception.datespan.DateSpanNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DateSpanService {

    private final DateSpanRepository dateSpanRepository;
    private final AccountRepository accountRepository;
    private final LoggedInCustomerService loggedInCustomerService;

    public DateSpanService(DateSpanRepository dateSpanRepository,
                           AccountRepository accountRepository,
                           LoggedInCustomerService loggedInCustomerService) {
        this.dateSpanRepository = dateSpanRepository;
        this.accountRepository = accountRepository;
        this.loggedInCustomerService = loggedInCustomerService;
    }

    public void createDateSpan(Authentication authentication, DateSpan dateSpan, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        isLoggedInUsersAccount(accountId, loggedInCustomer);
        Account account = accountRepository.findById(accountId)
                                           .orElseThrow(() -> new AccountAccessException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));
        account.addDateSpan(dateSpan);
        accountRepository.save(account);
    }

    public DateSpan getDateSpan(Authentication authentication, Long accountId, Long dateSpanId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        isLoggedInUsersAccount(accountId, loggedInCustomer);
        return dateSpanRepository.findById(dateSpanId)
                                 .orElseThrow(() -> new DateSpanNotFoundException("Date span with id " + dateSpanId + " not found"));
    }

    public List<DateSpan> getAllDateSpans(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        isLoggedInUsersAccount(accountId, loggedInCustomer);

        return dateSpanRepository.findAllByAccountId(accountId);
    }

    public void deleteDateSpan(Authentication authentication, Long accountId, Long dateSpanId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

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
