package com.pekka.moni.statistics.dto;

import java.math.BigDecimal;
import java.time.Month;

public record TransactionSumsPerMonth(Month month, BigDecimal sum) {
}
