package com.pekka.moni.transaction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.pekka.moni.account.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.*;

import java.time.LocalDate;

@Entity(name = "Transaction")
@Table(name = "transaction")
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Transaction {

    enum TransactionType {
        DEPOSIT,
        WITHDRAWAL,
    }

    enum TransactionCategory {
        FOOD,
        TRANSPORTATION,
        ENTERTAINMENT,
        OTHER,
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
    private Double sum;

    @NotNull(message = "Transaction type is required")
    @Column(
            name = "transaction_type",
            nullable = false,
            columnDefinition = "TEXT"
    )
    @JsonProperty("transaction_type")
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @NotBlank(message = "Description is required")
    @Column(
            name = "description",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String description;

    @Past(message = "Transaction date must be in the past")
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

}

