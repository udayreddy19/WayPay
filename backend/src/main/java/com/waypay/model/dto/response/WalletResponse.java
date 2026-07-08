package com.waypay.model.dto.response;

import com.waypay.model.enums.WalletStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class WalletResponse {
    private UUID id;
    private BigDecimal balance;
    private String currency;
    private WalletStatus status;
    private OffsetDateTime createdAt;
}
