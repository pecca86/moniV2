package com.pekka.moni.account;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Account> getCustomerAccounts(@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return accountService.getCustomerAccounts(authentication);
    }

    @GetMapping("/{accountId}")
    public Account getAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                              @PathVariable Long accountId) {
        return accountService.getAccount(authentication, accountId);
    }

    @PostMapping
    public ResponseEntity<String> createAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                        @RequestBody @Valid Account account) {
        accountService.createAccount(authentication, account);
        return ResponseEntity.status(201).body("Account created");
    }

    @DeleteMapping("/{accountId}")
    public void deleteAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                              @PathVariable Long accountId) {
        accountService.deleteAccount(authentication, accountId);
    }

    @PutMapping("/{accountId}")
    public void updateAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                              @RequestBody @Valid Account account,
                              @PathVariable Long accountId) {
        accountService.updateAccount(authentication, account, accountId);
    }
}
