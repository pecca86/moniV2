package com.pekka.moni.transaction;

import com.pekka.moni.transaction.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/{accountId}/{transactionId}")
    @Cacheable(value = "transaction", key = "#transactionId")
    public ResponseEntity<Transaction> getTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                      @PathVariable Long accountId,
                                                      @PathVariable Long transactionId) {
        return ResponseEntity.ok(transactionService.getTransaction(authentication, accountId, transactionId));
    }

    @GetMapping("/{accountId}")
    @Cacheable(value = "transactions", key = "#authentication.name")
    public ResponseEntity<TransactionResponse> getAccountTransactions(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                                      @PathVariable Long accountId,
                                                                      @RequestParam(name = "sortBy", required = false, defaultValue = "transactionDate") String sortBy,
                                                                      @RequestParam(name = "sortDirection", required = false, defaultValue = "ASC") String sortDirection,
                                                                      @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                                                      @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(transactionService.getAccountTransactions(authentication, accountId, sortBy, sortDirection, page, pageSize));
    }

    @GetMapping("/{accountId}/span")
    @Cacheable(value = "transactions", key = "#authentication.name")
    public ResponseEntity<TransactionDateSpanResponse> getTransactionsByDateSpan(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                                                 @PathVariable Long accountId,
                                                                                 @RequestBody TransactionDateSpan transactionDateSpan) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateSpan(authentication, accountId, transactionDateSpan));
    }

    @GetMapping()
    @Cacheable(value = "transactions", key = "#authentication.name")
    public ResponseEntity<List<Transaction>> getAllTransactions(@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return ResponseEntity.ok(transactionService.getCustomerTransactions(authentication));
    }

    @PostMapping("/{accountId}")
    @Caching(evict = {
            @CacheEvict(value = "transactions", key = "#authentication.name"),
            @CacheEvict(value = "account", key = "#authentication.name")
    })
    public ResponseEntity<Transaction> addNewTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                         @RequestBody @Valid Transaction transaction,
                                                         @PathVariable Long accountId) {
        return transactionService.addAccountTransaction(authentication, transaction, accountId);
    }

    @PostMapping("/{accountId}/create-monthly")
    @Caching(evict = {
            @CacheEvict(value = "transactions", key = "#authentication.name"),
            @CacheEvict(value = "account", key = "#authentication.name")
    })
    public ResponseEntity<String> addMonthlyTransactionsForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                                   @RequestBody @Valid MonthlyTransaction monthlyTransaction,
                                                                   @PathVariable Long accountId) {
        transactionService.addMonthlyTransactionsForAccount(authentication, monthlyTransaction, accountId);
        return ResponseEntity.status(201).body(monthlyTransaction.months() + " transactions created");
    }

    @DeleteMapping("/{transactionId}")
    @Caching(evict = {
            @CacheEvict(value = "transactions", key = "#authentication.name"),
            @CacheEvict(value = "account", key = "#authentication.name")
    })
    public ResponseEntity<String> deleteTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                    @PathVariable Long transactionId) {
        transactionService.deleteTransaction(authentication, transactionId);
        return ResponseEntity.ok("Transaction deleted");
    }

    @DeleteMapping("/{accountId}/delete-all")
    @Caching(evict = {
            @CacheEvict(value = "transactions", key = "#authentication.name"),
            @CacheEvict(value = "account", key = "#authentication.name")
    })
    public ResponseEntity<String> deleteAllSelectedTransactionsForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                                          @RequestBody @Valid DeletableTransactions transactions,
                                                                          @PathVariable Long accountId) {
        transactionService.deleteAllSelectedTransactionsForAccount(authentication, accountId, transactions);
        return ResponseEntity.ok("Transactions deleted");
    }

    @PutMapping("/{transactionId}")
    @Caching(evict = {
            @CacheEvict(value = "transactions", key = "#authentication.name"),
            @CacheEvict(value = "account", key = "#authentication.name")
    })
    public ResponseEntity<String> updateTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                    @RequestBody @Valid Transaction transaction,
                                                    @PathVariable Long transactionId) {
        transactionService.updateTransaction(authentication, transaction, transactionId);
        return ResponseEntity.status(201).body("Transaction updated");
    }

    @PutMapping("/{accountId}/update-all")
    @Caching(evict = {
            @CacheEvict(value = "transactions", key = "#authentication.name"),
            @CacheEvict(value = "account", key = "#authentication.name")
    })
    public ResponseEntity<String> updateAllSelectedTransactionsForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                                          @RequestBody @Valid UpdatableTransactions transactions,
                                                                          @PathVariable Long accountId) {
        transactionService.updateAllSelectedTransactionsForAccount(authentication, accountId, transactions);
        return ResponseEntity.ok("Transactions updated");
    }

    @GetMapping("/categories")
    @Cacheable(value = "transactionCategories")
    public ResponseEntity<List<TransactionCategory>> getTransactionCategories() {
        return ResponseEntity.ok(transactionService.getTransactionCategories());
    }
}
