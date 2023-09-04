package com.pekka.moni.transaction.dto;

import com.pekka.moni.transaction.Transaction;

public record MonthlyTransaction(Transaction data, int months) {}
