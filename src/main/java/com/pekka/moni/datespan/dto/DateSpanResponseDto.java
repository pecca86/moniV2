package com.pekka.moni.datespan.dto;

import com.pekka.moni.datespan.DateSpan;

public record DateSpanResponseDto (String message, int status, DateSpan dateSpan) {
}
