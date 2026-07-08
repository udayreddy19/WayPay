package com.waypay.controller;

import com.waypay.model.dto.request.AddMoneyRequest;
import com.waypay.model.dto.request.TransferRequest;
import com.waypay.model.dto.request.UpiAddMoneyRequest;
import com.waypay.model.dto.response.ApiResponse;
import com.waypay.model.dto.response.CheckoutSessionResponse;
import com.waypay.model.dto.response.UpiPaymentResponse;
import com.waypay.model.dto.response.WalletResponse;
import com.waypay.model.entity.User;
import com.waypay.service.StripeService;
import com.waypay.service.TransactionService;
import com.waypay.service.UserService;
import com.waypay.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Wallet", description = "Wallet operations")
public class WalletController {

    private final WalletService walletService;
    private final StripeService stripeService;
    private final TransactionService transactionService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get current user's wallet")
    public ResponseEntity<ApiResponse<WalletResponse>> getWallet(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        WalletResponse wallet = walletService.getWalletByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }

    @PostMapping("/add-money")
    @Operation(summary = "Add money to wallet via Stripe")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> addMoney(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddMoneyRequest request) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        CheckoutSessionResponse session = stripeService.createCheckoutSession(user.getId(), request.getAmount());
        return ResponseEntity.ok(ApiResponse.success("Checkout session created", session));
    }

    @PostMapping("/add-money/upi")
    @Operation(summary = "Add money to wallet directly via UPI VPA")
    public ResponseEntity<ApiResponse<UpiPaymentResponse>> addMoneyUpi(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpiAddMoneyRequest request) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        UpiPaymentResponse response = stripeService.createUpiPaymentIntent(user.getId(), request.getAmount(), request.getVpa());
        return ResponseEntity.ok(ApiResponse.success("UPI Payment initiated", response));
    }

    @PostMapping("/transfer")
    @Operation(summary = "Transfer money to another user")
    public ResponseEntity<ApiResponse<String>> transfer(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody TransferRequest request) {
        User sender = userService.getUserEntityByClerkId(jwt.getSubject());

        // Find recipient by email or phone
        User recipient;
        if (request.getRecipientEmailOrPhone().contains("@")) {
            recipient = userService.getUserEntityByClerkId(
                    userService.getUserByClerkId(request.getRecipientEmailOrPhone()).getId().toString());
        } else {
            // Look up by email for now
            throw new IllegalArgumentException("Phone-based lookup not yet implemented. Use email.");
        }

        transactionService.createTransfer(sender.getId(), recipient.getId(),
                request.getAmount(), request.getDescription());

        return ResponseEntity.ok(ApiResponse.success("Transfer completed successfully", null));
    }
}
