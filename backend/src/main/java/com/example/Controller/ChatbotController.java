package com.example.Controller;

import com.example.external.GroqClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Conversational food assistant. Takes the user's taste/dietary requirements and
 * returns tailored meal suggestions plus cooking guidance, powered by Groq.
 */
@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final GroqClient groq;

    private static final String SYSTEM_PROMPT = """
            You are NutriBot, a friendly nutrition and cooking assistant inside a Protein Management web app.
            Help users discover meals based on their taste, cravings, dietary needs and fitness goals
            (e.g. high-protein, low-carb, vegetarian, weight loss, muscle gain).
            For each reply:
              - Suggest 1-3 concrete dishes that match what the user asked for.
              - For each dish give a one-line reason it fits, and key macros if known
                (approx calories, protein, carbs, fat).
              - When the user wants to cook something, give clear numbered step-by-step instructions.
            Keep answers concise, warm and practical. Use light markdown (bold headings, numbered steps).
            If a request is unrelated to food, nutrition or cooking, gently steer back.
            """;

    public ChatbotController(GroqClient groq) {
        this.groq = groq;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        if (!groq.isConfigured()) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "Chatbot is not configured",
                    "hint", "Set GROQ_API_KEY in the backend environment."));
        }
        if (request == null || request.messages() == null || request.messages().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No messages provided"));
        }

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
        for (ChatMessage m : request.messages()) {
            String role = "assistant".equals(m.role()) ? "assistant" : "user";
            messages.add(Map.of("role", role, "content", m.content() == null ? "" : m.content()));
        }

        try {
            String reply = groq.chat(messages, 0.6);
            return ResponseEntity.ok(Map.of("reply", reply));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Chat request failed: " + e.getMessage()));
        }
    }

    public record ChatRequest(List<ChatMessage> messages) {}
    public record ChatMessage(String role, String content) {}
}
