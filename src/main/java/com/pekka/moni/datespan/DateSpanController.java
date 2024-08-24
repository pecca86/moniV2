package com.pekka.moni.datespan;

import com.pekka.moni.datespan.dto.DateSpanResponseDto;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/datespans")
public class DateSpanController {

    private final DateSpanService dateSpanService;

    public DateSpanController(DateSpanService transactionService) {
        this.dateSpanService = transactionService;
    }

    @GetMapping("/{accountId}/{dateSpanId}")
    public ResponseEntity<DateSpanResponseDto> getDateSpan(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                                           @PathVariable Long accountId,
                                                           @PathVariable Long dateSpanId) {
        return dateSpanService.getDateSpan(authentication, accountId, dateSpanId);
    }

    @GetMapping("/{accountId}")
    @Cacheable(value = "dateSpans", key = "#accountId")
    public ResponseEntity<List<DateSpan>> getAllDateSpans(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                          @PathVariable Long accountId) {
        return ResponseEntity.ok(dateSpanService.getAllDateSpans(authentication, accountId));
    }

    @PostMapping("/{accountId}")
    @CacheEvict(value = "dateSpans", key = "#accountId")
    public ResponseEntity<DateSpanResponseDto> createDateSpanForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                         @RequestBody @Valid DateSpan dateSpan,
                                         @PathVariable Long accountId) {
        return dateSpanService.createDateSpan(authentication, dateSpan, accountId);
    }

    @DeleteMapping("/{accountId}/{dateSpanId}")
    @CacheEvict(value = "dateSpans", key = "#accountId")
    public ResponseEntity<DateSpanResponseDto> deleteDateSpan(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                               @PathVariable Long accountId,
                               @PathVariable Long dateSpanId) {
        return dateSpanService.deleteDateSpan(authentication, accountId, dateSpanId);
    }
}
