package com.pekka.moni.transaction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.pekka.moni.account.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity(name = "Transaction")
@Table(name = "transaction")
@Data
@NoArgsConstructor
public class Transaction {

    public enum TransactionType {
        DEPOSIT,
        WITHDRAWAL,
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

    @NotNull(message = "Sum is required")
    @Column(
            name = "sum",
            nullable = false,
            columnDefinition = "DECIMAL"
    )
    private BigDecimal sum;

    @NotNull(message = "Transaction type is required")
    @Column(
            name = "transaction_type",
            nullable = false,
            columnDefinition = "TEXT"
    )
    @JsonProperty("transaction_type")
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @NotNull(message = "Transaction category is required")
    @Column(
            name = "transaction_category",
            nullable = false,
            columnDefinition = "TEXT"
    )
    @JsonProperty("transaction_category")
    @Enumerated(EnumType.STRING)
    private TransactionCategory transactionCategory;

    @NotBlank(message = "Description is required")
    @Column(
            name = "description",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String description;

    @FutureOrPresent(message = "Transaction date must be in the past")
    @Column(
            name = "transaction_date",
            nullable = false,
            columnDefinition = "TIMESTAMP WITHOUT TIME ZONE"
    )
    @JsonProperty("transaction_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate transactionDate;

    @ManyToOne
    @JoinColumn(
            name = "account_id",
            referencedColumnName = "id",
            foreignKey = @ForeignKey(
                    name = "account_transaction_fk"
            )
    )
    private Account account;

    // Switch the sum according to the transaction type
    @PostLoad
    @PostPersist
    @PostUpdate
    private void postLoad() {
        // Post-load or post-persist logic here
        this.sum = validateSumAccordingToTransactionType();
    }

    @PrePersist
    @PreUpdate
    private void prePersistUpdate() {
        this.sum = validateSumAccordingToTransactionType();
    }

    public Transaction(BigDecimal sum, TransactionType transactionType, String description, LocalDate transactionDate, Account account, TransactionCategory transactionCategory) {
        this.sum = sum;
        this.transactionType = transactionType;
        this.description = description;
        this.transactionDate = transactionDate;
        this.account = account;
        this.transactionCategory = transactionCategory;
    }

    private BigDecimal validateSumAccordingToTransactionType() {
        if (this.transactionType.equals(Transaction.TransactionType.WITHDRAWAL) && this.sum.compareTo(BigDecimal.ZERO) > 0) {
            return this.sum.multiply(BigDecimal.valueOf(-1));
        }
        if (this.transactionType.equals(Transaction.TransactionType.DEPOSIT) && this.sum.compareTo(BigDecimal.ZERO) < 0) {
            return this.sum.multiply(BigDecimal.valueOf(-1));
        }
        return this.sum;
    }

}

