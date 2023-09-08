package com.pekka.moni.auth;

import com.pekka.moni.auth.dto.AuthenticationRequest;
import com.pekka.moni.auth.dto.AuthenticationResponse;
import com.pekka.moni.auth.dto.NewPasswordRequest;
import com.pekka.moni.auth.dto.RegisterRequest;
import com.pekka.moni.config.JwtService;
import com.pekka.moni.customer.Customer;
import com.pekka.moni.customer.CustomerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @InjectMocks
    private AuthenticationService underTest;

    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private LoggedInCustomerService loggedInCustomerService;

    @Test
    @DisplayName("Should register a new customer")
    void should_register_a_new_customer() {
        //given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("p@p.com");
        registerRequest.setPassword("password");
        registerRequest.setFirstName("Pekka");
        registerRequest.setLastName("Pekkonen");
        given(jwtService.generateJwtToken(any(Customer.class))).willReturn("token");
        //when
        AuthenticationResponse response = underTest.register(registerRequest);
        //then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("token");
    }

    @Test
    @DisplayName("Should perform login for existing user")
    void should_perform_login_for_existing_user() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setEmail("p@p.com");
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("p@p.com");
        given(customerRepository.findCustomerByEmail(request.getEmail())).willReturn(Optional.of(customer));
        given(jwtService.generateJwtToken(customer)).willReturn("token");
        //when
        AuthenticationResponse response = underTest.login(request);
        //then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("token");
    }

    @Test
    @DisplayName("Should get Logged In Customer")
    void should_get_Logged_In_Customer() {
        //given
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setEmail("p@p.com");
        Authentication authentication = Mockito.mock(Authentication.class);
        given(authentication.getName()).willReturn("p@p.com");
        given(customerRepository.findCustomerByEmail(authentication.getName())).willReturn(Optional.of(customer));
        //when
        Customer loggedInCustomer = underTest.getLoggedInCustomer(authentication);
        //then
        assertThat(loggedInCustomer).isNotNull();
        assertThat(loggedInCustomer.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should update Password for logged in customer")
    void should_update_Password_for_logged_in_customer() {
        //given
        Authentication authentication = Mockito.mock(Authentication.class);
        NewPasswordRequest newPasswordRequest = new NewPasswordRequest("password");
        Customer customer = new Customer();
        customer.setEmail("p@p.com");
        customer.setPassword(newPasswordRequest.password());
        given(loggedInCustomerService.getLoggedInCustomer(authentication)).willReturn(customer);
        given(customerRepository.save(customer)).willReturn(customer);
        given(passwordEncoder.encode(newPasswordRequest.password())).willReturn("password");
        //when
        underTest.updatePassword(newPasswordRequest, authentication);
        //then
        assertThat(customer.getPassword()).isEqualTo("password");
    }
}