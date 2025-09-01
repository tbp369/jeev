package com.dms.metadata.repository;

import com.dms.metadata.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    Page<Document> findByUploadedBy(Long uploadedBy, Pageable pageable);
    
    @Query("SELECT d FROM Document d WHERE " +
           "(:title IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:description IS NULL OR LOWER(d.description) LIKE LOWER(CONCAT('%', :description, '%'))) AND " +
           "(:fileName IS NULL OR LOWER(d.fileName) LIKE LOWER(CONCAT('%', :fileName, '%'))) AND " +
           "(:tags IS NULL OR LOWER(d.tags) LIKE LOWER(CONCAT('%', :tags, '%'))) AND " +
           "(:uploadedBy IS NULL OR d.uploadedBy = :uploadedBy)")
    Page<Document> findByFilters(@Param("title") String title,
                                @Param("description") String description,
                                @Param("fileName") String fileName,
                                @Param("tags") String tags,
                                @Param("uploadedBy") Long uploadedBy,
                                Pageable pageable);
    
    List<Document> findByUploadedByAndStatus(Long uploadedBy, Document.DocumentStatus status);
}

