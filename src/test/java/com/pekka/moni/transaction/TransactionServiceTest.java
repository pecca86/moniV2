package com.pekka.moni.transaction;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.transaction.dto.*;
import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepositoryMock;
    @Mock
    private AccountRepository accountRepositoryMock;
    @Mock
    private LoggedInCustomerService loggedInCustomerServiceMock;

    TransactionService underTest;

    @BeforeEach
    void setUp() {
        underTest = new TransactionService(transactionRepositoryMock, accountRepositoryMock, loggedInCustomerServiceMock);
    }

    @Test
    @DisplayName("Should get transaction by id")
    void should_get_transaction_by_id() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        account.setTransactions(List.of(transaction));
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        Transaction result = underTest.getTransaction(null, 1L, 1L);
        //then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(transaction.getId());
    }

    @ParameterizedTest
    @CsvSource({
            "ASC",
            "DESC"
    })
    @DisplayName("Should get all transactions for given account id")
    void should_get_AccountTransactions(String direction) {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setSum(BigDecimal.valueOf(100.0));
        account.setTransactions(List.of(transaction, transaction2));
        customer.setAccounts(List.of(account));

        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Transaction> transactionPage = new PageImpl<>(List.of(transaction, transaction2), pageRequest, 1);

        if ("ASC".equals(direction)) {
            given(transactionRepositoryMock.findAllByAccountId(account.getId(), pageRequest.withSort(Sort.by("sum").ascending()))).willReturn(transactionPage);
        } else {
            given(transactionRepositoryMock.findAllByAccountId(account.getId(), pageRequest.withSort(Sort.by("sum").descending()))).willReturn(transactionPage);
        }
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        TransactionResponse result = underTest.getAccountTransactions(null, 1L, "sum", direction, 0, 10);
        //then
        assertThat(result).isNotNull();
        assertThat(result.transactions()).hasSize(2);
        assertThat(result.sum()).isEqualTo(BigDecimal.valueOf(200.0));
    }

    @Test
    @DisplayName("Should get all transactions for logged in customer")
    void should_get_logged_in_Customers_Transactions() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setSum(BigDecimal.valueOf(100.0));
        account.setTransactions(List.of(transaction, transaction2));
        customer.setAccounts(List.of(account));

        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        List<Transaction> result = underTest.getCustomerTransactions(any());
        //then
        assertThat(result).isNotNull()
                          .hasSize(2);
        assertThat(result).extracting(Transaction::getId)
                          .containsExactly(1L, 2L);
    }

    @ParameterizedTest
    @CsvSource({
            "WITHDRAWAL",
            "DEPOSIT"
    })
    @DisplayName("Should add a new transaction to given account id")
    void should_add_Account_Transaction_by_account_id(Transaction.TransactionType transactionType) {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setTransactionType(transactionType);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setTransactionDate(LocalDate.of(2021, 1, 1));
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setTransactionType(transactionType);
        transaction2.setSum(BigDecimal.valueOf(200.0));
        transaction2.setTransactionDate(LocalDate.of(2021, 1, 2));
        List<Account> accounts = new ArrayList<>(List.of(account));
        customer.setAccounts(accounts);
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        underTest.addAccountTransaction(null, transaction, 1L);
        underTest.addAccountTransaction(null, transaction2, 1L);
        //then
        assertThat(account.getTransactions()).isNotNull();
        assertThat(account.getTransactions()).hasSize(2);
        if (transactionType == Transaction.TransactionType.WITHDRAWAL) {
            assertThat(account.getBalanceWithTransactions()).isEqualTo(BigDecimal.valueOf(-300.0));
        } else {
            assertThat(account.getBalanceWithTransactions()).isEqualTo(BigDecimal.valueOf(300.0));
        }
    }

    @ParameterizedTest
    @CsvSource({
            "WITHDRAWAL",
            "DEPOSIT"
    })
    @DisplayName("Should add a new transaction to logged in customer for given account id")
    void should_add_monthlyTransactions_ForAccount_by_account_id(Transaction.TransactionType transactionType) {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setTransactionType(transactionType);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setTransactionDate(LocalDate.of(2021, 1, 1));
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        given(accountRepositoryMock.findById(account.getId())).willReturn(Optional.of(account));
        MonthlyTransaction monthlyTransaction = new MonthlyTransaction(transaction, 3);
        //when
        underTest.addMonthlyTransactionsForAccount(null, monthlyTransaction, account.getId());
        //then
        assertThat(account.getTransactions()).isNotNull();
        assertThat(account.getTransactions()).hasSize(3);
        if (transactionType == Transaction.TransactionType.WITHDRAWAL) {
            assertThat(account.getBalanceWithTransactions()).isEqualTo(BigDecimal.valueOf( -300.0));
        } else {
            assertThat(account.getBalanceWithTransactions()).isEqualTo(BigDecimal.valueOf(300.0));
        }
    }

    @Test
    @DisplayName("Should update a transaction by id")
    void should_update_Transaction_by_id() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setTransactionType(Transaction.TransactionType.DEPOSIT);
        Transaction newData = new Transaction();
        newData.setTransactionType(Transaction.TransactionType.DEPOSIT);
        newData.setSum(BigDecimal.valueOf(120.0));
        account.setTransactions(List.of(transaction));
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        underTest.updateTransaction(null, newData, transaction.getId());
        //then
        assertThat(transaction.getSum()).isEqualTo(BigDecimal.valueOf(120.0));
    }

    @Test
    @DisplayName("Should update all selected transactions for given account id")
    void should_update_All_Selected_Transactions_For_given_Account() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setTransactionType(Transaction.TransactionType.DEPOSIT);;
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setSum(BigDecimal.valueOf(100.0));
        transaction2.setTransactionType(Transaction.TransactionType.DEPOSIT);
        Transaction newData = new Transaction();
        newData.setSum(BigDecimal.valueOf(999.99));
        newData.setTransactionCategory(TransactionCategory.FOOD);
        newData.setDescription("description");
        newData.setTransactionType(Transaction.TransactionType.WITHDRAWAL);
        account.setTransactions(List.of(transaction, transaction2));
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        given(transactionRepositoryMock.findAllById(List.of(1L, 2L))).willReturn(List.of(transaction, transaction2));
        UpdatableTransactions updatableTransactions = new UpdatableTransactions(List.of(1L, 2L), newData);
        //when
        underTest.updateAllSelectedTransactionsForAccount(null, account.getId(), updatableTransactions);
        //then
        assertThat(account.getTransactions()).isNotNull();
        assertThat(account.getTransactions()).hasSize(2);
        assertThat(account.getTransactions()).extracting(Transaction::getSum,
                                                     Transaction::getId,
                                                     Transaction::getTransactionCategory,
                                                     Transaction::getDescription,
                                                     Transaction::getTransactionType)
                                             .containsExactly(
                                                     Tuple.tuple(BigDecimal.valueOf(999.99), 1L, TransactionCategory.FOOD, "description", Transaction.TransactionType.WITHDRAWAL),
                                                     Tuple.tuple(BigDecimal.valueOf(999.99), 2L, TransactionCategory.FOOD, "description", Transaction.TransactionType.WITHDRAWAL)
                                             );
    }

    @Test
    @DisplayName("Should delete a transaction by id")
    void should_delete_Transaction_by_id() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setAccount(account);
        List<Transaction> transactions = new ArrayList<>(List.of(transaction));
        account.setTransactions(transactions);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        given(accountRepositoryMock.findById(account.getId())).willReturn(Optional.of(account));
        //when
        underTest.deleteTransaction(null, transaction.getId());
        //then
        assertThat(account.getTransactions()).isNotNull();
        assertThat(account.getTransactions()).isEmpty();
    }

    @Test
    @DisplayName("Should delete all selected transactions for given account id with a list of transaction ids")
    void should_delete_All_Selected_Transactions_For_Account() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setAccount(account);
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setSum(BigDecimal.valueOf(100.0));
        transaction2.setAccount(account);
        Transaction transaction3 = new Transaction();
        transaction3.setId(3L);
        transaction3.setSum(BigDecimal.valueOf(999.99));
        transaction3.setAccount(account);
        List<Transaction> transactions = new ArrayList<>(List.of(transaction, transaction2, transaction3));
        account.setTransactions(transactions);
        account.setCustomer(customer);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        given(transactionRepositoryMock.findAllById(List.of(1L, 2L))).willReturn(List.of(transaction, transaction2));
        given(accountRepositoryMock.findById(account.getId())).willReturn(Optional.of(account));
        DeletableTransactions deletableTransactions = new DeletableTransactions(List.of(1L, 2L));
        //when
        underTest.deleteAllSelectedTransactionsForAccount(null, account.getId(), deletableTransactions);
        //then
        assertThat(account.getTransactions()).isNotNull();
        assertThat(account.getTransactions()).hasSize(1);
        assertThat(account.getTransactions()).extracting(Transaction::getId)
                                             .containsExactly(3L);
    }

    @Test
    @DisplayName("Should get a TransactionDateSpanResponse containing a list of transactions for given date span and given account id")
    void should_get_a_TransactionDateSpanResponse_containing_a_list_of_transactions() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Account account = new Account();
        account.setId(1L);
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setSum(BigDecimal.valueOf(100.0));
        transaction.setTransactionDate(LocalDate.of(2021, 1, 1));
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setSum(BigDecimal.valueOf(100.0));
        transaction2.setTransactionDate(LocalDate.of(2021, 1, 2));
        Transaction transaction3 = new Transaction();
        transaction3.setId(3L);
        transaction3.setSum(BigDecimal.valueOf(999.0));
        transaction3.setTransactionDate(LocalDate.of(2021, 1, 3));
        List<Transaction> transactions = new ArrayList<>(List.of(transaction, transaction2, transaction3));
        account.setTransactions(transactions);
        account.setCustomer(customer);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        LocalDate from = LocalDate.of(2021, 1, 1);
        LocalDate to = LocalDate.of(2021, 1, 2);
        TransactionDateSpan transactionDateSpan = new TransactionDateSpan(from, to);
        given(transactionRepositoryMock.findTransactionsByAccountIdAndTransactionDateBetween(account.getId(), from, to)).willReturn(List.of(transaction, transaction2));
        //when
        TransactionDateSpanResponse result = underTest.getTransactionsByDateSpan(null, account.getId(), transactionDateSpan);
        //then
        assertThat(result).isNotNull();
        assertThat(result.transactions()).hasSize(2);
        assertThat(result.sum()).isEqualTo(BigDecimal.valueOf(200.0));
    }

    @Test
    void getTransactionCategories() {
        List<TransactionCategory> categories = underTest.getTransactionCategories();
        assertThat(categories).isNotNull()
                              .hasSize(18);
    }
}
