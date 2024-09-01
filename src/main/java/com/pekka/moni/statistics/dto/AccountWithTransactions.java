package com.pekka.moni.statistics.dto;

import java.math.BigDecimal;
import java.time.Month;
import java.util.Map;

public record AccountWithTransactions(Map<Month, BigDecimal> data) {
}
