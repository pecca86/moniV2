package com.pekka.moni.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.pekka.moni.customer.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

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
    @Column(
            name = "account_type",
            columnDefinition = "TEXT"
    )
    @JsonProperty("account_type")
    private String accountType; //Todo: ENUM?
    @Column(
            name = "balance",
            columnDefinition = "DECIMAL"
    )
    private Double balance;

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

    public Account(Customer customer, String iban, String name, Double savingsGoal, String accountType, Double balance) {
        this.iban = iban;
        this.name = name;
        this.savingsGoal = savingsGoal;
        this.accountType = accountType;
        this.balance = balance;
        this.customer = customer;
    }
}
