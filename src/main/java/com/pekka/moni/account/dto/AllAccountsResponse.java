package com.pekka.moni.account.dto;

import com.pekka.moni.account.Account;

import java.math.BigDecimal;
import java.util.List;

public record AllAccountsResponse(List<Account> accounts, BigDecimal totalBalance) {
}
