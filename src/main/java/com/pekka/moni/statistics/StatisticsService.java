package com.pekka.moni.statistics;

import com.pekka.moni.account.Account;
import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.exception.account.AccountNotFoundException;
import com.pekka.moni.statistics.dto.AccountCategoryStats;
import com.pekka.moni.statistics.dto.AccountWithTransactions;
import com.pekka.moni.statistics.dto.AccountsWithTransactions;
import com.pekka.moni.statistics.dto.StatisticsAllAccountsResponse;
import com.pekka.moni.transaction.Transaction;
import com.pekka.moni.transaction.TransactionCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class StatisticsService {

    private final LoggedInCustomerService loggedInCustomerService;

    @Autowired
    public StatisticsService(LoggedInCustomerService loggedInCustomerService) {
        this.loggedInCustomerService = loggedInCustomerService;
    }

    public ResponseEntity<AccountCategoryStats> getTransactionsCategoryForAccountStatistics(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        Account account = loggedInCustomer.getAccounts().stream()
                .filter(a -> a.getId().equals(accountId))
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Map<TransactionCategory, BigDecimal> transactionCategorySumMap = constructCategoryMap();

        List<Transaction> transactions = account.getTransactions();
        for (Transaction transaction : transactions) {
            if (transactionIsWithinThisYearSpan(transaction)) {
                transactionCategorySumMap.computeIfPresent(transaction.getTransactionCategory(), (k, currentCategorySum) -> currentCategorySum.add(transaction.getSum()));
            }
        }
        return ResponseEntity.ok(new AccountCategoryStats(transactionCategorySumMap));
    }

    public ResponseEntity<AccountWithTransactions> getAccountTransactionsStatistics(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);
        Account account = loggedInCustomer.getAccounts().stream()
                .filter(a -> a.getId().equals(accountId))
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Map<Month, BigDecimal> resultForMonthMap = constructMonthMap();
        LocalDate startDate = LocalDate.now();
        List<Transaction> transactions = account.getTransactions();

        for (Transaction transaction : transactions) {
            if (transactionIsWithinThisYearSpan(transaction)) {
                resultForMonthMap.computeIfPresent(Month.from(transaction.getTransactionDate()), (k, currentMonthSum) -> currentMonthSum.add(transaction.getSum()));
            }
            startDate = startDate.plusMonths(1);
        }

        return ResponseEntity.ok(new AccountWithTransactions(account, resultForMonthMap));
    }

    public ResponseEntity<StatisticsAllAccountsResponse> getAccountsStatistics(Authentication authentication) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        List<Account> customerAccounts = loggedInCustomer.getAccounts();
        List<AccountsWithTransactions> results = new ArrayList<>();
        Map<Month, BigDecimal> resultForMonthMap;
        LocalDate startDate;

        for (Account account : customerAccounts) {
            resultForMonthMap = constructMonthMap();
            startDate = LocalDate.now();
            List<Transaction> transactions = account.getTransactions();
            for (Transaction transaction : transactions) {
                if (transactionIsWithinThisYearSpan(transaction)) {
                    resultForMonthMap.computeIfPresent(Month.from(transaction.getTransactionDate()), (k, currentMonthSum) -> currentMonthSum.add(transaction.getSum()));
                }
                startDate = startDate.plusMonths(1);
            }
            results.add(new AccountsWithTransactions(account, resultForMonthMap));
        }

        return ResponseEntity.ok(new StatisticsAllAccountsResponse(results));
    }

    private boolean transactionIsWithinThisYearSpan(Transaction transaction) {
        LocalDate startDate = LocalDate.now();
        return transaction.getTransactionDate().isBefore(startDate.plusYears(1)) && transaction.getTransactionDate().isAfter(startDate.minusDays(1));
    }

    private Map<Month, BigDecimal> constructMonthMap() {
        Map<Month, BigDecimal> generated = new LinkedHashMap<>();

        LocalDate startDate = LocalDate.now();

        // Construct the map so the month start from the current month
        for (int i = 0; i < 12; i++) {
            generated.put(Month.from(startDate), BigDecimal.ZERO);
            startDate = startDate.plusMonths(1);
        }

        return generated;
    }

    private Map<TransactionCategory, BigDecimal> constructCategoryMap() {
        Map<TransactionCategory, BigDecimal> generated = new HashMap<>();

        for (TransactionCategory category : TransactionCategory.values()) {
            generated.put(category, BigDecimal.ZERO);
        }

        return generated;
    }


}
