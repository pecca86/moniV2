package com.pekka.moni.auth;

import com.pekka.moni.auth.dto.AuthenticationRequest;
import com.pekka.moni.auth.dto.AuthenticationResponse;
import com.pekka.moni.auth.dto.NewPasswordRequest;
import com.pekka.moni.auth.dto.RegisterRequest;
import com.pekka.moni.customer.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping(path = "/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @PostMapping(path = "/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest loginRequest) {
        return ResponseEntity.ok(authenticationService.login(loginRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<Customer> getCustomer(@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return ResponseEntity.ok(authenticationService.getLoggedInCustomer(authentication));
    }

    @PostMapping("/password")
    public ResponseEntity<String> changePassword(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                               @RequestBody NewPasswordRequest password) {
        authenticationService.updatePassword(password, authentication);
        return ResponseEntity.ok("Password updated");
    }
}
