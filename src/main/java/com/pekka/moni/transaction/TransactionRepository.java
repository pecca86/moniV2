package com.pekka.moni.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findAllByAccountId(Long accountId, PageRequest pageRequest);

    List<Transaction> findTransactionsByAccountIdAndTransactionDateBetween(Long accountId, LocalDate from, LocalDate to);
}
