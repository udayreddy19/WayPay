package com.waypay.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpiPaymentResponse {
    private String paymentIntentId;
    private String clientSecret;
    private String status;
    private String qrCodeUrl;
    private String qrCodePng;
    private String hostedInstructionsUrl;
}
