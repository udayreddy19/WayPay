package com.waypay.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class KycRequest {

    @NotBlank(message = "Aadhaar number is required")
    private String aadhaar;

    @NotBlank(message = "PAN number is required")
    private String pan;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private LocalDate dateOfBirth;
    private String address;
}
