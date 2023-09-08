package com.pekka.moni.datespan;

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

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class DateSpanControllerTest {

    @InjectMocks
    private DateSpanController underTest;

    @Mock
    private DateSpanService dateSpanServiceMock;

    @BeforeEach
    void setUp() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    @DisplayName("Should get DateSpan by account id and date span id")
    void should_get_DateSpan_by_account_id_and_date_span_id() {
        //given
        DateSpan dateSpan = new DateSpan();
        dateSpan.setFrom(LocalDate.of(2020, 1, 1));
        dateSpan.setTo(LocalDate.of(2020, 1, 31));
        given(dateSpanServiceMock.getDateSpan(any(), any(Long.class), any(Long.class))).willReturn(dateSpan);
        //when
        ResponseEntity<DateSpan> response = underTest.getDateSpan(any(), any(Long.class), any(Long.class));
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(dateSpan);
    }

    @Test
    @DisplayName("Should get All DateSpans by account id")
    void should_get_All_DateSpans_by_account_id() {
        //given
        DateSpan dateSpan1 = new DateSpan();
        dateSpan1.setFrom(LocalDate.of(2020, 1, 1));
        dateSpan1.setTo(LocalDate.of(2020, 1, 31));
        DateSpan dateSpan2 = new DateSpan();
        dateSpan2.setFrom(LocalDate.of(2020, 2, 1));
        dateSpan2.setTo(LocalDate.of(2020, 2, 29));
        given(dateSpanServiceMock.getAllDateSpans(any(), any(Long.class))).willReturn(List.of(dateSpan1, dateSpan2));
        //when
        ResponseEntity<List<DateSpan>> response = underTest.getAllDateSpans(any(), any(Long.class));
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).containsAll(List.of(dateSpan1, dateSpan2));
    }

    @Test
    @DisplayName("Should create DateSpan for account by account id")
    void should_create_DateSpan_For_Account_by_account_id() {
        //given
        DateSpan dateSpan = new DateSpan();
        dateSpan.setFrom(LocalDate.of(2020, 1, 1));
        dateSpan.setTo(LocalDate.of(2020, 1, 31));
        //when
        ResponseEntity<String> response = underTest.createDateSpanForAccount(null, dateSpan, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo("DateSpan created");
    }

    @Test
    @DisplayName("Should delete DateSpan by account id and DateSpan id")
    void should_delete_DateSpan_by_account_id_and_DateSpan_id() {
        //given
        DateSpan dateSpan = new DateSpan();
        dateSpan.setFrom(LocalDate.of(2020, 1, 1));
        dateSpan.setTo(LocalDate.of(2020, 1, 31));
        //when
        ResponseEntity<String> response = underTest.deleteDateSpan(null, 1L, 1L);
        //then
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("DateSpan deleted");
    }
}