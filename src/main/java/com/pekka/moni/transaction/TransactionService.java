package com.pekka.moni.transaction;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.account.AccountAccessException;
import com.pekka.moni.exception.account.AccountNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

//TODO: MAKE WORK WITH LOGGER IN USER AS CUSTOMER
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;

    private final AccountRepository accountRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, CustomerRepository customerRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    public Transaction getTransaction(Long accountId, Long transactionId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

        return loggedInCustomer.getAccounts()
                               .stream()
                               .filter(account -> account.getId().equals(accountId))
                               .findFirst()
                               .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()))
                               .getTransactions()
                               .stream()
                               .filter(transaction -> transaction.getId().equals(transactionId))
                               .findFirst()
                               .orElseThrow(() -> new AccountNotFoundException("Transaction with id " + transactionId + " not found for account with id " + accountId));
    }

    public Page<Transaction> getAccountTransactions(Long accountId, String sortBy, String sortDirection, int page, int pageSize) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

        boolean isLoggedInUsersAccount = loggedInCustomer.getAccounts()
                                                         .stream()
                                                         .anyMatch(account -> account.getId().equals(accountId));

        if (!isLoggedInUsersAccount) {
            throw new AccountAccessException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId());
        }

        PageRequest pageRequest = PageRequest.of(page, pageSize);

        return switch (Sort.Direction.fromString(sortDirection)) {
            case ASC ->
                    transactionRepository.findAllByAccountId(accountId, pageRequest.withSort(Sort.by(sortBy).ascending()));
            case DESC ->
                    transactionRepository.findAllByAccountId(accountId, pageRequest.withSort(Sort.by(sortBy).descending()));
        };

    }

    public List<Transaction> getCustomerTransactions() {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));
        return loggedInCustomer.getAccounts().stream()
                               .flatMap(account -> account.getTransactions().stream())
                               .toList();
    }

    public void addAccountTransaction(Transaction transaction, Long accountId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

        Account account = loggedInCustomer.getAccounts()
                                          .stream()
                                          .filter(a -> a.getId().equals(accountId))
                                          .findFirst()
                                          .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));

        account.addTransaction(transaction);
        accountRepository.save(account);
    }

    public void updateTransaction(Transaction newData, Long transactionId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

        Transaction transactionToUpdate = loggedInCustomer.getAccounts()
                                                          .stream()
                                                          .flatMap(account -> account.getTransactions().stream())
                                                          .filter(transaction -> transaction.getId().equals(transactionId))
                                                          .findFirst()
                                                          .orElseThrow(() -> new AccountNotFoundException("Transaction with id " + transactionId + " not found for customer with id " + loggedInCustomer.getId()));

        transactionToUpdate.setSum(newData.getSum());
        transactionToUpdate.setTransactionType(newData.getTransactionType());
        transactionToUpdate.setDescription(newData.getDescription());
        transactionToUpdate.setTransactionDate(newData.getTransactionDate());

        transactionRepository.save(transactionToUpdate);
    }

    public void deleteTransaction(Long transactionId) {
        Customer loggedInCustomer = customerRepository.findById(1L)
                                                      .orElseThrow(() -> new AccountNotFoundException("Customer with id 1 not found"));

        Transaction transactionToDelete = loggedInCustomer.getAccounts()
                                                          .stream()
                                                          .flatMap(account -> account.getTransactions().stream())
                                                          .filter(transaction -> transaction.getId().equals(transactionId))
                                                          .findFirst()
                                                          .orElseThrow(() -> new AccountNotFoundException("Transaction with id " + transactionId + " not found for customer with id " + loggedInCustomer.getId()));

        Account account = accountRepository.findById(transactionToDelete.getAccount().getId())
                                           .orElseThrow(() -> new AccountNotFoundException("Account with id " + transactionToDelete.getAccount().getId() + " not found"));
        account.removeTransaction(transactionToDelete);
        transactionRepository.deleteById(transactionToDelete.getId());
    }
}
