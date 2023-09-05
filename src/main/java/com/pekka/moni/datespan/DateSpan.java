package com.pekka.moni.datespan;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pekka.moni.account.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

@Entity(name = "DateSpan")
@Table(name = "datespan")
public class DateSpan {
    @Id
    @SequenceGenerator(
            name = "transaction_sequence",
            sequenceName = "transaction_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "transaction_sequence"
    )
    @Column(
            name = "id",
            updatable = false
    )
    private Long id;

    @Past(message = "Date should be in the past")
    @Column(
            name = "from_date",
            nullable = false,
            columnDefinition = "TIMESTAMP WITHOUT TIME ZONE"
    )
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate from;
    @Past(message = "Date should be in the past")
    @Column(
            name = "to_date",
            nullable = false,
            columnDefinition = "TIMESTAMP WITHOUT TIME ZONE"
    )
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate to;

    @ManyToOne
    @JoinColumn(
            name = "account_id",
            referencedColumnName = "id",
            foreignKey = @ForeignKey(
                    name = "account_datespan_fk"
            )
    )
    private Account account;

    public DateSpan() {
    }

    public DateSpan(LocalDate from, LocalDate to, Account account) {
        this.from = from;
        this.to = to;
        this.account = account;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account dateSpanAccount) {
        this.account = dateSpanAccount;
    }
}
