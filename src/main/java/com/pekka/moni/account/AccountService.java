package com.pekka.moni.account;

import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.account.AccountNotFoundException;
import com.pekka.moni.exception.account.InvalidAccountDataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final LoggedInCustomerService loggedInCustomerService;

    @Autowired
    public AccountService(AccountRepository accountRepository,
                          CustomerRepository customerRepository,
                          LoggedInCustomerService loggedInCustomerService) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.loggedInCustomerService = loggedInCustomerService;
    }

    public List<Account> getCustomerAccounts(Authentication authentication) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        return loggedInCustomer.getAccounts();
    }

    public Account getAccount(@NonNull Authentication authentication, @NonNull Long accountId) throws AccountNotFoundException {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        return loggedInCustomer.getAccounts()
                               .stream()
                               .filter(account -> account.getId().equals(accountId))
                               .findFirst()
                               .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));
    }

    public ResponseEntity<AccountResponseDto> createAccount(Authentication authentication, Account account) {
        if (account != null) {
            Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
            account.setIban(account.getIban().replaceAll("\\s", "")); // Remove whitespace from IBAN
            loggedInCustomer.addAccount(account);
            customerRepository.save(loggedInCustomer);
            return ResponseEntity.status(201).body(new AccountResponseDto("Account created", 201, account));
        } else {
            throw new InvalidAccountDataException("Account data is invalid");
        }
    }

    public ResponseEntity<AccountResponseDto> deleteAccount(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        Optional<Account> accountToDelete = loggedInCustomer.getAccounts()
                                                            .stream()
                                                            .filter(account -> account.getId().equals(accountId))
                                                            .findFirst();
        if (accountToDelete.isPresent()) {
            Account a = accountToDelete.get();
            loggedInCustomer.removeAccount(a);
            accountRepository.deleteById(a.getId());
            return ResponseEntity.ok(new AccountResponseDto("Account deleted", 200, a));
        } else {
            throw new AccountNotFoundException("Account with id " + accountId + " not found for this customer");
        }
    }

    public ResponseEntity<AccountResponseDto> updateAccount(Authentication authentication, Account account, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        Optional<Account> accountToUpdate = loggedInCustomer.getAccounts()
                                                            .stream()
                                                            .filter(a -> a.getId().equals(accountId))
                                                            .findFirst();

        if (accountToUpdate.isPresent()) {
            Account a = accountToUpdate.get();
            a.setBalance(account.getBalance());
            a.setAccountType(account.getAccountType());
            a.setIban(account.getIban().replaceAll("\\s", ""));
            a.setName(account.getName());
            a.setSavingsGoal(account.getSavingsGoal());
            a.setBalance(account.getBalance());
            accountRepository.save(accountToUpdate.get());
            return ResponseEntity.ok(new AccountResponseDto("Account updated", 200, a));
        } else {
            throw new AccountNotFoundException("Account with id " + account.getId() + " not found for this customer");
        }
    }
}
