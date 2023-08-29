package com.pekka.moni.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findCustomerByEmail(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM Customer c WHERE c.id = ?1")
    void deleteCustomerAndAllData(Long id);

    @Query(value = "SELECT id FROM customer WHERE id = ?1", nativeQuery = true)
    void deleteCustomerAndAllDataNativeSQL(Long id);

    @Query(value = "SELECT id FROM customer WHERE id = :id", nativeQuery = true)
    void deleteCustomerAndAllDataNativeSQLWithParams(@Param("id") Long id);
}
