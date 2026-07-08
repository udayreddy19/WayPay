package com.waypay.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Slf4j
public class AnalyticsService {

    @Value("${posthog.api-key}")
    private String posthogApiKey;

    @Value("${posthog.host}")
    private String posthogHost;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Async
    public void trackEvent(String distinctId, String eventName, Map<String, Object> properties) {
        try {
            Map<String, Object> payload = Map.of(
                    "api_key", posthogApiKey,
                    "event", eventName,
                    "distinct_id", distinctId,
                    "properties", properties != null ? properties : Map.of()
            );

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(posthogHost + "/capture/"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() == 200) {
                            log.debug("Analytics event tracked: {} for {}", eventName, distinctId);
                        } else {
                            log.warn("Analytics tracking failed: {} status: {}", eventName, response.statusCode());
                        }
                    });

        } catch (Exception e) {
            log.error("Failed to track analytics event: {} | error: {}", eventName, e.getMessage());
        }
    }

    public void trackSignup(String userId) {
        trackEvent(userId, "user_signup", Map.of("source", "web"));
    }

    public void trackLogin(String userId) {
        trackEvent(userId, "user_login", Map.of());
    }

    public void trackAddMoney(String userId, String amount) {
        trackEvent(userId, "add_money", Map.of("amount", amount, "currency", "INR"));
    }

    public void trackTransfer(String userId, String amount) {
        trackEvent(userId, "transfer", Map.of("amount", amount, "currency", "INR"));
    }

    public void trackPaymentSuccess(String userId, String amount) {
        trackEvent(userId, "payment_success", Map.of("amount", amount));
    }

    public void trackPaymentFailure(String userId, String reason) {
        trackEvent(userId, "payment_failure", Map.of("reason", reason));
    }

    public void trackKycStarted(String userId) {
        trackEvent(userId, "kyc_started", Map.of());
    }

    public void trackKycCompleted(String userId) {
        trackEvent(userId, "kyc_completed", Map.of());
    }
}
