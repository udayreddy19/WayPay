package com.waypay.service;

import com.waypay.model.entity.LedgerEntry;
import com.waypay.model.entity.Wallet;
import com.waypay.model.enums.LedgerEntryType;
import com.waypay.repository.LedgerRepository;
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
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    @Transactional
    public LedgerEntry createCreditEntry(Wallet wallet, BigDecimal amount, LedgerEntryType type,
                                          String reference, String description) {
        LedgerEntry entry = LedgerEntry.builder()
                .wallet(wallet)
                .type(type)
                .credit(amount)
                .debit(BigDecimal.ZERO)
                .balanceAfter(wallet.getBalance())
                .reference(reference)
                .description(description)
                .build();

        entry = ledgerRepository.save(entry);
        log.info("Ledger credit entry: {} | ₹{} | wallet {} | ref: {}",
                type, amount, wallet.getId(), reference);
        return entry;
    }

    @Transactional
    public LedgerEntry createDebitEntry(Wallet wallet, BigDecimal amount, LedgerEntryType type,
                                         String reference, String description) {
        LedgerEntry entry = LedgerEntry.builder()
                .wallet(wallet)
                .type(type)
                .credit(BigDecimal.ZERO)
                .debit(amount)
                .balanceAfter(wallet.getBalance())
                .reference(reference)
                .description(description)
                .build();

        entry = ledgerRepository.save(entry);
        log.info("Ledger debit entry: {} | ₹{} | wallet {} | ref: {}",
                type, amount, wallet.getId(), reference);
        return entry;
    }

    public Page<LedgerEntry> getWalletLedger(UUID walletId, Pageable pageable) {
        return ledgerRepository.findByWalletIdOrderByCreatedAtDesc(walletId, pageable);
    }
}
