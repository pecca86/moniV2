package com.pekka.moni.statistics.dto;

import java.util.List;

//public record StatisticsAllAccountsResponse(List<AccountWithTransactions> accountWithTransactions) {
//}

public record StatisticsAllAccountsResponse(List<AccountsWithTransactions> data) {
}
