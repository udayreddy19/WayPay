package com.waypay.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.waypay.model.dto.response.RazorpayOrderResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayService {

    private final TransactionService transactionService;
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    @PostConstruct
    public void init() {
        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay Client: {}", e.getMessage(), e);
        }
    }

    public RazorpayOrderResponse createOrder(UUID userId, BigDecimal amount) {
        try {
            // Convert to paise
            int amountInPaise = amount.multiply(BigDecimal.valueOf(100)).intValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 20));

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

            // Create pending transaction in db
            transactionService.createAddMoneyTransactionWithRazorpay(userId, amount, orderId);

            log.info("Created Razorpay order {} for user {} of ₹{}", orderId, userId, amount);

            return RazorpayOrderResponse.builder()
                    .orderId(orderId)
                    .amount(amount)
                    .currency("INR")
                    .keyId(keyId)
                    .build();

        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initiate Razorpay order: " + e.getMessage(), e);
        }
    }

    public void verifyWebhook(String payload, String signature) {
        try {
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            if (!isValid) {
                log.error("Razorpay signature validation failed");
                throw new IllegalArgumentException("Invalid signature");
            }
        } catch (RazorpayException e) {
            log.error("Razorpay signature check exception: {}", e.getMessage());
            throw new IllegalArgumentException("Failed to verify webhook signature", e);
        }
    }
}
