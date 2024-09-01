package com.pekka.moni.statistics;

import com.pekka.moni.statistics.dto.StatisticsAllAccountsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    // TODO add cache
    @GetMapping("/{accountId}")
    public ResponseEntity<StatisticsAllAccountsResponse>  getAllAccountsAndAssociatedTransactions(@CurrentSecurityContext(expression = "authentication")Authentication authentication,
                                                                                                  @PathVariable Long accountId) {
            return statisticsService.getAccountsStatistics(authentication, accountId);
    }


}
