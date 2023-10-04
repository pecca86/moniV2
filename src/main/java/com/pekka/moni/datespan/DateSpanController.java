package com.pekka.moni.datespan;

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
    public ResponseEntity<DateSpan> getDateSpan(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                               @PathVariable Long accountId,
                                               @PathVariable Long dateSpanId) {
        return ResponseEntity.ok(dateSpanService.getDateSpan(authentication, accountId, dateSpanId));
    }

    @GetMapping("/{accountId}")
    @Cacheable(value = "dateSpans", key = "#accountId")
    public ResponseEntity<List<DateSpan>> getAllDateSpans(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                          @PathVariable Long accountId) {
        return ResponseEntity.ok(dateSpanService.getAllDateSpans(authentication, accountId));
    }

    @PostMapping("/{accountId}")
    @CacheEvict(value = "dateSpans", key = "#accountId")
    public ResponseEntity<String> createDateSpanForAccount(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                                         @RequestBody @Valid DateSpan dateSpan,
                                         @PathVariable Long accountId) {
        dateSpanService.createDateSpan(authentication, dateSpan, accountId);
        return ResponseEntity.status(201).body("DateSpan created");
    }

    @DeleteMapping("/{accountId}/{dateSpanId}")
    @CacheEvict(value = "dateSpans", key = "#accountId")
    public ResponseEntity<String> deleteDateSpan(@CurrentSecurityContext(expression = "authentication") Authentication authentication,
                               @PathVariable Long accountId,
                               @PathVariable Long dateSpanId) {
        dateSpanService.deleteDateSpan(authentication, accountId, dateSpanId);
        return ResponseEntity.ok("DateSpan deleted");
    }
}
