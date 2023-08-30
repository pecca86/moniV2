package com.pekka.moni.transaction.dto;

import java.time.LocalDate;

public record TransactionDateSpan(LocalDate from, LocalDate to) {
}
