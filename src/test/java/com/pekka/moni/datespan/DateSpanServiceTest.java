package com.pekka.moni.datespan;

import com.pekka.moni.account.Account;
import com.pekka.moni.account.AccountRepository;
import com.pekka.moni.auth.LoggedInCustomerService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.datespan.dto.DateSpanResponseDto;
import com.pekka.moni.exception.account.AccountAccessException;
import com.pekka.moni.exception.datespan.InvalidDateSpanException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class DateSpanServiceTest {

    @Mock
    private DateSpanRepository dateSpanRepositoryMock;
    @Mock
    private AccountRepository accountRepositoryMock;
    @Mock
    private LoggedInCustomerService loggedInCustomerServiceMock;

    private DateSpanService underTest;

    @BeforeEach
    void setUp() {
        underTest = new DateSpanService(dateSpanRepositoryMock, accountRepositoryMock, loggedInCustomerServiceMock);
    }

    @Test
    @DisplayName("Should find a existing date span by id")
    void should_find_date_span_by_id() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        LocalDate from = LocalDate.of(2021, 1, 1);
        LocalDate to = LocalDate.of(2021, 1, 2);
        DateSpan dateSpan = new DateSpan(from, to, null);
        dateSpan.setId(1L);
        given(dateSpanRepositoryMock.findById(1L)).willReturn(Optional.of(dateSpan));
        //when
        ResponseEntity<DateSpanResponseDto> result = underTest.getDateSpan(null, 1L, 1L);
        //then
        assertThat(result).isNotNull();
        assertThat(result.getBody().dateSpan().getFrom()).isEqualTo(from);
        assertThat(result.getBody().dateSpan().getTo()).isEqualTo(to);
        assertThat(result.getBody().dateSpan().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should find all date spans by account id")
    void should_find_all_date_spans() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        LocalDate from = LocalDate.of(2021, 1, 1);
        LocalDate to = LocalDate.of(2021, 1, 2);
        DateSpan dateSpan = new DateSpan(from, to, null);
        dateSpan.setId(1L);
        given(dateSpanRepositoryMock.findAllByAccountId(account.getId())).willReturn(List.of(dateSpan));
        //when
        List<DateSpan> results = underTest.getAllDateSpans(null, 1L);
        //then
        assertThat(results).isNotNull();
    }

    @Test
    @DisplayName("Should delete an existing date span by id")
    void should_delete_date_span_by_id() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setId(1L);
        account.setCustomer(customer);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        given(accountRepositoryMock.findById(account.getId())).willReturn(Optional.of(account));
        LocalDate from = LocalDate.of(2021, 1, 1);
        LocalDate to = LocalDate.of(2021, 1, 2);
        DateSpan dateSpan = new DateSpan(from, to, null);
        dateSpan.setId(1L);
        given(dateSpanRepositoryMock.findById(dateSpan.getId())).willReturn(Optional.of(dateSpan));
        account.addDateSpan(dateSpan);
        //when
        underTest.deleteDateSpan(null, 1L, 1L);
        //then
        assertThat(account.getDateSpans()).isNotNull()
                                          .isEmpty();
    }

    @Test
    @DisplayName("Should create a new date span")
    void should_create_dateSpam() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setId(1L);
        account.setCustomer(customer);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        given(accountRepositoryMock.findById(account.getId())).willReturn(Optional.of(account));
        LocalDate from = LocalDate.of(2021, 1, 1);
        LocalDate to = LocalDate.of(2021, 1, 2);
        DateSpan dateSpan = new DateSpan(from, to, null);
        dateSpan.setId(1L);
        //when
        underTest.createDateSpan(null, dateSpan, 1L);
        //then
        assertThat(account.getDateSpans()).isNotNull()
                                          .isNotEmpty()
                                          .contains(dateSpan);
    }

    @Test
    @DisplayName("Should throw exception when account is not of logged in customer")
    void should_throw_exception_when_account_does_not_belong_to_logged_in_customer() {
        //given
        Account account = new Account();
        account.setId(1L);
        Customer customer = new Customer();
        customer.setId(1L);
        account.setCustomer(customer);
        customer.setAccounts(List.of(account));
        given(loggedInCustomerServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        LocalDate from = LocalDate.of(2021, 1, 1);
        LocalDate to = LocalDate.of(2021, 1, 2);
        DateSpan dateSpan = new DateSpan(from, to, null);
        dateSpan.setId(1L);
        //when
        //then
        assertThatThrownBy(() -> underTest.createDateSpan(null, dateSpan, 2L))
                .isInstanceOf(AccountAccessException.class)
                .hasMessageContaining("Account with id 2 not found for customer with id 1");
    }

    @Test
    @DisplayName("Should throw exception when 'from' date is greater than 'to' date")
    void should_throw_exception_when_from_date_is_gt_to_date() {
        //given
        LocalDate from = LocalDate.of(2021, 1, 2);
        LocalDate to = LocalDate.of(2021, 1, 1);
        DateSpan dateSpan = new DateSpan(from, to, null);
        dateSpan.setId(1L);
        //when
        //then
        assertThatThrownBy(() -> underTest.createDateSpan(null, dateSpan, 1L))
                .isInstanceOf(InvalidDateSpanException.class)
                .hasMessageContaining("From date must be before to date");

    }

}
