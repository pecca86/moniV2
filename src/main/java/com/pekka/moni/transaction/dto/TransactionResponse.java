package com.pekka.moni.transaction.dto;

import com.pekka.moni.transaction.Transaction;
import org.springframework.data.domain.Page;

public record TransactionResponse(Page<Transaction> transactions, Double sum){
}
