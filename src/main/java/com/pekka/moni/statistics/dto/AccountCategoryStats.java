package com.pekka.moni.statistics.dto;

import com.pekka.moni.transaction.TransactionCategory;

import java.math.BigDecimal;
import java.util.Map;

public record AccountCategoryStats(Map<TransactionCategory, BigDecimal> data) {
}
