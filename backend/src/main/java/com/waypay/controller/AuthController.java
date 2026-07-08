package com.waypay.controller;

import com.waypay.model.dto.request.SignupRequest;
import com.waypay.model.dto.response.ApiResponse;
import com.waypay.model.dto.response.UserResponse;
import com.waypay.service.AnalyticsService;
import com.waypay.service.EmailService;
import com.waypay.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login")
public class AuthController {

    private final UserService userService;
    private final EmailService emailService;
    private final AnalyticsService analyticsService;

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<UserResponse>> signup(@Valid @RequestBody SignupRequest request) {
        UserResponse user = userService.createUser(request);

        // Async side effects
        emailService.sendWelcomeEmail(request.getEmail(), request.getName());
        analyticsService.trackSignup(user.getId().toString());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", user));
    }

    @PostMapping("/sync")
    @Operation(summary = "Sync user from Clerk (called after Clerk auth)")
    public ResponseEntity<ApiResponse<UserResponse>> syncClerkUser(
            @RequestParam String clerkId,
            @RequestParam String email,
            @RequestParam String name) {
        UserResponse user = userService.findOrCreateByClerkId(clerkId, email, name);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
