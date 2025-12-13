package com.pekka.moni.auth;

import com.pekka.moni.auth.dto.AuthenticationRequest;
import com.pekka.moni.auth.dto.AuthenticationResponse;
import com.pekka.moni.auth.dto.NewPasswordRequest;
import com.pekka.moni.auth.dto.RegisterRequest;
import com.pekka.moni.customer.Customer;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @InjectMocks
    private AuthenticationController underTest;

    @Mock
    private AuthenticationService authenticationServiceMock;

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    @DisplayName("Should register new customer")
    void should_register_new_customer() {
        //given
        RegisterRequest registerRequest = new RegisterRequest();
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setToken("token");
        given(authenticationServiceMock.register(any())).willReturn(authenticationResponse);
        //when
        ResponseEntity<AuthenticationResponse> response = underTest.register(registerRequest);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(authenticationResponse);
    }

    @Test
    @DisplayName("Should login existing customer")
    void should_login_existing_customer() {
        //given
        AuthenticationRequest request = new AuthenticationRequest("p@p.com", "password");
        HttpServletResponse httpServletResponse = new MockHttpServletResponse();
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setToken("token");
        given(authenticationServiceMock.login(any())).willReturn(authenticationResponse);
        //when
        ResponseEntity<AuthenticationResponse> response = underTest.login(request, httpServletResponse);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(authenticationResponse);

    }

    @Test
    @DisplayName("Should get logged Customer")
    void should_get_logged_Customer() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        given(authenticationServiceMock.getLoggedInCustomer(any())).willReturn(customer);
        //when
        ResponseEntity<Customer> response = underTest.getCustomer(any());
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(customer);
    }

    @Test
    @DisplayName("Should change Password of logged in customer")
    void should_change_Password_of_logged_in_customer() {
        //given
        NewPasswordRequest request = new NewPasswordRequest("password");
        //when
        ResponseEntity<String> response = underTest.changePassword(null, request);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Password updated");
    }
}