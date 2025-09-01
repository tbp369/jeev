package com.dms.file.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "metadata-service")
public interface MetadataServiceClient {

    @PutMapping("/metadata/{id}/status")
    ResponseEntity<?> updateDocumentStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "filePath", required = false) String filePath
    );
}
