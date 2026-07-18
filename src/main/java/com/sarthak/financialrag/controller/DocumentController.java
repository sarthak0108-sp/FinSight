package com.sarthak.financialrag.controller;

import com.sarthak.financialrag.service.IngestionService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final IngestionService ingestionService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            ingestionService.parseAndStoreDocument(file);
            return ResponseEntity.ok(new UploadResponse("File metadata vectors successfully extracted."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new UploadResponse("Ingestion process failed: " + e.getMessage()));
        }
    }


    public record UploadResponse(String message) {}
}