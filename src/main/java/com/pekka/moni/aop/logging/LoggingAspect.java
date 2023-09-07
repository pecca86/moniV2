package com.pekka.moni.aop.logging;

import com.pekka.moni.account.Account;
import com.pekka.moni.customer.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class LoggingAspect {

    private final CustomerRepository customerRepository;

    @Order(1)
    @Before("execution(* com.pekka.moni.account.AccountService.createAccount(..))")
    public void logCreateAccount() {
        System.out.println("Logging create account");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            System.out.println("Logged in user: " + authentication.getName());
        }
    }

    @Before("execution(* com.pekka.moni.account.AccountService.*(..))")
    public void logAccountService() {
        System.out.println("Logging account service");
    }

    @Pointcut("execution(* com.pekka.moni.account.AccountService.*(..))")
    private void accountServicePointcut() {
    }

    @Pointcut("execution(* com.pekka.moni.account.AccountService.*.get*(..))")
    private void getters() {
    }

    @Pointcut("execution(* com.pekka.moni.account.AccountService.*.set*(..))")
    private void setters() {
    }

    @Before("accountServicePointcut()")
    public void logAccountServicePointcut() {
        System.out.println("Logging account service pointcut");
    }

    @Before("accountServicePointcut() && !(getters() || setters())")
    public void logAccountServicePointcutWithoutGettersAndSetters() {
        System.out.println("Logging account service pointcut without getters and setters");
    }

    @Before("execution(* com.pekka.moni.account.AccountService.*(..)) && args(authentication, account)")
    public void logAccountServiceWithArgs(Authentication authentication, Account account) {
        System.out.println("Logging account service with args");
        System.out.println("Authentication: " + authentication.getName());
        System.out.println("Account: " + account);
    }

    // Before any method with Authentication as first argument
    @Before("execution(* com.pekka.moni.account.AccountService.*(..)) && args(authentication, ..)")
    public void logAuthenticationCallsInAccountService(Authentication authentication) {
        System.out.println("Logging authentication");
        System.out.println("Authentication call: " + authentication.getName());
    }

}
