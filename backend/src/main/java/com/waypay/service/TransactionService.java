package com.waypay.service;

import com.waypay.model.dto.response.TransactionResponse;
import com.waypay.model.entity.Transaction;
import com.waypay.model.entity.Wallet;
import com.waypay.model.enums.LedgerEntryType;
import com.waypay.model.enums.TransactionStatus;
import com.waypay.model.enums.TransactionType;
import com.waypay.repository.TransactionRepository;
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
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletService walletService;
    private final LedgerService ledgerService;

    @Transactional
    public Transaction createAddMoneyTransaction(UUID walletId, BigDecimal amount,
                                                  String stripeSessionId) {
        Transaction txn = Transaction.builder()
                .toWallet(walletService.getWalletEntityByUserId(
                        walletService.getWalletEntityByUserId(walletId) != null ? walletId : walletId))
                .amount(amount)
                .type(TransactionType.ADD_MONEY)
                .status(TransactionStatus.PENDING)
                .stripeCheckoutSessionId(stripeSessionId)
                .description("Add money via Stripe")
                .build();

        // Re-fetch wallet properly
        Wallet wallet = walletService.getWalletEntityByUserId(walletId);
        txn.setToWallet(wallet);

        txn = transactionRepository.save(txn);
        log.info("Created add-money transaction: {} for ₹{}", txn.getId(), amount);
        return txn;
    }

    @Transactional
    public Transaction createAddMoneyTransactionWithPaymentIntent(UUID userId, BigDecimal amount,
                                                                  String stripePaymentId) {
        Wallet wallet = walletService.getWalletEntityByUserId(userId);
        Transaction txn = Transaction.builder()
                .toWallet(wallet)
                .amount(amount)
                .type(TransactionType.ADD_MONEY)
                .status(TransactionStatus.PENDING)
                .stripePaymentId(stripePaymentId)
                .description("Add money via direct UPI")
                .build();

        txn = transactionRepository.save(txn);
        log.info("Created add-money direct transaction: {} for ₹{}", txn.getId(), amount);
        return txn;
    }

    @Transactional
    public Transaction createAddMoneyTransactionWithRazorpay(UUID userId, BigDecimal amount,
                                                             String razorpayOrderId) {
        Wallet wallet = walletService.getWalletEntityByUserId(userId);
        Transaction txn = Transaction.builder()
                .toWallet(wallet)
                .amount(amount)
                .type(TransactionType.ADD_MONEY)
                .status(TransactionStatus.PENDING)
                .razorpayOrderId(razorpayOrderId)
                .description("Add money via Razorpay UPI")
                .build();

        txn = transactionRepository.save(txn);
        log.info("Created add-money Razorpay transaction: {} for ₹{}", txn.getId(), amount);
        return txn;
    }

    @Transactional
    public void completeAddMoneyTransaction(String stripeId) {
        Transaction txn = transactionRepository.findByStripeCheckoutSessionId(stripeId)
                .or(() -> transactionRepository.findByStripePaymentId(stripeId))
                .or(() -> transactionRepository.findByRazorpayOrderId(stripeId))
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found for ID: " + stripeId));

        if (txn.getStatus() == TransactionStatus.COMPLETED) {
            log.warn("Transaction already completed: {}", txn.getId());
            return; // Idempotent
        }

        // Credit wallet
        Wallet wallet = walletService.creditWallet(txn.getToWallet().getId(), txn.getAmount());

        // Create ledger entry
        ledgerService.createCreditEntry(wallet, txn.getAmount(),
                LedgerEntryType.CREDIT_ADD_MONEY,
                txn.getId().toString(),
                txn.getDescription() != null ? txn.getDescription() : "Money added via Stripe");

        // Update transaction status
        txn.setStatus(TransactionStatus.COMPLETED);
        transactionRepository.save(txn);

        log.info("Completed add-money transaction: {} | ₹{}", txn.getId(), txn.getAmount());
    }

    @Transactional
    public void completeRazorpayTransaction(String orderId, String paymentId) {
        Transaction txn = transactionRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found for Razorpay Order: " + orderId));

        txn.setRazorpayPaymentId(paymentId);
        transactionRepository.save(txn);

        completeAddMoneyTransaction(orderId);
    }


    @Transactional
    public Transaction createTransfer(UUID fromUserId, UUID toUserId, BigDecimal amount, String description) {
        Wallet fromWallet = walletService.getWalletEntityByUserId(fromUserId);
        Wallet toWallet = walletService.getWalletEntityByUserId(toUserId);

        // Debit sender
        walletService.debitWallet(fromWallet.getId(), amount);
        // Credit receiver
        walletService.creditWallet(toWallet.getId(), amount);

        // Create transaction record
        Transaction txn = Transaction.builder()
                .fromWallet(fromWallet)
                .toWallet(toWallet)
                .amount(amount)
                .type(TransactionType.TRANSFER_OUT)
                .status(TransactionStatus.COMPLETED)
                .description(description != null ? description : "Wallet transfer")
                .build();
        txn = transactionRepository.save(txn);

        // Ledger entries
        ledgerService.createDebitEntry(fromWallet, amount,
                LedgerEntryType.DEBIT_TRANSFER_OUT,
                txn.getId().toString(),
                "Transfer to " + toWallet.getUser().getName());

        ledgerService.createCreditEntry(toWallet, amount,
                LedgerEntryType.CREDIT_TRANSFER_IN,
                txn.getId().toString(),
                "Transfer from " + fromWallet.getUser().getName());

        log.info("Transfer completed: {} → {} | ₹{}", fromWallet.getId(), toWallet.getId(), amount);
        return txn;
    }

    public Page<TransactionResponse> getTransactionsByWalletId(UUID walletId, Pageable pageable) {
        return transactionRepository.findByWalletId(walletId, pageable)
                .map(this::toResponse);
    }

    public Page<TransactionResponse> getTransactionsByUserId(UUID userId, Pageable pageable) {
        Wallet wallet = walletService.getWalletEntityByUserId(userId);
        return getTransactionsByWalletId(wallet.getId(), pageable);
    }

    private TransactionResponse toResponse(Transaction txn) {
        return TransactionResponse.builder()
                .id(txn.getId())
                .fromWalletId(txn.getFromWallet() != null ? txn.getFromWallet().getId() : null)
                .toWalletId(txn.getToWallet() != null ? txn.getToWallet().getId() : null)
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .type(txn.getType())
                .status(txn.getStatus())
                .paymentMethod(txn.getPaymentMethod())
                .description(txn.getDescription())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}
