package com.pekka.moni.transaction.dto;

import com.pekka.moni.transaction.Transaction;

import java.util.List;

public record UpdatableTransactions(List<Long> transactionIds, Transaction data) {}
