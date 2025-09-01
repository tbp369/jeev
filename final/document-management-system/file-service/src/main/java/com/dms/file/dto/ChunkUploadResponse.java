package com.dms.file.dto;

public class ChunkUploadResponse {
    private Long chunkId;
    private Long documentId;
    private Integer chunkNumber;
    private Long chunkSize;
    private String message;
    private boolean success;

    // Constructors
    public ChunkUploadResponse() {}

    public ChunkUploadResponse(Long chunkId, Long documentId, Integer chunkNumber, Long chunkSize, String message, boolean success) {
        this.chunkId = chunkId;
        this.documentId = documentId;
        this.chunkNumber = chunkNumber;
        this.chunkSize = chunkSize;
        this.message = message;
        this.success = success;
    }

    // Getters and Setters
    public Long getChunkId() {
        return chunkId;
    }

    public void setChunkId(Long chunkId) {
        this.chunkId = chunkId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Integer getChunkNumber() {
        return chunkNumber;
    }

    public void setChunkNumber(Integer chunkNumber) {
        this.chunkNumber = chunkNumber;
    }

    public Long getChunkSize() {
        return chunkSize;
    }

    public void setChunkSize(Long chunkSize) {
        this.chunkSize = chunkSize;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}

