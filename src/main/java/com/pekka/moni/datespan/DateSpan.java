package com.pekka.moni.datespan;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pekka.moni.account.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Past;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity(name = "DateSpan")
@Table(name = "datespan")
@ToString
@EqualsAndHashCode
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

    @FutureOrPresent(message = "Date should be today's date or in the future")
    @Column(
            name = "from_date",
            nullable = false,
            columnDefinition = "TIMESTAMP WITHOUT TIME ZONE"
    )
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate from;

    @Future(message = "Date should be in the future")
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

    public LocalDate getFrom() {
        return from;
    }

    public void setFrom(LocalDate from) {
        this.from = from;
    }

    public LocalDate getTo() {
        return to;
    }

    public void setTo(LocalDate to) {
        this.to = to;
    }
}
