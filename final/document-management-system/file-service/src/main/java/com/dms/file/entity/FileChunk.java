package com.dms.file.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_chunks")
public class FileChunk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "chunk_number", nullable = false)
    private Integer chunkNumber;

    @Column(name = "chunk_size", nullable = false)
    private Long chunkSize;

    @Column(name = "chunk_path", nullable = false, length = 500)
    private String chunkPath;

    @Column(length = 64)
    private String checksum;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();

    // Constructors
    public FileChunk() {}

    public FileChunk(Long documentId, Integer chunkNumber, Long chunkSize, String chunkPath, String checksum) {
        this.documentId = documentId;
        this.chunkNumber = chunkNumber;
        this.chunkSize = chunkSize;
        this.chunkPath = chunkPath;
        this.checksum = checksum;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getChunkPath() {
        return chunkPath;
    }

    public void setChunkPath(String chunkPath) {
        this.chunkPath = chunkPath;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}

