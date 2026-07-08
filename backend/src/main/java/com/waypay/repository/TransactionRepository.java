package com.waypay.repository;

import com.waypay.model.entity.Transaction;
import com.waypay.model.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("SELECT t FROM Transaction t WHERE t.fromWallet.id = :walletId OR t.toWallet.id = :walletId ORDER BY t.createdAt DESC")
    Page<Transaction> findByWalletId(@Param("walletId") UUID walletId, Pageable pageable);

    Optional<Transaction> findByStripeCheckoutSessionId(String sessionId);

    Optional<Transaction> findByStripePaymentId(String paymentId);

    long countByStatus(TransactionStatus status);

    @Query("SELECT t FROM Transaction t WHERE (t.fromWallet.id = :walletId OR t.toWallet.id = :walletId) AND t.status = :status ORDER BY t.createdAt DESC")
    Page<Transaction> findByWalletIdAndStatus(@Param("walletId") UUID walletId, @Param("status") TransactionStatus status, Pageable pageable);
}
