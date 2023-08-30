package com.pekka.moni.account;

import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.account.AccountNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Account> getCustomerAccounts() {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));
        return loggedInCustomer.getAccounts();
    }

    public Account getAccount(Long accountId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));
        return loggedInCustomer.getAccounts()
                               .stream()
                               .filter(account -> account.getId().equals(accountId))
                               .findFirst()
                               .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));
    }

    public void createAccount(Account account) {
        if (account != null) {
            Customer loggedInCustomer = customerRepository.findById(1L)
                                                          .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));
            account.setIban(account.getIban().replaceAll("\\s", "")); // Remove whitespace from IBAN
            loggedInCustomer.addAccount(account);
            customerRepository.save(loggedInCustomer);
        }
    }

    public void deleteAccount(Long accountId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

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

    public void updateAccount(Account account, Long accountId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

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
}
