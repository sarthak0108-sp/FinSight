package com.sarthak.financialrag.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AnalysisService {

    private final ChatClient chatClient;

    public AnalysisService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String executeContextQuery(String question) {
        return chatClient.prompt()
                .user(question)
                .call()
                .content();
    }
}