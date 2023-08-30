package com.pekka.moni.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // TODO add SQL statement
    Page<Transaction> findAllByAccountId(Long accountId, PageRequest pageRequest);
}
