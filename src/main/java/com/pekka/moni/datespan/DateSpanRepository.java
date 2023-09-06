package com.pekka.moni.datespan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DateSpanRepository extends JpaRepository<DateSpan, Long> {

    @Query("SELECT d FROM DateSpan d WHERE d.account.id = ?1")
    List<DateSpan> findAllByAccountId(Long accountId);
}
