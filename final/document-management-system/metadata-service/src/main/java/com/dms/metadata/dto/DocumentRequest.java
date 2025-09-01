package com.dms.metadata.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class DocumentRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotNull(message = "File size is required")
    private Long fileSize;

    private String tags;

    // Constructors
    public DocumentRequest() {}

    public DocumentRequest(String title, String description, String fileName, Long fileSize, String tags) {
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.tags = tags;
    }

    // Getters and Setters
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

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }
}

