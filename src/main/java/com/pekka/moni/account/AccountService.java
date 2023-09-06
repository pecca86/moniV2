package com.pekka.moni.account;

import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.account.AccountNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//TODO: MAKE WORK WITH LOGGER IN USER AS CUSTOMER
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository, CustomerRepository customerRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    public List<Account> getCustomerAccounts(Authentication authentication) {
        Customer loggedInCustomer = getLoggedInCustomer(authentication);
        return loggedInCustomer.getAccounts();
    }

    public Account getAccount(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = getLoggedInCustomer(authentication);
        return loggedInCustomer.getAccounts()
                               .stream()
                               .filter(account -> account.getId().equals(accountId))
                               .findFirst()
                               .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));
    }

    public void createAccount(Authentication authentication, Account account) {
        if (account != null) {
            Customer loggedInCustomer = getLoggedInCustomer(authentication);
            account.setIban(account.getIban().replaceAll("\\s", "")); // Remove whitespace from IBAN
            loggedInCustomer.addAccount(account);
            customerRepository.save(loggedInCustomer);
        }
    }

    public void deleteAccount(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = getLoggedInCustomer(authentication);

        Optional<Account> accountToDelete = loggedInCustomer.getAccounts()
                                                            .stream()
                                                            .filter(account -> account.getId().equals(accountId))
                                                            .findFirst();
        if (accountToDelete.isPresent()) {
            loggedInCustomer.removeAccount(accountToDelete.get());
            accountRepository.deleteById(accountToDelete.get().getId());
        } else {
            throw new AccountNotFoundException("Account with id " + accountId + " not found for this customer");
        }
    }

    public void updateAccount(Authentication authentication, Account account, Long accountId) {
        Customer loggedInCustomer = getLoggedInCustomer(authentication);

        Optional<Account> accountToUpdate = loggedInCustomer.getAccounts()
                                                            .stream()
                                                            .filter(a -> a.getId().equals(accountId))
                                                            .findFirst();
        if (accountToUpdate.isPresent()) {
            accountToUpdate.get().setBalance(account.getBalance());
            accountToUpdate.get().setAccountType(account.getAccountType());
            accountToUpdate.get().setIban(account.getIban().replaceAll("\\s", ""));
            accountToUpdate.get().setName(account.getName());
            accountToUpdate.get().setSavingsGoal(account.getSavingsGoal());
            accountToUpdate.get().setBalance(account.getBalance());
            accountRepository.save(accountToUpdate.get());
        } else {
            throw new AccountNotFoundException("Account with id " + account.getId() + " not found for this customer");
        }
    }

    private Customer getLoggedInCustomer(Authentication authentication) {
        return customerRepository.findCustomerByEmail(authentication.getName())
                                 .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));
    }
}
