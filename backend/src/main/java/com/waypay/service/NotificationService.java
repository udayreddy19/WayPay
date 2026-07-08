package com.waypay.service;

import com.waypay.model.entity.Notification;
import com.waypay.model.entity.User;
import com.waypay.model.enums.NotificationStatus;
import com.waypay.model.enums.NotificationType;
import com.waypay.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Async
    @Transactional
    public void createNotification(User user, NotificationType type, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .status(NotificationStatus.UNREAD)
                .build();

        notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", user.getId(), title);
    }

    public Page<Notification> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Page<Notification> getUnreadNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(
                userId, NotificationStatus.UNREAD, pageable);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setStatus(NotificationStatus.READ);
            n.setReadAt(OffsetDateTime.now());
            notificationRepository.save(n);
        });
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.UNREAD);
    }
}
