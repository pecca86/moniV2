package com.pekka.moni.statistics.dto;

import com.pekka.moni.account.Account;

import java.math.BigDecimal;
import java.time.Month;
import java.util.Map;

public record AccountsWithTransactions(Account account, Map<Month, BigDecimal> sumsPerMonth) {
}
