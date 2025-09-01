package com.dms.file.controller;

import com.dms.file.dto.ChunkUploadRequest;
import com.dms.file.dto.ChunkUploadResponse;
import com.dms.file.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload-chunk")
    public ResponseEntity<ChunkUploadResponse> uploadChunk(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentId") Long documentId,
            @RequestParam("chunkNumber") Integer chunkNumber,
            @RequestParam("totalChunks") Integer totalChunks,
            @RequestParam(value = "checksum", required = false) String checksum) {

        ChunkUploadRequest request = new ChunkUploadRequest(documentId, chunkNumber, totalChunks, checksum);
        ChunkUploadResponse response = fileStorageService.uploadChunk(request, file);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long documentId,
                                               HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.downloadFile(documentId);

            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                // Fallback to default content type
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download-chunk/{documentId}/{chunkNumber}")
    public ResponseEntity<Resource> downloadChunk(@PathVariable Long documentId,
                                                @PathVariable Integer chunkNumber,
                                                HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.downloadChunk(documentId, chunkNumber);

            String contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"chunk_" + chunkNumber + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/resume-upload/{documentId}")
    public ResponseEntity<Map<String, Object>> getUploadedChunks(@PathVariable Long documentId) {
        try {
            List<Integer> uploadedChunks = fileStorageService.getUploadedChunks(documentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("documentId", documentId);
            response.put("uploadedChunks", uploadedChunks);
            response.put("totalUploaded", uploadedChunks.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable Long documentId) {
        boolean deleted = fileStorageService.deleteFile(documentId);
        
        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "File deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Failed to delete file");
            return ResponseEntity.badRequest().body(response);
        }
    }
}

