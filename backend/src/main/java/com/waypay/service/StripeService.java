package com.waypay.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.waypay.exception.PaymentFailedException;
import com.waypay.model.dto.response.CheckoutSessionResponse;
import com.waypay.model.dto.response.UpiPaymentResponse;
import com.waypay.model.entity.Transaction;
import com.waypay.model.entity.Wallet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {

    private final TransactionService transactionService;
    private final WalletService walletService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    @Value("${stripe.currency}")
    private String currency;

    public CheckoutSessionResponse createCheckoutSession(UUID userId, BigDecimal amount) {
        try {
            Wallet wallet = walletService.getWalletEntityByUserId(userId);

            // Stripe amounts are in smallest currency unit (paise for INR)
            long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "&session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl)
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.UPI)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency(currency)
                                    .setUnitAmount(amountInPaise)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Add Money to WayPay Wallet")
                                            .setDescription("Adding ₹" + amount + " to your WayPay wallet")
                                            .build())
                                    .build())
                            .build())
                    .putMetadata("user_id", userId.toString())
                    .putMetadata("wallet_id", wallet.getId().toString())
                    .putMetadata("amount", amount.toString())
                    .build();

            Session session = Session.create(params);

            // Create pending transaction
            transactionService.createAddMoneyTransaction(userId, amount, session.getId());

            log.info("Created Stripe checkout session: {} for user: {} amount: ₹{}",
                    session.getId(), userId, amount);

            return CheckoutSessionResponse.builder()
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            log.error("Stripe checkout session creation failed: {}", e.getMessage(), e);
            throw new PaymentFailedException("Failed to create payment session: " + e.getMessage(), e);
        }
    }

    public UpiPaymentResponse createUpiPaymentIntent(UUID userId, BigDecimal amount, String vpa) {
        try {
            Wallet wallet = walletService.getWalletEntityByUserId(userId);
            long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInPaise)
                    .setCurrency(currency)
                    .addPaymentMethodType("upi")
                    .setPaymentMethodData(
                            PaymentIntentCreateParams.PaymentMethodData.builder()
                                    .setType(PaymentIntentCreateParams.PaymentMethodData.Type.UPI)
                                    .setUpi(
                                            PaymentIntentCreateParams.PaymentMethodData.Upi.builder()
                                                    .setVpa(vpa)
                                                    .build()
                                    )
                                    .build()
                    )
                    .setConfirm(true)
                    .setReturnUrl(successUrl)
                    .putMetadata("user_id", userId.toString())
                    .putMetadata("wallet_id", wallet.getId().toString())
                    .putMetadata("amount", amount.toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Create pending transaction mapped to the payment intent ID
            transactionService.createAddMoneyTransactionWithPaymentIntent(userId, amount, intent.getId());

            log.info("Created direct UPI PaymentIntent: {} for user: {} amount: ₹{} VPA: {}",
                    intent.getId(), userId, amount, vpa);

            String qrCodeUrl = null;
            String qrCodePng = null;
            String hostedInstructionsUrl = null;

            if (intent.getNextAction() != null) {
                PaymentIntent.NextAction nextAction = intent.getNextAction();
                if (nextAction.getUpiDisplayQrCode() != null) {
                    qrCodeUrl = nextAction.getUpiDisplayQrCode().getQrCodeUrl();
                    qrCodePng = nextAction.getUpiDisplayQrCode().getImageUrlPng();
                    hostedInstructionsUrl = nextAction.getUpiDisplayQrCode().getHostedInstructionsUrl();
                }
            }

            return UpiPaymentResponse.builder()
                    .paymentIntentId(intent.getId())
                    .clientSecret(intent.getClientSecret())
                    .status(intent.getStatus())
                    .qrCodeUrl(qrCodeUrl)
                    .qrCodePng(qrCodePng)
                    .hostedInstructionsUrl(hostedInstructionsUrl)
                    .build();

        } catch (StripeException e) {
            log.error("Stripe UPI PaymentIntent creation failed: {}", e.getMessage(), e);
            throw new PaymentFailedException("Failed to initiate UPI payment: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void handleWebhookEvent(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Stripe webhook signature verification failed", e);
            throw new PaymentFailedException("Invalid webhook signature");
        }

        log.info("Processing Stripe webhook event: {} ({})", event.getType(), event.getId());

        switch (event.getType()) {
            case "checkout.session.completed" -> handleCheckoutCompleted(event);
            case "payment_intent.succeeded" -> handlePaymentIntentSucceeded(event);
            case "payment_intent.payment_failed" -> handlePaymentFailed(event);
            case "charge.refunded" -> handleRefund(event);
            default -> log.info("Unhandled Stripe event type: {}", event.getType());
        }
    }

    private void handleCheckoutCompleted(Event event) {
        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new PaymentFailedException("Failed to deserialize checkout session"));

        log.info("Checkout completed: session={}, payment_status={}",
                session.getId(), session.getPaymentStatus());

        if ("paid".equals(session.getPaymentStatus())) {
            transactionService.completeAddMoneyTransaction(session.getId());
        }
    }

    private void handlePaymentIntentSucceeded(Event event) {
        PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new PaymentFailedException("Failed to deserialize payment intent"));

        log.info("Payment intent succeeded: id={}, status={}", intent.getId(), intent.getStatus());
        transactionService.completeAddMoneyTransaction(intent.getId());
    }

    private void handlePaymentFailed(Event event) {
        log.warn("Payment failed event received: {}", event.getId());
        // Update transaction status to FAILED
    }

    private void handleRefund(Event event) {
        log.info("Refund event received: {}", event.getId());
        // Process refund — debit wallet, create ledger entry
    }
}
