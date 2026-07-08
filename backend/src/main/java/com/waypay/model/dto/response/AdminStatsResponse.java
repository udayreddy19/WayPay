package com.waypay.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private BigDecimal totalBalance;
    private long totalTransactions;
    private long pendingKycCount;
}
