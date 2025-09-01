package com.dms.file.service;
import java.util.stream.Collectors;
import com.dms.file.client.MetadataServiceClient;
import com.dms.file.dto.ChunkUploadRequest;
import com.dms.file.dto.ChunkUploadResponse;
import com.dms.file.entity.FileChunk;
import com.dms.file.repository.FileChunkRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Autowired
    private FileChunkRepository fileChunkRepository;

    @Autowired
    private MetadataServiceClient metadataServiceClient;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public ChunkUploadResponse uploadChunk(ChunkUploadRequest request, MultipartFile file) {
        try {
            // Create document directory if it doesn't exist
            Path documentDir = this.fileStorageLocation.resolve(request.getDocumentId().toString());
            Files.createDirectories(documentDir);

            // Generate chunk filename
            String chunkFileName = "chunk_" + request.getChunkNumber();
            Path chunkPath = documentDir.resolve(chunkFileName);

            // Calculate checksum if not provided
            String checksum = request.getChecksum();
            if (checksum == null || checksum.isEmpty()) {
                checksum = DigestUtils.md5Hex(file.getInputStream());
            }

            // Save chunk to file system
            Files.copy(file.getInputStream(), chunkPath, StandardCopyOption.REPLACE_EXISTING);

            // Save chunk metadata to database
            FileChunk fileChunk = new FileChunk(
                    request.getDocumentId(),
                    request.getChunkNumber(),
                    file.getSize(),
                    chunkPath.toString(),
                    checksum
            );

            FileChunk savedChunk = fileChunkRepository.save(fileChunk);

            // Check if all chunks are uploaded
            long uploadedChunks = fileChunkRepository.countByDocumentId(request.getDocumentId());
            if (uploadedChunks == request.getTotalChunks()) {
                // All chunks uploaded, merge them
                String mergedFilePath = mergeChunks(request.getDocumentId());
                // Update document status to COMPLETED
                metadataServiceClient.updateDocumentStatus(request.getDocumentId(), "COMPLETED", mergedFilePath);
            }

            return new ChunkUploadResponse(
                    savedChunk.getId(),
                    request.getDocumentId(),
                    request.getChunkNumber(),
                    file.getSize(),
                    "Chunk uploaded successfully",
                    true
            );

        } catch (Exception e) {
            return new ChunkUploadResponse(
                    null,
                    request.getDocumentId(),
                    request.getChunkNumber(),
                    0L,
                    "Failed to upload chunk: " + e.getMessage(),
                    false
            );
        }
    }

    private String mergeChunks(Long documentId) throws IOException {
        List<FileChunk> chunks = fileChunkRepository.findByDocumentIdOrderByChunkNumber(documentId);
        
        Path documentDir = this.fileStorageLocation.resolve(documentId.toString());
        Path mergedFilePath = documentDir.resolve("merged_file");

        try (FileOutputStream fos = new FileOutputStream(mergedFilePath.toFile())) {
            for (FileChunk chunk : chunks) {
                Path chunkPath = Paths.get(chunk.getChunkPath());
                Files.copy(chunkPath, fos);
                // Delete chunk file after merging
                Files.deleteIfExists(chunkPath);
            }
        }

        return mergedFilePath.toString();
    }

    public Resource downloadFile(Long documentId) {
        try {
            Path documentDir = this.fileStorageLocation.resolve(documentId.toString());
            Path filePath = documentDir.resolve("merged_file");
            
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + documentId);
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found " + documentId, ex);
        }
    }

    public Resource downloadChunk(Long documentId, Integer chunkNumber) {
        try {
            FileChunk chunk = fileChunkRepository.findByDocumentIdAndChunkNumber(documentId, chunkNumber)
                    .orElseThrow(() -> new RuntimeException("Chunk not found"));

            Path chunkPath = Paths.get(chunk.getChunkPath());
            Resource resource = new UrlResource(chunkPath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Chunk file not found");
            }
        } catch (Exception ex) {
            throw new RuntimeException("Chunk not found", ex);
        }
    }

    public List<Integer> getUploadedChunks(Long documentId) {
        List<FileChunk> chunks = fileChunkRepository.findByDocumentIdOrderByChunkNumber(documentId);
        return chunks.stream()
                .map(FileChunk::getChunkNumber)
                .collect(Collectors.toList());
    }

    public boolean deleteFile(Long documentId) {
        try {
            // Delete chunks from database
            fileChunkRepository.deleteByDocumentId(documentId);
            
            // Delete files from file system
            Path documentDir = this.fileStorageLocation.resolve(documentId.toString());
            if (Files.exists(documentDir)) {
                Files.walk(documentDir)
                        .sorted((a, b) -> b.compareTo(a)) // Reverse order to delete files before directories
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                System.err.println("Failed to delete: " + path);
                            }
                        });
            }
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

