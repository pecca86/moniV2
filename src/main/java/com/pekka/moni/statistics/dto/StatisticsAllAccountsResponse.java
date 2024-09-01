package com.pekka.moni.statistics.dto;

import com.pekka.moni.account.Account;
import com.pekka.moni.transaction.Transaction;

import java.math.BigDecimal;
import java.time.Month;
import java.util.List;
import java.util.Map;

//public record StatisticsAllAccountsResponse(List<AccountWithTransactions> accountWithTransactions) {
//}

public record StatisticsAllAccountsResponse(List<AccountWithTransactions> data) {
}
