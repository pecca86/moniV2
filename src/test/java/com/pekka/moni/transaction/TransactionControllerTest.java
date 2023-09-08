package com.pekka.moni.transaction;

import com.pekka.moni.transaction.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @InjectMocks
    TransactionController underTest;

    @Mock
    TransactionService transactionServiceMock;

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    @DisplayName("Should get Transaction by account id and transaction id")
    void should_get_Transaction_by_account_id_and_transaction_id() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        given(transactionServiceMock.getTransaction(any(), any(Long.class), any(Long.class))).willReturn(transaction);
        //when
        ResponseEntity<Transaction> response = underTest.getTransaction(any(), any(Long.class), any(Long.class));
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(transaction);
    }

    @Test
    @DisplayName("Should get AccountTransactions by account id")
    void should_get_AccountTransactions_by_account_id() {
        //given
        Transaction transaction1 = new Transaction();
        transaction1.setId(1L);
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        Page<Transaction> transactionPage = new PageImpl<>(List.of(transaction1, transaction2));
        TransactionResponse transactionResponse = new TransactionResponse(transactionPage, 100.0);
        given(transactionServiceMock.getAccountTransactions(null, 1L, "firstName", "ASC", 0, 10)).willReturn(transactionResponse);
        //when
        ResponseEntity<TransactionResponse> response = underTest.getAccountTransactions(null, 1L, "firstName", "ASC", 0, 10);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(transactionResponse);
    }

    @Test
    @DisplayName("Should get Transactions By DateSpan by account id")
    void should_get_Transactions_By_DateSpan_by_account_id() {
        //given
        Transaction transaction1 = new Transaction();
        transaction1.setId(1L);
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        LocalDate from = LocalDate.of(2020, 1, 1);
        LocalDate to = LocalDate.of(2020, 12, 31);
        TransactionDateSpan transactionDateSpan = new TransactionDateSpan(from, to);

        TransactionDateSpanResponse transactionDateSpanResponse = new TransactionDateSpanResponse(List.of(transaction1, transaction2), 100.0);
        given(transactionServiceMock.getTransactionsByDateSpan(null, 1L, transactionDateSpan)).willReturn(transactionDateSpanResponse);
        //when
        ResponseEntity<TransactionDateSpanResponse> response = underTest.getTransactionsByDateSpan(null, 1L, transactionDateSpan);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(transactionDateSpanResponse);
    }

    @Test
    @DisplayName("Should get All Transactions for logged in customer")
    void should_get_All_Transactions_for_logged_in_customer() {
        //given
        Transaction transaction1 = new Transaction();
        transaction1.setId(1L);
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        given(transactionServiceMock.getCustomerTransactions(null)).willReturn(List.of(transaction1, transaction2));
        //when
        ResponseEntity<List<Transaction>> response = underTest.getAllTransactions(null);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsAll(List.of(transaction1, transaction2));
    }

    @Test
    @DisplayName("Should add New Transaction by account id")
    void should_add_New_Transaction_by_account_id() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        //when
        ResponseEntity<String> response = underTest.addNewTransaction(null, transaction, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo("Transaction created");
    }

    @Test
    @DisplayName("Should add Monthly Transactions For Account by Account id")
    void should_add_Monthly_Transactions_For_Account_by_account_id() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setTransactionDate(LocalDate.of(2020, 1, 1));
        MonthlyTransaction monthlyTransaction = new MonthlyTransaction(transaction, 3);
        //when
        ResponseEntity<String> response = underTest.addMonthlyTransactionsForAccount(null, monthlyTransaction, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo(monthlyTransaction.months() + " transactions created");
    }

    @Test
    @DisplayName("Should delete Transaction by transaction id")
    void should_delete_Transaction_by_transaction_id() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        //when
        ResponseEntity<String> response = underTest.deleteTransaction(null, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Transaction deleted");
    }

    @Test
    @DisplayName("Should delete All Selected Transactions For Account by transaction id list")
    void should_delete_All_Selected_Transactions_For_Account_by_transaction_id_list() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        DeletableTransactions transactions = new DeletableTransactions(List.of(1L, 2L));
        //when
        ResponseEntity<String> response = underTest.deleteAllSelectedTransactionsForAccount(null, transactions, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Transactions deleted");
    }

    @Test
    @DisplayName("Should update Transaction by transaction id")
    void should_update_Transaction_by_transaction_id() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        //when
        ResponseEntity<String> response = underTest.updateTransaction(null, transaction, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo("Transaction updated");
    }

    @Test
    @DisplayName("Should update All Selected Transactions For Account by account id")
    void should_update_All_Selected_Transactions_For_Account_by_account_id() {
        //given
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        UpdatableTransactions transactions = new UpdatableTransactions(List.of(1L, 2L), transaction);
        //when
        ResponseEntity<String> response = underTest.updateAllSelectedTransactionsForAccount(null, transactions, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Transactions updated");
    }

    @Test
    void getTransactionCategories() {
        //given
        given(transactionServiceMock.getTransactionCategories()).willReturn(List.of(TransactionCategory.HOBBIES, TransactionCategory.ENTERTAINMENT));
        //when
        ResponseEntity<List<TransactionCategory>> response = underTest.getTransactionCategories();
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsAll(List.of(TransactionCategory.HOBBIES, TransactionCategory.ENTERTAINMENT));
    }
}