package com.waypay.controller;

import com.waypay.model.dto.response.AdminStatsResponse;
import com.waypay.model.dto.response.ApiResponse;
import com.waypay.model.dto.response.TransactionResponse;
import com.waypay.model.dto.response.UserResponse;
import com.waypay.model.entity.KycRecord;
import com.waypay.model.entity.User;
import com.waypay.model.enums.KycStatus;
import com.waypay.model.enums.UserRole;
import com.waypay.model.enums.UserStatus;
import com.waypay.service.AdminService;
import com.waypay.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Slf4j
@Tag(name = "Admin", description = "Administrative operations")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    private void verifyAdminRole(Jwt jwt) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        if (user.getRole() != UserRole.ADMIN) {
            log.warn("Access denied for user: {} (role: {}) trying to access admin endpoints", user.getId(), user.getRole());
            throw new AccessDeniedException("Admin role required");
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform metrics overview")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats(@AuthenticationPrincipal Jwt jwt) {
        verifyAdminRole(jwt);
        return ResponseEntity.ok(ApiResponse.success(adminService.getPlatformStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "List all platform users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        verifyAdminRole(jwt);
        Page<UserResponse> users = adminService.getAllUsers(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{userId}/status")
    @Operation(summary = "Suspend or activate a user account")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID userId,
            @RequestParam UserStatus status) {
        verifyAdminRole(jwt);
        UserResponse response = adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", response));
    }

    @GetMapping("/kyc")
    @Operation(summary = "List KYC submissions by status")
    public ResponseEntity<ApiResponse<Page<KycRecord>>> getKycRecords(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam KycStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        verifyAdminRole(jwt);
        Page<KycRecord> records = adminService.getKycRecords(status, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @PutMapping("/kyc/{kycId}/verify")
    @Operation(summary = "Approve or Reject a KYC document submission")
    public ResponseEntity<ApiResponse<KycRecord>> verifyKyc(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID kycId,
            @RequestParam KycStatus verifyStatus) {
        verifyAdminRole(jwt);
        KycRecord record = adminService.verifyKyc(kycId, verifyStatus);
        return ResponseEntity.ok(ApiResponse.success("KYC submission status updated", record));
    }

    @GetMapping("/transactions")
    @Operation(summary = "View global platform transactions list")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        verifyAdminRole(jwt);
        Page<TransactionResponse> txns = adminService.getAllTransactions(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(txns));
    }
}
