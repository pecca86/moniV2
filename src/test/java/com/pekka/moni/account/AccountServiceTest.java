package com.pekka.moni.account;

import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.account.AccountNotFoundException;
import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepositoryMock;
    @Mock
    private CustomerRepository customerRepositoryMock;
    @Mock
    private LoggedInCustomerService loggedInCustomerServiceMock;
    private AccountService underTest;

    @BeforeEach
    void setUp() {
        underTest = new AccountService(accountRepositoryMock, customerRepositoryMock, loggedInCustomerServiceMock);
    }

    @Test
    @DisplayName("Should find a existing account by id")
    void should_find_account_by_id() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        Account result = underTest.getAccount(null, 1L);
        //then
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should find all accounts for a customer")
    void should_find_all_accounts_for_a_customer() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        List<Account> results = underTest.getCustomerAccounts(null);
        //then
        assertThat(results).hasSize(1);
        assertThat(results).extracting(Account::getId)
                           .containsExactly(1L);
    }

    @Test
    @DisplayName("Should create a new account")
    void should_create_new_account() {
        //given
        Account account = new Account();
        account.setId(1L);
        account.setIban("FI1234567890123456");
        Customer customer = new Customer();
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        underTest.createAccount(null, account);
        //then
        assertThat(customer.getAccounts()).hasSize(1);
        assertThat(customer.getAccounts()).extracting(Account::getId)
                                           .containsExactly(1L);
    }

    @Test
    @DisplayName("Should update an existing account by id")
    void should_update_account_by_id() {
        //given
        Account account = new Account();
        account.setId(1L);
        account.setIban("FI1234567890123456");
        Account updated = new Account();
        updated.setIban("FI1234567890123500");
        Customer customer = new Customer();
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        underTest.updateAccount(null, updated, 1L);
        //then
        assertThat(customer.getAccounts()).hasSize(1);
        assertThat(customer.getAccounts()).extracting(Account::getId, Account::getIban)
                                           .containsExactly(Tuple.tuple(1L, "FI1234567890123500"));
    }

    @Test
    @DisplayName("Should delete an existing account by id")
    void should_delete_account_by_id() {
        //given
        Account account = new Account();
        account.setId(1L);
        Account account2 = new Account();
        account2.setId(2L);
        Customer customer = new Customer();
        customer.setId(1L);
        account.setCustomer(customer);
        account2.setCustomer(customer);
        customer.addAccount(account);
        customer.addAccount(account2);
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        underTest.deleteAccount(null, 1L);
        //then
        assertThat(customer.getAccounts()).isNotNull();
        assertThat(customer.getAccounts()).hasSize(1);
        assertThat(customer.getAccounts()).extracting(Account::getId)
                                           .containsExactly(2L);
    }

    @Test
    @DisplayName("Should throw exception when account not found for customer")
    void should_throw_exception_when_account_not_found_for_customer() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setId(1L);
        account.setCustomer(customer);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        //then
        assertThrows(AccountNotFoundException.class, () -> underTest.getAccount(null, 2L));
    }
}