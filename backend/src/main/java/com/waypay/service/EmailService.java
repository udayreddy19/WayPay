package com.waypay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        log.info("Sending welcome email to: {}", toEmail);
        sendEmail(toEmail, "Welcome to WayPay! 🎉",
                buildWelcomeHtml(name));
    }

    @Async
    public void sendMoneyAddedEmail(String toEmail, String name, String amount) {
        log.info("Sending money-added email to: {}", toEmail);
        sendEmail(toEmail, "₹" + amount + " added to your WayPay wallet",
                buildMoneyAddedHtml(name, amount));
    }

    @Async
    public void sendTransferSentEmail(String toEmail, String name, String amount, String recipientName) {
        log.info("Sending transfer-sent email to: {}", toEmail);
        sendEmail(toEmail, "₹" + amount + " sent to " + recipientName,
                buildTransferSentHtml(name, amount, recipientName));
    }

    @Async
    public void sendTransferReceivedEmail(String toEmail, String name, String amount, String senderName) {
        log.info("Sending transfer-received email to: {}", toEmail);
        sendEmail(toEmail, "₹" + amount + " received from " + senderName,
                buildTransferReceivedHtml(name, amount, senderName));
    }

    @Async
    public void sendKycApprovedEmail(String toEmail, String name) {
        log.info("Sending KYC approved email to: {}", toEmail);
        sendEmail(toEmail, "KYC Verification Approved ✅",
                buildKycApprovedHtml(name));
    }

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            com.resend.Resend resend = new com.resend.Resend(resendApiKey);
            com.resend.services.emails.model.SendEmailRequest request =
                    com.resend.services.emails.model.SendEmailRequest.builder()
                            .from(fromEmail)
                            .to(to)
                            .subject(subject)
                            .html(htmlBody)
                            .build();
            resend.emails().send(request);
            log.info("Email sent successfully to: {} | subject: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to: {} | subject: {} | error: {}", to, subject, e.getMessage());
        }
    }

    private String buildWelcomeHtml(String name) {
        return """
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0;">Welcome to WayPay! 🎉</h1>
                </div>
                <div style="padding: 32px; background: #fafafa; border-radius: 0 0 16px 16px;">
                    <p>Hi %s,</p>
                    <p>Your WayPay wallet is ready! You can now add money, send payments, and manage your finances — all in one place.</p>
                    <a href="https://waypay.in/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Go to Dashboard</a>
                </div>
            </div>
            """.formatted(name);
    }

    private String buildMoneyAddedHtml(String name, String amount) {
        return """
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0;">Money Added ✅</h1>
                </div>
                <div style="padding: 32px; background: #fafafa; border-radius: 0 0 16px 16px;">
                    <p>Hi %s,</p>
                    <p>₹%s has been added to your WayPay wallet successfully.</p>
                </div>
            </div>
            """.formatted(name, amount);
    }

    private String buildTransferSentHtml(String name, String amount, String recipientName) {
        return """
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0;">Payment Sent 💸</h1>
                </div>
                <div style="padding: 32px; background: #fafafa; border-radius: 0 0 16px 16px;">
                    <p>Hi %s,</p>
                    <p>You sent ₹%s to %s.</p>
                </div>
            </div>
            """.formatted(name, amount, recipientName);
    }

    private String buildTransferReceivedHtml(String name, String amount, String senderName) {
        return """
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0;">Payment Received 🎉</h1>
                </div>
                <div style="padding: 32px; background: #fafafa; border-radius: 0 0 16px 16px;">
                    <p>Hi %s,</p>
                    <p>You received ₹%s from %s.</p>
                </div>
            </div>
            """.formatted(name, amount, senderName);
    }

    private String buildKycApprovedHtml(String name) {
        return """
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; border-radius: 16px 16px 0 0;">
                    <h1 style="color: white; margin: 0;">KYC Approved ✅</h1>
                </div>
                <div style="padding: 32px; background: #fafafa; border-radius: 0 0 16px 16px;">
                    <p>Hi %s,</p>
                    <p>Your KYC verification has been approved. You now have full access to all WayPay features.</p>
                </div>
            </div>
            """.formatted(name);
    }
}
