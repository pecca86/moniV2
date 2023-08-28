package com.pekka.moni.customer;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public record Customer(
        Long id,
        @NotBlank(message = "Email is required")
        @Email(
                message = "Email should be valid",
                regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\a-zA-Z]{2,4}$"
        )
        String email,
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
        String firstName,
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
        String lastName,
        @NotBlank(message = "Password is required")
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        String password
) {
}