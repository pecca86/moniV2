package com.pekka.moni.datespan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DateSpanRepository extends JpaRepository<DateSpan, Long> {

    List<DateSpan> findAllByAccountId(Long accountId);
}
