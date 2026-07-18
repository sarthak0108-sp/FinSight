package com.sarthak.financialrag.controller;

import com.sarthak.financialrag.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class QueryController {

    private final AnalysisService analysisService;

    @GetMapping("/query")
    public ResponseEntity<QueryResponse> askQuestion(@RequestParam("question") String question) {
        String answer = analysisService.executeContextQuery(question);
        return ResponseEntity.ok(new QueryResponse(answer));
    }

    public record QueryResponse(String response) {}
}