package com.dms.metadata.controller;

import com.dms.metadata.dto.DocumentRequest;
import com.dms.metadata.dto.DocumentResponse;
import com.dms.metadata.entity.Document;
import com.dms.metadata.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/metadata")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping
    public ResponseEntity<?> createDocument(@Valid @RequestBody DocumentRequest request,
                                          @RequestHeader("X-User-Id") Long userId) {
        try {
            DocumentResponse response = documentService.createDocument(request, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id,
                                       @RequestHeader("X-User-Id") Long userId,
                                       @RequestHeader("X-User-Role") String userRole) {
        Optional<DocumentResponse> document = documentService.getDocumentById(id, userId, userRole);
        
        if (document.isPresent()) {
            return ResponseEntity.ok(document.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Document not found or access denied");
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<DocumentResponse>> getAllDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "uploadDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) String tags,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String userRole) {
        
        Page<DocumentResponse> documents = documentService.getAllDocuments(
                page, size, sortBy, sortDir, title, description, fileName, tags, userId, userRole);
        
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Long id,
                                          @Valid @RequestBody DocumentRequest request,
                                          @RequestHeader("X-User-Id") Long userId,
                                          @RequestHeader("X-User-Role") String userRole) {
        Optional<DocumentResponse> updatedDocument = documentService.updateDocument(id, request, userId, userRole);
        
        if (updatedDocument.isPresent()) {
            return ResponseEntity.ok(updatedDocument.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Document not found or access denied");
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id,
                                          @RequestHeader("X-User-Id") Long userId,
                                          @RequestHeader("X-User-Role") String userRole) {
        boolean deleted = documentService.deleteDocument(id, userId, userRole);
        
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Document deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Document not found or access denied");
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDocumentStatus(@PathVariable Long id,
                                                 @RequestParam Document.DocumentStatus status,
                                                 @RequestParam(required = false) String filePath) {
        Optional<DocumentResponse> updatedDocument = documentService.updateDocumentStatus(id, status, filePath);
        
        if (updatedDocument.isPresent()) {
            return ResponseEntity.ok(updatedDocument.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Document not found");
            return ResponseEntity.notFound().build();
        }
    }
}

