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
    private final AccountRepository accountRepository;

    @Autowired
    public StatisticsService(LoggedInCustomerService loggedInCustomerService, AccountRepository accountRepository) {
        this.loggedInCustomerService = loggedInCustomerService;
        this.accountRepository = accountRepository;
    }

    public ResponseEntity<StatisticsAllAccountsResponse> getAccountsStatistics(Authentication authentication, Long accountId) {
        Customer loggedInCustomer = loggedInCustomerService.getLoggedInCustomer(authentication);

        List<Account> customerAccounts = loggedInCustomer.getAccounts();
        List<AccountWithTransactions> results = new ArrayList<>();
        Map<Month, BigDecimal> resultForMonthMap = constructMonthMap();
        LocalDate startDate = LocalDate.now();

        for (Account account : customerAccounts) {
            List<Transaction> transactions = account.getTransactions();
            for (Transaction transaction : transactions) {
                if (transactionIsWithinThisYearSpan(transaction, Year.from(startDate))) {
                    if (transactionBelongsToTargetMonth(transaction, Month.from(startDate))) {
                        resultForMonthMap.computeIfPresent(Month.from(startDate), (k, currentMonthSum) -> currentMonthSum.add(transaction.getSum()));
                    }
                }
                startDate = startDate.plusMonths(1);
            }
            results.add(new AccountWithTransactions(account, resultForMonthMap));
        }








        Month month = Month.from(startDate);
        Year year = Year.from(startDate.plusYears(1));





        return ResponseEntity.ok(new StatisticsAllAccountsResponse(results));
    }

    private boolean transactionIsWithinThisYearSpan(Transaction transaction, Year year) {
        return transaction.getTransactionDate().getYear() <= year.getValue() && transaction.getTransactionDate().getYear() >= year.getValue() - 1;
    }

    private boolean transactionBelongsToTargetMonth(Transaction transaction, Month month) {
        return transaction.getTransactionDate().getMonth().equals(month);
    }

    private Map<Month, BigDecimal> constructMonthMap() {
        Map<Month, BigDecimal> months = new LinkedHashMap<>();
        months.put(Month.JANUARY, BigDecimal.ZERO);
        months.put(Month.FEBRUARY, BigDecimal.ZERO);
        months.put(Month.MARCH, BigDecimal.ZERO);
        months.put(Month.APRIL, BigDecimal.ZERO);
        months.put(Month.MAY, BigDecimal.ZERO);
        months.put(Month.JUNE, BigDecimal.ZERO);
        months.put(Month.AUGUST, BigDecimal.ZERO);
        months.put(Month.SEPTEMBER, BigDecimal.ZERO);
        months.put(Month.OCTOBER, BigDecimal.ZERO);
        months.put(Month.NOVEMBER, BigDecimal.ZERO);
        months.put(Month.DECEMBER, BigDecimal.ZERO);
        return months;
    }
}
