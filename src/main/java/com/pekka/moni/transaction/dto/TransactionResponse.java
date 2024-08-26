package com.pekka.moni.transaction.dto;

import com.pekka.moni.transaction.Transaction;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

public record TransactionResponse(Page<Transaction> transactions, BigDecimal sum){
}
