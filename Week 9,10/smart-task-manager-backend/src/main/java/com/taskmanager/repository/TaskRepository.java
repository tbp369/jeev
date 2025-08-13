package com.taskmanager.repository;

import com.taskmanager.entity.Priority;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find tasks by assignee
    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a.id = :userId")
    Page<Task> findByAssigneeId(@Param("userId") Long userId, Pageable pageable);
    
    // Find tasks created by user
    Page<Task> findByCreatedById(Long createdById, Pageable pageable);
    
    // Find tasks by status
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    
    // Find tasks by priority
    Page<Task> findByPriority(Priority priority, Pageable pageable);
    
    // Find overdue tasks
    @Query("SELECT t FROM Task t WHERE t.dueDate < :now AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasks(@Param("now") LocalDateTime now);
    
    // Find tasks due within specified hours
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :now AND :futureTime AND t.status != 'COMPLETED'")
    List<Task> findTasksDueWithin(@Param("now") LocalDateTime now, @Param("futureTime") LocalDateTime futureTime);
    
    // Find tasks by assignee and status
    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a.id = :userId AND t.status = :status")
    List<Task> findByAssigneeIdAndStatus(@Param("userId") Long userId, @Param("status") TaskStatus status);
    
    // Complex filtering query
    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE " +
           "(:assigneeId IS NULL OR a.id = :assigneeId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:fromDate IS NULL OR t.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR t.createdAt <= :toDate) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> findTasksWithFilters(
        @Param("assigneeId") Long assigneeId,
        @Param("status") TaskStatus status,
        @Param("priority") Priority priority,
        @Param("fromDate") LocalDateTime fromDate,
        @Param("toDate") LocalDateTime toDate,
        @Param("search") String search,
        Pageable pageable
    );
    
    // Analytics queries
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(@Param("status") TaskStatus status);
    
    @Query("SELECT COUNT(t) FROM Task t JOIN t.assignees a WHERE a.id = :userId AND t.status = :status")
    long countByAssigneeIdAndStatus(@Param("userId") Long userId, @Param("status") TaskStatus status);
    
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> getTaskCountByStatus();
    
    @Query("SELECT a.id, a.firstName, a.lastName, COUNT(t) FROM Task t JOIN t.assignees a WHERE t.status = 'COMPLETED' GROUP BY a.id, a.firstName, a.lastName")
    List<Object[]> getCompletedTaskCountByUser();
    
    @Query("SELECT a.id, a.firstName, a.lastName, COUNT(t) FROM Task t JOIN t.assignees a GROUP BY a.id, a.firstName, a.lastName")
    List<Object[]> getTotalTaskCountByUser();
    
    // Find tasks by tags
    @Query("SELECT t FROM Task t WHERE :tag MEMBER OF t.tags")
    List<Task> findByTag(@Param("tag") String tag);
    
    // Find tasks assigned to user with upcoming deadlines
    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a.id = :userId AND t.dueDate BETWEEN :now AND :futureTime AND t.status != 'COMPLETED' ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasksForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now, @Param("futureTime") LocalDateTime futureTime);
}

