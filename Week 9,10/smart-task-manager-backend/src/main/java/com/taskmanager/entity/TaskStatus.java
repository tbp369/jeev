package com.taskmanager.entity;

public enum TaskStatus {
    TODO("To Do"),
    IN_PROGRESS("In Progress"),
    BLOCKED("Blocked"),
    COMPLETED("Completed");
    
    private final String displayName;
    
    TaskStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

