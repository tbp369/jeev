package com.dms.file.dto;

import javax.validation.constraints.NotNull;

public class ChunkUploadRequest {
    @NotNull(message = "Document ID is required")
    private Long documentId;

    @NotNull(message = "Chunk number is required")
    private Integer chunkNumber;

    @NotNull(message = "Total chunks is required")
    private Integer totalChunks;

    private String checksum;

    // Constructors
    public ChunkUploadRequest() {}

    public ChunkUploadRequest(Long documentId, Integer chunkNumber, Integer totalChunks, String checksum) {
        this.documentId = documentId;
        this.chunkNumber = chunkNumber;
        this.totalChunks = totalChunks;
        this.checksum = checksum;
    }

    // Getters and Setters
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

    public Integer getTotalChunks() {
        return totalChunks;
    }

    public void setTotalChunks(Integer totalChunks) {
        this.totalChunks = totalChunks;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }
}

