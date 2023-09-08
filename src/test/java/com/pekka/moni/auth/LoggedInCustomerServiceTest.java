package com.pekka.moni.auth;

import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import com.pekka.moni.exception.customer.CustomerNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class LoggedInCustomerServiceTest {

    @InjectMocks
    private LoggedInCustomerService underTest;
    @Mock
    private CustomerRepository customerRepository;

    @Test
    @DisplayName("Should get Logged In Customer")
    void should_get_Logged_In_Customer() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        Authentication authentication = Mockito.mock(Authentication.class);
        given(authentication.getName()).willReturn("p@p.com");
        given(customerRepository.findCustomerByEmail(authentication.getName())).willReturn(Optional.of(customer));
        //when
        Customer loggedInCustomer = underTest.getLoggedInCustomer(authentication);
        //then
        assertThat(loggedInCustomer).isEqualTo(customer);
    }

    @Test
    @DisplayName("Should throw exception when customer not found")
    void should_throw_exception_when_customer_not_found() {
        //given
        Authentication authentication = Mockito.mock(Authentication.class);
        //when
        //then
        assertThatThrownBy(() -> underTest.getLoggedInCustomer(authentication))
                .isInstanceOf(CustomerNotFoundException.class)
                .hasMessageContaining("Customer not found");
    }

}