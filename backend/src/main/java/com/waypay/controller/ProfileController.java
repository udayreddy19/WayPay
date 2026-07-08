package com.waypay.controller;

import com.waypay.model.dto.request.UpdateProfileRequest;
import com.waypay.model.dto.response.ApiResponse;
import com.waypay.model.dto.response.UserResponse;
import com.waypay.model.entity.User;
import com.waypay.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Profile", description = "User profile management")
public class ProfileController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal Jwt jwt) {
        UserResponse user = userService.getUserByClerkId(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UpdateProfileRequest request) {
        User user = userService.getUserEntityByClerkId(jwt.getSubject());
        UserResponse updated = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }
}
