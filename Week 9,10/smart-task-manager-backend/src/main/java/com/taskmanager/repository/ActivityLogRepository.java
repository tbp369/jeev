package com.taskmanager.repository;

import com.taskmanager.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    Page<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<ActivityLog> findByActionAndEntityTypeAndEntityId(String action, String entityType, Long entityId);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.createdAt BETWEEN :fromDate AND :toDate ORDER BY a.createdAt DESC")
    Page<ActivityLog> findByDateRange(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate, Pageable pageable);
    
    @Query("SELECT a FROM ActivityLog a WHERE " +
           "(:userId IS NULL OR a.user.id = :userId) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:fromDate IS NULL OR a.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR a.createdAt <= :toDate) " +
           "ORDER BY a.createdAt DESC")
    Page<ActivityLog> findWithFilters(
        @Param("userId") Long userId,
        @Param("action") String action,
        @Param("entityType") String entityType,
        @Param("fromDate") LocalDateTime fromDate,
        @Param("toDate") LocalDateTime toDate,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(a) FROM ActivityLog a WHERE a.user.id = :userId AND a.createdAt >= :fromDate")
    long countUserActivitiesSince(@Param("userId") Long userId, @Param("fromDate") LocalDateTime fromDate);
}

