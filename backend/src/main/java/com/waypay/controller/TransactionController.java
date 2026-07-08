package com.waypay.controller;

import com.waypay.model.dto.response.ApiResponse;
import com.waypay.model.dto.response.TransactionResponse;
import com.waypay.model.entity.User;
import com.waypay.service.TransactionService;
import com.waypay.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Transactions", description = "Transaction history")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get transaction history for current user")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        Page<TransactionResponse> transactions = transactionService.getTransactionsByUserId(
                user.getId(),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
}
