package com.pekka.moni.account;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    @Cacheable(value = "accounts", key = "#authentication.name")
    public ResponseEntity<List<Account>> getCustomerAccounts(@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return ResponseEntity.ok(accountService.getCustomerAccounts(authentication));
    }

    @GetMapping("/{accountId}")
    @Cacheable(value = "account", key = "#accountId")
    public ResponseEntity<Account> getAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                              @PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getAccount(authentication, accountId));
    }

    @PostMapping
    @CacheEvict(value = "accounts", key = "#authentication.name")
    public ResponseEntity<String> createAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                        @RequestBody @Valid Account account) {
        accountService.createAccount(authentication, account);
        return ResponseEntity.status(201).body("Account created");
    }

    @DeleteMapping("/{accountId}")
    @CacheEvict(value = "accounts", key = "#authentication.name")
    public ResponseEntity<String> deleteAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                              @PathVariable Long accountId) {
        accountService.deleteAccount(authentication, accountId);
        return ResponseEntity.ok("Account deleted");
    }

    @PutMapping("/{accountId}")
    @CacheEvict(value = "accounts", key = "#authentication.name")
    public ResponseEntity<String> updateAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                              @RequestBody @Valid Account account,
                              @PathVariable Long accountId) {
        accountService.updateAccount(authentication, account, accountId);
        return ResponseEntity.status(201).body("Account updated");
    }
}
