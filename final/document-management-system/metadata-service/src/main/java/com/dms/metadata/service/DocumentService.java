package com.dms.metadata.service;

import com.dms.metadata.dto.DocumentRequest;
import com.dms.metadata.dto.DocumentResponse;
import com.dms.metadata.entity.Document;
import com.dms.metadata.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public DocumentResponse createDocument(DocumentRequest request, Long uploadedBy) {
        Document document = new Document(
                request.getTitle(),
                request.getDescription(),
                request.getFileName(),
                request.getFileSize(),
                uploadedBy,
                request.getTags()
        );
        
        Document savedDocument = documentRepository.save(document);
        return new DocumentResponse(savedDocument);
    }

    public Optional<DocumentResponse> getDocumentById(Long id, Long userId, String userRole) {
        Optional<Document> document = documentRepository.findById(id);
        
        if (document.isPresent()) {
            Document doc = document.get();
            // Admin can access all documents, users can only access their own
            if ("ADMIN".equals(userRole) || doc.getUploadedBy().equals(userId)) {
                return Optional.of(new DocumentResponse(doc));
            }
        }
        
        return Optional.empty();
    }

    public Page<DocumentResponse> getAllDocuments(int page, int size, String sortBy, String sortDir,
                                                 String title, String description, String fileName, 
                                                 String tags, Long userId, String userRole) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Admin can see all documents, users only their own
        Long filterUserId = "ADMIN".equals(userRole) ? null : userId;
        
        Page<Document> documents = documentRepository.findByFilters(
                title, description, fileName, tags, filterUserId, pageable);
        
        return documents.map(DocumentResponse::new);
    }

    public Optional<DocumentResponse> updateDocument(Long id, DocumentRequest request, Long userId, String userRole) {
        Optional<Document> existingDocument = documentRepository.findById(id);
        
        if (existingDocument.isPresent()) {
            Document document = existingDocument.get();
            
            // Admin can update all documents, users can only update their own
            if ("ADMIN".equals(userRole) || document.getUploadedBy().equals(userId)) {
                document.setTitle(request.getTitle());
                document.setDescription(request.getDescription());
                document.setTags(request.getTags());
                
                Document updatedDocument = documentRepository.save(document);
                return Optional.of(new DocumentResponse(updatedDocument));
            }
        }
        
        return Optional.empty();
    }

    public boolean deleteDocument(Long id, Long userId, String userRole) {
        Optional<Document> document = documentRepository.findById(id);
        
        if (document.isPresent()) {
            Document doc = document.get();
            
            // Admin can delete all documents, users can only delete their own
            if ("ADMIN".equals(userRole) || doc.getUploadedBy().equals(userId)) {
                documentRepository.deleteById(id);
                return true;
            }
        }
        
        return false;
    }

    public Optional<DocumentResponse> updateDocumentStatus(Long id, Document.DocumentStatus status, String filePath) {
        Optional<Document> document = documentRepository.findById(id);
        
        if (document.isPresent()) {
            Document doc = document.get();
            doc.setStatus(status);
            if (filePath != null) {
                doc.setFilePath(filePath);
            }
            
            Document updatedDocument = documentRepository.save(doc);
            return Optional.of(new DocumentResponse(updatedDocument));
        }
        
        return Optional.empty();
    }
}

