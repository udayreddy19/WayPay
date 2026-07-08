package com.waypay.controller;

import com.waypay.service.StripeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhook")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Webhooks", description = "External service webhooks")
public class WebhookController {

    private final StripeService stripeService;
    private final com.waypay.service.RazorpayService razorpayService;
    private final com.waypay.service.TransactionService transactionService;

    @PostMapping("/stripe")
    @Operation(summary = "Handle Stripe webhook events")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("Received Stripe webhook");
        stripeService.handleWebhookEvent(payload, sigHeader);
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/razorpay")
    @Operation(summary = "Handle Razorpay webhook events")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String sigHeader) {
        log.info("Received Razorpay webhook");
        razorpayService.verifyWebhook(payload, sigHeader);

        try {
            org.json.JSONObject json = new org.json.JSONObject(payload);
            String event = json.optString("event");

            if ("order.paid".equals(event)) {
                org.json.JSONObject paymentEntity = json.getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");
                String orderId = paymentEntity.getString("order_id");
                String paymentId = paymentEntity.getString("id");

                log.info("Razorpay webhook confirmed paid order: {} with payment: {}", orderId, paymentId);
                transactionService.completeRazorpayTransaction(orderId, paymentId);
            }
        } catch (Exception e) {
            log.error("Failed to parse Razorpay webhook body: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Parsing failed");
        }

        return ResponseEntity.ok("OK");
    }
}
