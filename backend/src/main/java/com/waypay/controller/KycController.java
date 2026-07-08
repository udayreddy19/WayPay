package com.waypay.controller;

import com.waypay.model.dto.request.KycRequest;
import com.waypay.model.dto.response.ApiResponse;
import com.waypay.model.entity.KycRecord;
import com.waypay.model.entity.User;
import com.waypay.model.enums.KycStatus;
import com.waypay.repository.KycRepository;
import com.waypay.service.AnalyticsService;
import com.waypay.service.UserService;
import com.waypay.util.EncryptionUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kyc")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Slf4j
@Tag(name = "KYC", description = "Know Your Customer verification")
public class KycController {

    private final KycRepository kycRepository;
    private final UserService userService;
    private final AnalyticsService analyticsService;

    @PostMapping
    @Operation(summary = "Submit KYC documents")
    public ResponseEntity<ApiResponse<String>> submitKyc(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody KycRequest request) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());

        if (kycRepository.existsByUserId(user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("KYC already submitted"));
        }

        KycRecord kyc = KycRecord.builder()
                .user(user)
                .aadhaarHash(EncryptionUtil.sha256(request.getAadhaar()))
                .panHash(EncryptionUtil.sha256(request.getPan()))
                .aadhaarLastFour(request.getAadhaar().substring(request.getAadhaar().length() - 4))
                .panLastFour(request.getPan().substring(request.getPan().length() - 4))
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .verificationStatus(KycStatus.SUBMITTED)
                .build();

        kycRepository.save(kyc);
        analyticsService.trackKycStarted(user.getId().toString());

        log.info("KYC submitted for user: {}", user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("KYC submitted successfully. Verification in progress.", null));
    }

    @GetMapping("/status")
    @Operation(summary = "Get KYC verification status")
    public ResponseEntity<ApiResponse<String>> getKycStatus(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        return kycRepository.findByUserId(user.getId())
                .map(kyc -> ResponseEntity.ok(
                        ApiResponse.success(kyc.getVerificationStatus().name())))
                .orElseGet(() -> ResponseEntity.ok(
                        ApiResponse.success("NOT_SUBMITTED")));
    }
}
