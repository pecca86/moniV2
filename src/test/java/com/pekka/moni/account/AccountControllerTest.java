package com.pekka.moni.account;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

// TODO: Refactor to use TestCointainers
@ExtendWith(MockitoExtension.class)
class AccountControllerTest {

    @InjectMocks
    private AccountController underTest;

    @Mock
    private AccountService accountServiceMock;

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    @DisplayName("Should get all CustomerAccounts")
    void should_get_all_CustomerAccounts() {
        //given
        Account account1 = new Account();
        account1.setId(1L);
        Account account2 = new Account();
        account2.setId(2L);
        given(accountServiceMock.getCustomerAccounts(any())).willReturn(List.of(account1, account2));
        //when
        ResponseEntity<List<Account>> response = underTest.getCustomerAccounts(any());
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsAll(List.of(account1, account2));
    }

    @Test
    @DisplayName("Should get CustomerAccount by account id")
    void should_get_customer_Account_by_account_id() {
        //given
        Account account = new Account();
        account.setId(1L);
        given(accountServiceMock.getAccount(any(), any(Long.class))).willReturn(account);
        //when
        ResponseEntity<Account> response = underTest.getAccount(any(), any(Long.class));
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(account);
    }

    @Test
    @DisplayName("Should create Account")
    void should_create_Account() {
        //given
        Account account = new Account();
        account.setId(1L);
        AccountResponseDto accountResponseDto = new AccountResponseDto("Account created", 201, account);
        ResponseEntity<AccountResponseDto> expectedResponse = ResponseEntity.status(201).body(accountResponseDto);
        given(accountServiceMock.createAccount(null, account)).willReturn(expectedResponse);
        //when
        ResponseEntity<AccountResponseDto> response = underTest.createAccount(null, account);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody().account()).isEqualTo(account);
        assertThat(response.getBody().status()).isEqualTo(201);
        assertThat(response.getBody().message()).isEqualTo("Account created");
    }

    @Test
    @DisplayName("Should delete Account")
    void should_delete_Account() {
        //given
        Account account = new Account();
        account.setId(1L);
        AccountResponseDto accountResponseDto = new AccountResponseDto("Account deleted", 200, account);
        ResponseEntity<AccountResponseDto> expectedResponse = ResponseEntity.status(200).body(accountResponseDto);
        given(accountServiceMock.deleteAccount(null, 1L)).willReturn(expectedResponse);
        //when
        ResponseEntity<AccountResponseDto> response = underTest.deleteAccount(null, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().account()).isEqualTo(account);
        assertThat(response.getBody().status()).isEqualTo(200);
        assertThat(response.getBody().message()).isEqualTo("Account deleted");
    }

    @Test
    @DisplayName("Should update Account")
    void should_update_Account() {
        //given
        Account account = new Account();
        account.setId(1L);
        AccountResponseDto accountResponseDto = new AccountResponseDto("Account updated", 201, account);
        ResponseEntity<AccountResponseDto> expectedResponse = ResponseEntity.status(201).body(accountResponseDto);
        given(accountServiceMock.updateAccount(null, account, 1L)).willReturn(expectedResponse);
        //when
        ResponseEntity<AccountResponseDto> response = underTest.updateAccount(null, account, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody().account()).isEqualTo(account);
        assertThat(response.getBody().status()).isEqualTo(201);
        assertThat(response.getBody().message()).isEqualTo("Account updated");
    }
}
