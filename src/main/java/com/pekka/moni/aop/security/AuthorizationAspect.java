package com.pekka.moni.aop.security;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthorizationAspect {

    // TODO: Check for transaction service, in those methods where we check if given account belongs to the logged in customer

    @Before("execution(* com.pekka.moni.account.AccountService.*(..))")
    public void authorizeAccountService() {
        System.out.println("Authorizing account service");
    }
}
