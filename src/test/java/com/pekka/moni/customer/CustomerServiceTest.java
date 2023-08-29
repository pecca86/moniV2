package com.pekka.moni.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@DataJpaTest
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
                new Customer(1L, "Pekka1@p.com", "Akka", "Pen", "123AVC"),
                new Customer(2L, "Pekka2@p.com", "E", "Hen", "123AVC"),
                new Customer(3L, "Pekka3@p.com", "P", "Sen", "123AVC")
        );
    }

    @Test
    void getCustomer() {
        //given
        given(customerRepositoryMock.findAll()).willReturn(testCustomers);
        //when - then
        assertThat(underTest).isNotNull();
        assertThat(underTest.getCustomers()).hasSize(3);
        assertThat(underTest.getCustomers()).extracting(Customer::getFirstName)
                                            .containsExactly("Akka", "E", "P");
    }

    @Test
    void getCustomers() {
        //given
        given(customerRepositoryMock.findById(1L)).willReturn(Optional.ofNullable(testCustomers.get(0)));
        //when
        Customer customer = underTest.getCustomer(1L);
        //then
        assertThat(customer).isNotNull();
        assertThat(customer.getFirstName()).isEqualTo("Akka");
        assertThat(customer.getId()).isEqualTo(1L);
    }

    //TODO: Test unhappy path for email, firstName, lastName, password
    //TODO: Test for duplicate id
}