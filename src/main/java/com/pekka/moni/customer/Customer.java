package com.pekka.moni.customer;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.pekka.moni.account.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity(name = "Customer")
@Table(name = "customer")
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Customer implements UserDetails {
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

    @NotBlank(message = "Email is required")
    @Email(
            message = "Email should be valid",
            regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\a-zA-Z]{2,4}$"
    )
    @Column(
            name = "email",
            nullable = false,
            unique = true,
            columnDefinition = "TEXT"
    )
    private String email;

    @NotBlank(message = "First name is required")
    @JsonProperty("first_name")
    @Pattern(
            regexp = "^[a-zA-Z- ]+$",
            message = "First name should be valid"
    )
    @Size(
            min = 2,
            max = 20,
            message = "First name should be between 2 and 20 characters"
    )
    @Column(
            name = "first_name",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @JsonProperty("last_name")
    @Pattern(
            regexp = "^[a-zA-Z- ]+$",
            message = "Last name should be valid"
    )
    @Size(
            min = 2,
            max = 20,
            message = "Last name should be between 2 and 20 characters"
    )
    @Column(
            name = "last_name",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String lastName;

    @NotBlank(message = "Password is required")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(
            name = "password",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String password;

    @OneToMany(
            mappedBy = "customer",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private List<Account> accounts;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Customer(String email, String firstName, String lastName, String password, Role role) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
    }

    public void addAccount(Account account) {
        if (accounts == null) {
            accounts = new ArrayList<>();
        }

        if (!accounts.contains(account) && account != null) {
            accounts.add(account);
            account.setCustomer(this);
        }
    }

    public void removeAccount(Account account) {
        if (accounts != null && accounts.contains(account)) {
            accounts.remove(account);
            account.setCustomer(null);
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return password;
    }
}