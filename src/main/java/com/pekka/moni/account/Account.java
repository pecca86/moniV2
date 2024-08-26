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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
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

    public enum AccountType {
        SAVINGS,
        DEPOSIT,
        CREDIT,
        INVESTMENT,
        OTHER
    }

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
    private BigDecimal savingsGoal;

    @NotNull(message = "Transaction category is required")
    @Column(
            name = "account_type",
            nullable = false,
            columnDefinition = "TEXT"
    )
    @JsonProperty("account_type")
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @NotNull(message = "Balance is required")
    @Column(
            name = "balance",
            nullable = false,
            columnDefinition = "DECIMAL"
    )
    private BigDecimal balance;

    @Transient
    @JsonProperty("balance_with_transactions")
    private BigDecimal balanceWithTransactions;

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

    public Account(Customer customer, String iban, String name, BigDecimal savingsGoal, AccountType accountType, BigDecimal balance) {
        this.customer = customer;
        this.iban = iban;
        this.name = name;
        this.savingsGoal = savingsGoal.setScale(2, RoundingMode.HALF_EVEN);
        this.accountType = accountType;
        this.balance = balance.setScale(2, RoundingMode.HALF_EVEN);
    }

    public void addTransaction(Transaction transaction) {
        if (transactions == null) {
            transactions = new ArrayList<>();
        }

        this.transactions.add(transaction);
        transaction.setAccount(this);
        this.balanceWithTransactions = calculateBalance();
    }

    public void addTransactions(List<Transaction> createdTransactions) {
        if (transactions == null) {
            transactions = new ArrayList<>();
        }

        if (balance == null) {
            balance = BigDecimal.valueOf(0.0);
        }
        transactions.addAll(createdTransactions);
        this.balance = calculateBalance();
    }

    public void removeTransaction(Transaction transaction) {
        if (transactions == null) {
            transactions = new ArrayList<>();
        }

        if (balance == null) {
            balance = BigDecimal.valueOf(0.0);
        }

        if (balanceWithTransactions == null) {
            balanceWithTransactions = BigDecimal.valueOf(0.0);
        }

        if (transactions.contains(transaction)) {
            this.transactions.remove(transaction);
            transaction.setAccount(null);
            this.balanceWithTransactions = balanceWithTransactions.subtract(transaction.getSum());
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

    public BigDecimal getBalanceWithTransactions() {
        if (transactions == null) {
            return this.balance;
        }

        if (balance == null) {
            balance = BigDecimal.valueOf(0.0);
        }

        BigDecimal transactionsSum = transactions.stream()
                                                 .map(Transaction::getSum)
                                                 .reduce(BigDecimal.ZERO, BigDecimal::add);
        return this.balance.add(transactionsSum);
    }

    private BigDecimal calculateBalance() {
        var today = LocalDate.now();

        return transactions.stream()
                           .filter(transaction -> transaction.getTransactionDate().isAfter(today.minusDays(1)))
                           .map(Transaction::getSum)
                           .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public @NotNull(message = "Balance is required") BigDecimal getBalance() {
        return balance.setScale(2, RoundingMode.HALF_EVEN);
    }

    public void setBalance(@NotNull(message = "Balance is required") BigDecimal balance) {
        this.balance = balance.setScale(2, RoundingMode.HALF_EVEN);
    }

    public void setBalanceWithTransactions(BigDecimal balanceWithTransactions) {
        this.balanceWithTransactions = balanceWithTransactions.setScale(2, RoundingMode.HALF_EVEN);
    }

    public BigDecimal getSavingsGoal() {
        return savingsGoal.setScale(2, RoundingMode.HALF_EVEN);
    }

    public void setSavingsGoal(BigDecimal savingsGoal) {
        this.savingsGoal = savingsGoal.setScale(2, RoundingMode.HALF_EVEN);
    }
}
