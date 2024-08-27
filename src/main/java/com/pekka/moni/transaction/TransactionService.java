package com.pekka.moni.transaction;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.exception.account.AccountAccessException;
import com.pekka.moni.exception.account.AccountNotFoundException;
import com.pekka.moni.transaction.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final LoggedInCustomerService loggedInCustomerService;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository,
                              LoggedInCustomerService loggedInCustomerService) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.loggedInCustomerService = loggedInCustomerService;
    }

    public Transaction getTransaction(Authentication authentication, Long accountId, Long transactionId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

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

    public TransactionResponse getAccountTransactions(Authentication authentication, Long accountId, String sortBy, String sortDirection, int page, int pageSize) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        isLoggedInUsersAccount(accountId, loggedInCustomer);

        PageRequest pageRequest = PageRequest.of(page, pageSize);

        return switch (Sort.Direction.fromString(sortDirection)) {
            case ASC -> {
                Page<Transaction> targetTransactions = transactionRepository.findAllByAccountId(accountId, pageRequest.withSort(Sort.by(sortBy).ascending()));
                BigDecimal sum = targetTransactions.stream()
                                                   .map(Transaction::getSum)
                                                   .reduce(BigDecimal.ZERO, BigDecimal::add);
                yield new TransactionResponse(targetTransactions, sum);
            }
            case DESC -> {
                Page<Transaction> targetTransactions = transactionRepository.findAllByAccountId(accountId, pageRequest.withSort(Sort.by(sortBy).descending()));
                BigDecimal sum = targetTransactions.stream()
                                                   .map(Transaction::getSum)
                                                   .reduce(BigDecimal.ZERO, BigDecimal::add);
                yield new TransactionResponse(targetTransactions, sum);
            }
        };

    }

    public List<Transaction> getCustomerTransactions(Authentication authentication) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        return loggedInCustomer.getAccounts().stream()
                               .flatMap(account -> account.getTransactions().stream())
                               .toList();
    }

    public ResponseEntity<Transaction> addAccountTransaction(Authentication authentication, Transaction transaction, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        Account account = loggedInCustomer.getAccounts()
                                          .stream()
                                          .filter(a -> a.getId().equals(accountId))
                                          .findFirst()
                                          .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found for customer with id " + loggedInCustomer.getId()));

        transaction.setSum(validateSumAccordingToTransactionType(transaction));
        account.addTransaction(transaction);
        accountRepository.save(account);
        return ResponseEntity.status(201).body(transaction);
    }

    public void addMonthlyTransactionsForAccount(Authentication authentication, MonthlyTransaction monthlyTransaction, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        isLoggedInUsersAccount(accountId, loggedInCustomer);

        // create a new transaction until count is equal to monthlyTransaction.months()
        List<Transaction> createdTransactions = new ArrayList<>();

        LocalDate date = monthlyTransaction.data().getTransactionDate();
        Account account = accountRepository.findById(accountId)
                                           .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found"));

        for (int i = 0; i < monthlyTransaction.months(); i++) {
            monthlyTransaction.data().setSum(validateSumAccordingToTransactionType(monthlyTransaction.data()));
            Transaction transaction = new Transaction(
                    monthlyTransaction.data().getSum(),
                    monthlyTransaction.data().getTransactionType(),
                    monthlyTransaction.data().getDescription(),
                    date,
                    account,
                    monthlyTransaction.data().getTransactionCategory()
            );
            createdTransactions.add(transaction);
            date = date.plusMonths(1);
        }

        account.addTransactions(createdTransactions);

        accountRepository.save(account);
    }

    public void updateTransaction(Authentication authentication, Transaction newData, Long transactionId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        Transaction transactionToUpdate = loggedInCustomer.getAccounts()
                                                          .stream()
                                                          .flatMap(account -> account.getTransactions().stream())
                                                          .filter(transaction -> transaction.getId().equals(transactionId))
                                                          .findFirst()
                                                          .orElseThrow(() -> new AccountNotFoundException("Transaction with id " + transactionId + " not found for customer with id " + loggedInCustomer.getId()));

        newData.setSum(validateSumAccordingToTransactionType(newData));
        transactionToUpdate.setSum(newData.getSum());
        transactionToUpdate.setTransactionType(newData.getTransactionType());
        transactionToUpdate.setDescription(newData.getDescription());
        transactionToUpdate.setTransactionDate(newData.getTransactionDate());
        transactionToUpdate.setTransactionCategory(newData.getTransactionCategory());

        transactionRepository.save(transactionToUpdate);
    }

    public void updateAllSelectedTransactionsForAccount(Authentication authentication, Long accountId, UpdatableTransactions updatableTransactions) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        isLoggedInUsersAccount(accountId, loggedInCustomer);

        List<Transaction> transactionsToUpdate = transactionRepository.findAllById(updatableTransactions.transactionIds());
        transactionsToUpdate
                .forEach(t -> {
                    t.setSum(updatableTransactions.data().getSum() != null
                            ? updatableTransactions.data().getSum()
                            : t.getSum());
                    t.setSum(validateSumAccordingToTransactionType(t));
                    t.setTransactionType(updatableTransactions.data().getTransactionType() != null
                            ? updatableTransactions.data().getTransactionType()
                            : t.getTransactionType());
                    t.setDescription(updatableTransactions.data().getDescription() != null
                            ? updatableTransactions.data().getDescription()
                            : t.getDescription());
                    t.setTransactionDate(updatableTransactions.data().getTransactionDate() != null
                            ? updatableTransactions.data().getTransactionDate()
                            : t.getTransactionDate());
                    t.setTransactionCategory(updatableTransactions.data().getTransactionCategory() != null
                            ? updatableTransactions.data().getTransactionCategory()
                            : t.getTransactionCategory());
                });

        transactionRepository.saveAll(transactionsToUpdate);
    }

    public void deleteTransaction(Authentication authentication, Long transactionId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

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

    public void deleteAllSelectedTransactionsForAccount(Authentication authentication, Long accountId, DeletableTransactions deletableTransactions) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        isLoggedInUsersAccount(accountId, loggedInCustomer);

        List<Transaction> transactionsToDelete = transactionRepository.findAllById(deletableTransactions.transactions());

        Account account = accountRepository.findById(accountId)
                                           .orElseThrow(() -> new AccountNotFoundException("Account with id " + accountId + " not found"));

        transactionsToDelete.forEach(transaction -> {
            if (!transaction.getAccount().getId().equals(accountId)) {
                throw new AccountAccessException("Transaction with id " + transaction.getId() + " does not belong to account with id " + accountId);
            }
        });

        account.getTransactions().removeAll(transactionsToDelete);
        transactionRepository.deleteAll(transactionsToDelete);
    }

    public TransactionDateSpanResponse getTransactionsByDateSpan(Authentication authentication, Long accountId, TransactionDateSpan transactionDateSpan) {

        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        isLoggedInUsersAccount(accountId, loggedInCustomer);

        LocalDate from = transactionDateSpan.from();
        LocalDate to = transactionDateSpan.to();

        List<Transaction> targetTransactions = transactionRepository.findTransactionsByAccountIdAndTransactionDateBetween(accountId, from, to);
        BigDecimal sum = targetTransactions.stream()
                                           .map(Transaction::getSum)
                                           .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TransactionDateSpanResponse(targetTransactions, sum);
    }

    public List<TransactionCategory> getTransactionCategories() {
        return List.of(TransactionCategory.values());
    }

    private BigDecimal validateSumAccordingToTransactionType(Transaction transaction) {
        if (transaction.getTransactionType().equals(Transaction.TransactionType.WITHDRAWAL) && transaction.getSum().compareTo(BigDecimal.ZERO) > 0) {
            return transaction.getSum().multiply(BigDecimal.valueOf(-1));
        }
        if (transaction.getTransactionType().equals(Transaction.TransactionType.DEPOSIT) && transaction.getSum().compareTo(BigDecimal.ZERO) < 0) {
            return transaction.getSum().multiply(BigDecimal.valueOf(-1));
        }
        return transaction.getSum();
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
