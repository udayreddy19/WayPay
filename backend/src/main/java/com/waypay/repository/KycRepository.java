package com.waypay.repository;

import com.waypay.model.entity.KycRecord;
import com.waypay.model.enums.KycStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KycRepository extends JpaRepository<KycRecord, UUID> {

    Optional<KycRecord> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    long countByVerificationStatus(KycStatus status);
}
