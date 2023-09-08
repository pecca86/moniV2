package com.pekka.moni.customer;

import com.pekka.moni.auth.LoggedInCustomerService;
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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

    @InjectMocks
    private CustomerController underTest;

    @Mock
    private CustomerService customerServiceMock;

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    @DisplayName("Should get all Customers")
    void should_get_all_Customers() {
        //given
        Customer customer1 = new Customer();
        customer1.setId(1L);
        customer1.setFirstName("A");
        Customer customer2 = new Customer();
        customer2.setId(2L);
        customer2.setFirstName("B");
        Customer customer3 = new Customer();
        customer3.setId(3L);
        customer3.setFirstName("C");

        given(customerServiceMock.getCustomers(any(String.class), any(String.class), any(Integer.class), any(Integer.class)))
                .willReturn(new PageImpl<>(List.of(customer1, customer2, customer3)));
        //when
        ResponseEntity<Page<Customer>> response = underTest.getCustomers("firstName", "ASC", 0, 10);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsAll(List.of(customer1, customer2, customer3));
    }

    @Test
    @DisplayName("Should get Customer by id")
    void should_get_Customer_by_id() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);

        given(customerServiceMock.getCustomer(any(Long.class))).willReturn(customer);
        //when
        ResponseEntity<Customer> response = underTest.getCustomer(1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(customer);
    }

    @Test
    @DisplayName("Should delete Customer by id")
    void should_delete_Customer_by_id() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        //when
        ResponseEntity<String> response = underTest.deleteCustomer(1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Customer deleted");
    }

    @Test
    @DisplayName("Should update Customer by id")
    void should_update_Customer_by_id() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setFirstName("A");
        //when
        ResponseEntity<String> response = underTest.updateCustomer(customer, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo("Customer updated");
    }
}