package com.taskmanager.controller;

import com.taskmanager.entity.User;
import com.taskmanager.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics & Dashboard", description = "Analytics and dashboard APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics for current user")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        Map<String, Object> stats = analyticsService.getDashboardStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/dashboard/overall")
    @Operation(summary = "Get overall dashboard statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getOverallStats() {
        Map<String, Object> stats = analyticsService.getOverallStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/tasks/status-distribution")
    @Operation(summary = "Get task count by status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Long>> getTaskCountByStatus() {
        Map<String, Long> statusCounts = analyticsService.getTaskCountByStatus();
        return ResponseEntity.ok(statusCounts);
    }
    
    @GetMapping("/tasks/completed-by-user")
    @Operation(summary = "Get completed tasks count by user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getCompletedTasksByUser() {
        Map<String, Object> userStats = analyticsService.getCompletedTasksByUser();
        return ResponseEntity.ok(userStats);
    }
    
    @GetMapping("/tasks/total-by-user")
    @Operation(summary = "Get total tasks count by user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getTotalTasksByUser() {
        Map<String, Object> userStats = analyticsService.getTotalTasksByUser();
        return ResponseEntity.ok(userStats);
    }
    
    @GetMapping("/productivity")
    @Operation(summary = "Get productivity metrics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getProductivityMetrics() {
        Map<String, Object> metrics = analyticsService.getProductivityMetrics();
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/workload")
    @Operation(summary = "Get workload distribution")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getWorkloadDistribution() {
        Map<String, Object> workload = analyticsService.getWorkloadDistribution();
        return ResponseEntity.ok(workload);
    }
}

