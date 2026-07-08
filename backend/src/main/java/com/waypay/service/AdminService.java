package com.waypay.service;

import com.waypay.model.dto.response.AdminStatsResponse;
import com.waypay.model.dto.response.TransactionResponse;
import com.waypay.model.dto.response.UserResponse;
import com.waypay.model.entity.KycRecord;
import com.waypay.model.entity.Transaction;
import com.waypay.model.entity.User;
import com.waypay.model.enums.KycStatus;
import com.waypay.model.enums.TransactionStatus;
import com.waypay.model.enums.UserStatus;
import com.waypay.repository.KycRepository;
import com.waypay.repository.TransactionRepository;
import com.waypay.repository.UserRepository;
import com.waypay.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final KycRepository kycRepository;
    private final UserService userService;

    public AdminStatsResponse getPlatformStats() {
        long totalUsers = userRepository.count();
        BigDecimal totalBalance = walletRepository.sumTotalBalance();
        long totalTransactions = transactionRepository.count();
        long pendingKyc = kycRepository.countByVerificationStatus(KycStatus.SUBMITTED);

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalBalance(totalBalance != null ? totalBalance : BigDecimal.ZERO)
                .totalTransactions(totalTransactions)
                .pendingKycCount(pendingKyc)
                .build();
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        // Map user page to user response page
        return userRepository.findAll(pageable)
                .map(this::toUserResponse);
    }

    @Transactional
    public UserResponse updateUserStatus(UUID userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(status);
        user = userRepository.save(user);
        log.info("Admin updated user {} status to {}", userId, status);
        return toUserResponse(user);
    }

    public Page<KycRecord> getKycRecords(KycStatus status, Pageable pageable) {
        return kycRepository.findByVerificationStatus(status, pageable);
    }

    @Transactional
    public KycRecord verifyKyc(UUID kycId, KycStatus verifyStatus) {
        KycRecord kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new IllegalArgumentException("KYC record not found"));

        if (verifyStatus != KycStatus.APPROVED && verifyStatus != KycStatus.REJECTED) {
            throw new IllegalArgumentException("Verification status must be APPROVED or REJECTED");
        }

        kyc.setVerificationStatus(verifyStatus);
        kyc = kycRepository.save(kyc);

        // Update the user's KYC status accordingly
        User user = kyc.getUser();
        user.setKycStatus(verifyStatus);
        userRepository.save(user);

        log.info("Admin verified KYC {} as {}", kycId, verifyStatus);
        return kyc;
    }

    public Page<TransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable)
                .map(this::toTransactionResponse);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .kycStatus(user.getKycStatus())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private TransactionResponse toTransactionResponse(Transaction txn) {
        return TransactionResponse.builder()
                .id(txn.getId())
                .fromWalletId(txn.getFromWallet() != null ? txn.getFromWallet().getId() : null)
                .toWalletId(txn.getToWallet() != null ? txn.getToWallet().getId() : null)
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .type(txn.getType().name())
                .status(txn.getStatus().name())
                .description(txn.getDescription())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}
