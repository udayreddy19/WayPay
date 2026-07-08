package com.waypay.service;

import com.waypay.exception.UserNotFoundException;
import com.waypay.model.dto.request.SignupRequest;
import com.waypay.model.dto.request.UpdateProfileRequest;
import com.waypay.model.dto.response.UserResponse;
import com.waypay.model.entity.User;
import com.waypay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final WalletService walletService;

    @Transactional
    public UserResponse createUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .clerkId(request.getClerkId())
                .role("admin@waypay.in".equalsIgnoreCase(request.getEmail()) ? com.waypay.model.enums.UserRole.ADMIN : com.waypay.model.enums.UserRole.USER)
                .build();

        user = userRepository.save(user);

        // Auto-create wallet for new users
        walletService.createWallet(user);

        log.info("Created user: {} with email: {}", user.getId(), user.getEmail());
        return toResponse(user);
    }

    @Transactional
    public UserResponse findOrCreateByClerkId(String clerkId, String email, String name) {
        return userRepository.findByClerkId(clerkId)
                .map(this::toResponse)
                .orElseGet(() -> {
                    SignupRequest request = new SignupRequest();
                    request.setName(name);
                    request.setEmail(email);
                    request.setClerkId(clerkId);
                    return createUser(request);
                });
    }

    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return toResponse(user);
    }

    public UserResponse getUserByClerkId(String clerkId) {
        User user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UserNotFoundException("User not found for Clerk ID"));
        return toResponse(user);
    }

    public User userEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for email"));
    }

    public User getUserEntityByClerkId(String clerkId) {
        return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UserNotFoundException("User not found for Clerk ID"));
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        user = userRepository.save(user);
        log.info("Updated profile for user: {}", userId);
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
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
}
