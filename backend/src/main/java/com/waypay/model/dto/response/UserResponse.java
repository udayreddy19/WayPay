package com.waypay.model.dto.response;

import com.waypay.model.enums.KycStatus;
import com.waypay.model.enums.UserRole;
import com.waypay.model.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private UserStatus status;
    private KycStatus kycStatus;
    private UserRole role;
    private String avatarUrl;
    private OffsetDateTime createdAt;
}
