package com.pekka.moni.transaction.dto;

import com.pekka.moni.transaction.Transaction;

import java.math.BigDecimal;
import java.util.List;

public record TransactionDateSpanResponse(List<Transaction> transactions, BigDecimal sum) {}
