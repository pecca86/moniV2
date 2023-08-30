package com.pekka.moni.transaction;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/{accountId}/{transactionId}")
    public Transaction getTransaction(@PathVariable Long accountId,
                                      @PathVariable Long transactionId) {
        return transactionService.getTransaction(accountId, transactionId);
    }

    @GetMapping( "/{accountId}")
    public Page<Transaction> getAccountTransactions(@PathVariable Long accountId,
                                                    @RequestParam(name = "sortBy", required = false, defaultValue = "transactionDate") String sortBy,
                                                    @RequestParam(name = "sortDirection", required = false, defaultValue = "ASC") String sortDirection,
                                                    @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                                                    @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize) {
        return transactionService.getAccountTransactions(accountId, sortBy, sortDirection, page, pageSize);
    }

    @PostMapping("/{accountId}")
    public void addNewTransaction(@RequestBody @Valid Transaction transaction,
                                  @PathVariable Long accountId) {
        transactionService.addAccountTransaction(transaction, accountId);
    }

    @DeleteMapping("/{transactionId}")
    public void deleteTransaction(@PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId);
    }

    @PutMapping("/{transactionId}")
    public void updateTransaction(@RequestBody @Valid Transaction transaction,
                                  @PathVariable Long transactionId) {
        transactionService.updateTransaction(transaction, transactionId);
    }
}
