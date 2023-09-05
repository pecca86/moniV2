package com.pekka.moni.datespan;

import jakarta.validation.Valid;
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
    public DateSpan getDateSpan(@PathVariable Long accountId, @PathVariable Long dateSpanId) {
        return dateSpanService.getDateSpan(accountId, dateSpanId);
    }

    @GetMapping("/{accountId}")
    public List<DateSpan> getAllDateSpans(@PathVariable Long accountId) {
        return dateSpanService.getAllDateSpans(accountId);
    }

    @PostMapping("/{accountId}")
    public void createDateSpanForAccount(@RequestBody @Valid DateSpan dateSpan,
                                         @PathVariable Long accountId) {
        dateSpanService.createDateSpan(dateSpan, accountId);
    }

    @DeleteMapping("/{accountId}/{dateSpanId}")
    public void deleteDateSpan(@PathVariable Long accountId,
                               @PathVariable Long dateSpanId) {
        dateSpanService.deleteDateSpan(accountId, dateSpanId);
    }
}
