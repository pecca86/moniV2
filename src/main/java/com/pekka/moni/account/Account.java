package com.pekka.moni.account;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.transaction.Transaction;
import com.pekka.moni.datespan.DateSpan;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "Account")
@Table(name = "account")
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Account {
    @Id
    @SequenceGenerator(
            name = "customer_sequence",
            sequenceName = "customer_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "customer_sequence"
    )
    @Column(
            name = "id",
            updatable = false
    )
    private Long id;

    @NotBlank(message = "IBAN is required")
    @Column(
            name = "iban",
            nullable = false,
            unique = true,
            columnDefinition = "TEXT"
    )
    private String iban;

    @NotBlank(message = "Account name is required")
    @JsonProperty("name")
    @Size(
            min = 2,
            max = 20,
            message = "Account name should be between 2 and 20 characters"
    )
    @Column(
            name = "name",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String name;

    @Column(
            name = "savings_goal",
            columnDefinition = "DECIMAL"
    )
    @JsonProperty("savings_goal")
    private Double savingsGoal;

    @NotBlank(message = "Account type is required")
    @Column(
            name = "account_type",
            nullable = false,
            columnDefinition = "TEXT"
    )
    @JsonProperty("account_type")
    private String accountType;

    @NotNull(message = "Balance is required")
    @Column(
            name = "balance",
            nullable = false,
            columnDefinition = "DECIMAL"
    )
    private Double balance;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
            name = "customer_id",
            nullable = false,
            referencedColumnName = "id",
            foreignKey = @ForeignKey(
                    name = "customer_account_fk"
            )
    )
    private Customer customer;

    @JsonIgnore
    @OneToMany(
            mappedBy = "account",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Transaction> transactions;

    @JsonIgnore
    @OneToMany(
            mappedBy = "account",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<DateSpan> dateSpans;

    public Account(Customer customer, String iban, String name, Double savingsGoal, String accountType, Double balance) {
        this.customer = customer;
        this.iban = iban;
        this.name = name;
        this.savingsGoal = savingsGoal;
        this.accountType = accountType;
        this.balance = balance;
    }

    public void addTransaction(Transaction transaction) {
        if (transactions == null) {
            transactions = new ArrayList<>();
        }

        if (transaction != null) {
            this.transactions.add(transaction);
            transaction.setAccount(this);
        }
    }

    public void removeTransaction(Transaction transaction) {
        if (transactions != null && transactions.contains(transaction)) {
            this.transactions.remove(transaction);
            transaction.setAccount(null);
        }
    }

    public void addDateSpan(DateSpan dateSpan) {
        if (dateSpans == null) {
            dateSpans = new ArrayList<>();
        }

        if (dateSpan != null) {
            this.dateSpans.add(dateSpan);
            dateSpan.setAccount(this);
        }
    }

    public void removeDateSpan(DateSpan dateSpan) {
        if (dateSpans != null && dateSpans.contains(dateSpan)) {
            this.dateSpans.remove(dateSpan);
            dateSpan.setAccount(null);
        }
    }
}
