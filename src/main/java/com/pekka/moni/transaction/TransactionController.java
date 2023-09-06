package com.pekka.moni.transaction;

import com.pekka.moni.transaction.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public Transaction getTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                      @PathVariable Long accountId,
                                      @PathVariable Long transactionId) {
        return transactionService.getTransaction(authentication, accountId, transactionId);
    }

    @GetMapping( "/{accountId}")
    public Page<Transaction> getAccountTransactions(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                    @PathVariable Long accountId,
                                                    @RequestParam(name = "sortBy", required = false, defaultValue = "transactionDate") String sortBy,
                                                    @RequestParam(name = "sortDirection", required = false, defaultValue = "ASC") String sortDirection,
                                                    @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                                    @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize) {
        return transactionService.getAccountTransactions(authentication, accountId, sortBy, sortDirection, page, pageSize);
    }

    @GetMapping("/{accountId}/span")
    public TransactionDateSpanResponse getTransactionsByDateSpan(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                                 @PathVariable Long accountId,
                                                                 @RequestBody TransactionDateSpan transactionDateSpan) {
        return transactionService.getTransactionsByDateSpan(authentication, accountId, transactionDateSpan);
    }

    @GetMapping()
    public List<Transaction> getAllTransactions(@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return transactionService.getCustomerTransactions(authentication);
    }

    @PostMapping("/{accountId}")
    public void addNewTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                  @RequestBody @Valid Transaction transaction,
                                  @PathVariable Long accountId) {
        transactionService.addAccountTransaction(authentication, transaction, accountId);
    }

    @PostMapping("/{accountId}/create-monthly")
    public void addMonthlyTransactionsForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                 @RequestBody @Valid MonthlyTransaction monthlyTransaction,
                                                 @PathVariable Long accountId) {
        transactionService.addMonthlyTransactionsForAccount(authentication, monthlyTransaction, accountId);
    }

    @DeleteMapping("/{transactionId}")
    public void deleteTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                  @PathVariable Long transactionId) {
        transactionService.deleteTransaction(authentication, transactionId);
    }

    @DeleteMapping("/{accountId}/delete-all")
    public void deleteAllSelectedTransactionsForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                        @RequestBody @Valid DeletableTransactions transactions,
                                                        @PathVariable Long accountId) {
        transactionService.deleteAllSelectedTransactionsForAccount(authentication, accountId, transactions);
    }

    @PutMapping("/{transactionId}")
    public void updateTransaction(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                  @RequestBody @Valid Transaction transaction,
                                  @PathVariable Long transactionId) {
        transactionService.updateTransaction(authentication, transaction, transactionId);
    }

    @PutMapping("/{accountId}/update-all")
    public void updateAllSelectedTransactionsForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                        @RequestBody @Valid UpdatableTransactions transactions,
                                                        @PathVariable Long accountId) {
        transactionService.updateAllSelectedTransactionsForAccount(authentication, accountId, transactions);
    }
}
