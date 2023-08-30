package com.pekka.moni.transaction;

import java.time.LocalDate;

public record TransactionDateSpan(LocalDate from, LocalDate to) {
}
