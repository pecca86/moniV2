package com.pekka.moni.auth;

import com.pekka.moni.auth.dto.AuthenticationRequest;
import com.pekka.moni.auth.dto.AuthenticationResponse;
import com.pekka.moni.auth.dto.NewPasswordRequest;
import com.pekka.moni.auth.dto.RegisterRequest;
import com.pekka.moni.customer.Customer;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping(path = "api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final Bucket bucket;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;

        Bandwidth bandwidth = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder()
                            .addLimit(bandwidth)
                            .build();
    }

    @PostMapping(path = "/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(authenticationService.register(registerRequest));
        }
        return ResponseEntity.status(429).body(AuthenticationResponse.builder().build());
    }

    @PostMapping(path = "/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest loginRequest, HttpServletResponse response) {
        if (bucket.tryConsume(1)) {
            var token = authenticationService.login(loginRequest);
            Cookie cookie = new Cookie("token", token.getToken());
//            cookie.setHttpOnly(true); //TODO: check if these are needed?
//            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(10 * 60 * 60); // 10 hrs
            response.addCookie(cookie);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(429).body(AuthenticationResponse.builder().build());
    }

    @GetMapping("/me")
    public ResponseEntity<Customer> getCustomer(@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return ResponseEntity.ok(authenticationService.getLoggedInCustomer(authentication));
    }

    @PostMapping("/password")
    public ResponseEntity<String> changePassword(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                 @RequestBody NewPasswordRequest password) {
        if (bucket.tryConsume(1)) {
            authenticationService.updatePassword(password, authentication);
            return ResponseEntity.ok("Password updated");
        }
        return ResponseEntity.status(429).body("Too many requests, please try again later");
    }
}
