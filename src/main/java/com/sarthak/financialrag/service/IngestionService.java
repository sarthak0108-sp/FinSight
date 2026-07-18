package com.sarthak.financialrag.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class IngestionService {

    private final VectorStore vectorStore;

    public IngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void parseAndStoreDocument(MultipartFile file) throws IOException {
        TikaDocumentReader reader = new TikaDocumentReader(new InputStreamResource(file.getInputStream()));
        List<Document> rawDocs = reader.get();

        TokenTextSplitter splitter = new TokenTextSplitter();
        List<Document> chunkedDocs = splitter.apply(rawDocs);

        for (Document doc : chunkedDocs) {
            doc.getMetadata().put("file_origin", file.getOriginalFilename());
        }

        vectorStore.accept(chunkedDocs);
    }
}