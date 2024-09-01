package com.pekka.moni.statistics;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.statistics.dto.AccountWithTransactions;
import com.pekka.moni.statistics.dto.StatisticsAllAccountsResponse;
import com.pekka.moni.statistics.dto.TransactionSumsPerMonth;
import com.pekka.moni.transaction.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.*;

@Service
public class StatisticsService {

    private final LoggedInCustomerService loggedInCustomerService;

    @Autowired
    public StatisticsService(LoggedInCustomerService loggedInCustomerService) {
        this.loggedInCustomerService = loggedInCustomerService;
    }

    public ResponseEntity<StatisticsAllAccountsResponse> getAccountsStatistics(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        List<Account> customerAccounts = loggedInCustomer.getAccounts();
        List<AccountWithTransactions> results = new ArrayList<>();
        Map<Month, BigDecimal> resultForMonthMap = constructMonthMap();
        LocalDate startDate = LocalDate.now();

        for (Account account : customerAccounts) {
            resultForMonthMap = constructMonthMap();
            startDate = LocalDate.now();
            System.out.println("RESETTED STARTDATE TO: " + startDate);
            List<Transaction> transactions = account.getTransactions();
            for (Transaction transaction : transactions) {
                System.out.println("TRANSACTION DATE IS: " + transaction.getTransactionDate());
                if (transactionIsWithinThisYearSpan(transaction)) {
                    System.out.println("CALCUTAING FOR TRANSACTION: " + transaction.getSum() + " WITH TARGET DATE: " + startDate);
//                    if (transactionBelongsToTargetMonth(transaction, Month.from(startDate))) {
                        resultForMonthMap.computeIfPresent(Month.from(transaction.getTransactionDate()), (k, currentMonthSum) -> currentMonthSum.add(transaction.getSum()));
//                    }
                }
                startDate = startDate.plusMonths(1);
            }
            results.add(new AccountWithTransactions(account, resultForMonthMap));
        }




//        System.out.println("NEW VALUES FOR MAP ARE: " + resultForMonthMap);
        return ResponseEntity.ok(new StatisticsAllAccountsResponse(results));
    }

    private boolean transactionIsWithinThisYearSpan(Transaction transaction) {
//        return transaction.getTransactionDate().getYear() <= year.getValue() && transaction.getTransactionDate().getYear() >= year.getValue() - 1;
        LocalDate startDate = LocalDate.now();
        return transaction.getTransactionDate().isBefore(startDate.plusYears(1)) && transaction.getTransactionDate().isAfter(startDate.minusDays(1));
    }

    private boolean transactionBelongsToTargetMonth(Transaction transaction, Month month) {
        return transaction.getTransactionDate().getMonth().equals(month);
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
}
