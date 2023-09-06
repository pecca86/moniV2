package com.pekka.moni.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.account.id = ?1")
    Page<Transaction> findAllByAccountId(Long accountId, PageRequest pageRequest);

    @Query("SELECT t FROM Transaction t WHERE t.account.id = ?1 AND t.transactionDate BETWEEN ?2 AND ?3")
    List<Transaction> findTransactionsByAccountIdAndTransactionDateBetween(Long accountId, LocalDate from, LocalDate to);
}
