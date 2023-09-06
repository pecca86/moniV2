package com.pekka.moni.auth;

import com.pekka.moni.auth.dto.AuthenticationRequest;
import com.pekka.moni.auth.dto.AuthenticationResponse;
import com.pekka.moni.auth.dto.NewPasswordRequest;
import com.pekka.moni.auth.dto.RegisterRequest;
import com.pekka.moni.config.JwtService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.customer.Role;
import com.pekka.moni.exception.customer.CustomerAlreadyExistsException;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        var customer = new Customer(
                registerRequest.getEmail(),
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                passwordEncoder.encode(registerRequest.getPassword()),
                Role.ROLE_USER
        );

        try {
            customerRepository.save(customer);
        } catch (Exception e) {
            throw new CustomerAlreadyExistsException(customer.getEmail() + " already exists");
        }

        var jwtToken = jwtService.generateJwtToken(customer);
        return AuthenticationResponse.builder()
                                     .token(jwtToken)
                                     .build();
    }

    public AuthenticationResponse login(AuthenticationRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        var customer = customerRepository.findCustomerByEmail(loginRequest.getEmail())
                                         .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        var jwtToken = jwtService.generateJwtToken(customer);
        return AuthenticationResponse.builder()
                                     .token(jwtToken)
                                     .build();
    }

    public Customer getLoggedInCustomer(Authentication authentication) {
        String email = authentication.getName();
        return customerRepository.findCustomerByEmail(email)
                                 .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

    }

    public void updatePassword(NewPasswordRequest passwordRequest, Authentication authentication) {
        String email = authentication.getName();
        Customer customerToUpdate = customerRepository.findCustomerByEmail(email)
                                                     .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        customerToUpdate.setPassword(passwordEncoder.encode(passwordRequest.password()));
        customerRepository.save(customerToUpdate);
    }
}
