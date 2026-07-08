package com.waypay.model.dto.response;

import com.waypay.model.enums.TransactionStatus;
import com.waypay.model.enums.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionResponse {
    private UUID id;
    private UUID fromWalletId;
    private UUID toWalletId;
    private BigDecimal amount;
    private String currency;
    private TransactionType type;
    private TransactionStatus status;
    private String paymentMethod;
    private String description;
    private OffsetDateTime createdAt;
}
