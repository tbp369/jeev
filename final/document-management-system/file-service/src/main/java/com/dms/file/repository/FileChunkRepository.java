package com.dms.file.repository;

import com.dms.file.entity.FileChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileChunkRepository extends JpaRepository<FileChunk, Long> {
    List<FileChunk> findByDocumentIdOrderByChunkNumber(Long documentId);
    Optional<FileChunk> findByDocumentIdAndChunkNumber(Long documentId, Integer chunkNumber);
    long countByDocumentId(Long documentId);
    void deleteByDocumentId(Long documentId);
}

