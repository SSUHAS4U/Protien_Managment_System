package com.example.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Client for Groq's OpenAI-compatible chat completions API.
 * The API key is injected from GROQ_API_KEY and stays server-side only.
 */
@Component
public class GroqClient {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GroqClient(RestClient.Builder builder,
                      @Value("${groq.api.key:}") String apiKey,
                      @Value("${groq.api.base-url:https://api.groq.com/openai/v1}") String baseUrl,
                      @Value("${groq.api.model:llama-3.3-70b-versatile}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("CHANGE_ME");
    }

    /**
     * Sends the conversation to Groq and returns the assistant's reply text.
     * {@code messages} is a list of {role, content} maps.
     */
    @SuppressWarnings("unchecked")
    public String chat(List<Map<String, String>> messages, double temperature) {
        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", temperature,
                "messages", messages);

        Map<String, Object> response = restClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            return "Sorry, I couldn't generate a response right now.";
        }
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            return "Sorry, I couldn't generate a response right now.";
        }
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return message != null ? String.valueOf(message.get("content")) : "";
    }
}
