package com.dms.metadata.dto;

import com.dms.metadata.entity.Document;
import java.time.LocalDateTime;

public class DocumentResponse {
    private Long id;
    private String title;
    private String description;
    private String fileName;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private Long uploadedBy;
    private String tags;
    private String filePath;
    private Document.DocumentStatus status;

    // Constructors
    public DocumentResponse() {}

    public DocumentResponse(Document document) {
        this.id = document.getId();
        this.title = document.getTitle();
        this.description = document.getDescription();
        this.fileName = document.getFileName();
        this.fileSize = document.getFileSize();
        this.uploadDate = document.getUploadDate();
        this.uploadedBy = document.getUploadedBy();
        this.tags = document.getTags();
        this.filePath = document.getFilePath();
        this.status = document.getStatus();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Long getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Document.DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(Document.DocumentStatus status) {
        this.status = status;
    }
}

