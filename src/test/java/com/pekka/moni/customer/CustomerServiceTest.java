package com.pekka.moni.customer;

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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepositoryMock;

    private CustomerService underTest;
    private List<Customer> testCustomers;

    @BeforeEach
    void setUp() {
        underTest = new CustomerService(customerRepositoryMock);
        testCustomers = createTestData();
    }

    private List<Customer> createTestData() {
        return List.of(
                new Customer("Pekka1@p.com", "Akka", "Pen", "123AVC", Role.ROLE_ADMIN),
                new Customer("Pekka2@p.com", "E", "Hen", "123AVC", Role.ROLE_USER),
                new Customer("Pekka3@p.com", "P", "Sen", "123AVC", Role.ROLE_USER)
        );
    }

    @ParameterizedTest
    @CsvSource({
            "ASC",
            "DESC"
    })
    @DisplayName("Should get all customers sorted by firstName in ascending or descending order")
    void should_get_all_customer_ordered_by_first_name_asc_or_desc(String direction) {
        //given
        int page = 0;
        int pageSize = 10;
        String sortBy = "firstName";

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Customer> customerPage = new PageImpl<>(testCustomers, pageRequest, testCustomers.size());
        if ("DESC".equals(direction)) {
            given(customerRepositoryMock.findAll(pageRequest.withSort(Sort.by(sortBy).descending()))).willReturn(customerPage);
        } else {
            given(customerRepositoryMock.findAll(pageRequest.withSort(Sort.by(sortBy).ascending()))).willReturn(customerPage);
        }
        //when
        Page<Customer> customers = underTest.getCustomers("firstName", direction, page, pageSize);
        //then
        assertThat(customers).isNotNull();
        assertThat(customers.getTotalElements()).isEqualTo(3);
        assertThat(customers.getContent()).extracting(Customer::getFirstName)
                                          .containsExactly("Akka", "E", "P");
    }

    @Test
    @DisplayName("Should get a customer by id")
    void should_get_customer_by_id() {
        //given
        given(customerRepositoryMock.findById(1L)).willReturn(Optional.ofNullable(testCustomers.get(0)));
        //when
        Customer customer = underTest.getCustomer(1L);
        //then
        assertThat(customer).isNotNull();
        assertThat(customer.getFirstName()).isEqualTo("Akka");
    }

    @Test
    @DisplayName("Should update a customer by id")
    void should_update_customer_by_id() {
        //given
        Customer customer = createTestData().get(0);
        Customer updatedCustomer = createTestData().get(1);
        given(customerRepositoryMock.findById(1L)).willReturn(Optional.of(customer));
        // when
        underTest.updateCustomer(updatedCustomer, 1L);
        //then
        assertThat(customer.getFirstName()).isEqualTo(updatedCustomer.getFirstName());
        assertThat(customer.getLastName()).isEqualTo(updatedCustomer.getLastName());
        assertThat(customer.getEmail()).isEqualTo(updatedCustomer.getEmail());
        assertThat(customer.getPassword()).isEqualTo(updatedCustomer.getPassword());
    }

    @Test
    @DisplayName("Should throw error when invalid email is given")
    void should_throw_error_when_invalid_email_is_given() {
        //given
        Customer customer = createTestData().get(0);
        customer.setEmail("invalidEmail");
        customer.setId(1L);
        given(customerRepositoryMock.save(customer)).willThrow(IllegalArgumentException.class);
        given(customerRepositoryMock.findById(customer.getId())).willReturn(Optional.of(customer));
        // when
        //then
        assertThatThrownBy(() -> underTest.updateCustomer(customer, customer.getId()))
                .isInstanceOf(IllegalArgumentException.class);
    }
}