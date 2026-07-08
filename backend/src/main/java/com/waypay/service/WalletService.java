package com.waypay.service;

import com.waypay.exception.InsufficientBalanceException;
import com.waypay.exception.WalletNotFoundException;
import com.waypay.model.dto.response.WalletResponse;
import com.waypay.model.entity.User;
import com.waypay.model.entity.Wallet;
import com.waypay.model.enums.WalletStatus;
import com.waypay.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;

    @Transactional
    public Wallet createWallet(User user) {
        if (walletRepository.existsByUserId(user.getId())) {
            log.warn("Wallet already exists for user: {}", user.getId());
            return walletRepository.findByUserId(user.getId()).orElseThrow();
        }

        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .currency("INR")
                .status(WalletStatus.ACTIVE)
                .build();

        wallet = walletRepository.save(wallet);
        log.info("Created wallet {} for user {}", wallet.getId(), user.getId());
        return wallet;
    }

    public WalletResponse getWalletByUserId(UUID userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user: " + userId));
        return toResponse(wallet);
    }

    public Wallet getWalletEntityByUserId(UUID userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user: " + userId));
    }

    @Transactional
    public Wallet creditWallet(UUID walletId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByIdWithLock(walletId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found: " + walletId));

        if (wallet.getStatus() != WalletStatus.ACTIVE) {
            throw new IllegalStateException("Wallet is not active");
        }

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet = walletRepository.save(wallet);
        log.info("Credited {} to wallet {}, new balance: {}", amount, walletId, wallet.getBalance());
        return wallet;
    }

    @Transactional
    public Wallet debitWallet(UUID walletId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByIdWithLock(walletId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found: " + walletId));

        if (wallet.getStatus() != WalletStatus.ACTIVE) {
            throw new IllegalStateException("Wallet is not active");
        }

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: ₹%s, Required: ₹%s",
                            wallet.getBalance(), amount));
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet = walletRepository.save(wallet);
        log.info("Debited {} from wallet {}, new balance: {}", amount, walletId, wallet.getBalance());
        return wallet;
    }

    private WalletResponse toResponse(Wallet wallet) {
        return WalletResponse.builder()
                .id(wallet.getId())
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .status(wallet.getStatus())
                .createdAt(wallet.getCreatedAt())
                .build();
    }
}
