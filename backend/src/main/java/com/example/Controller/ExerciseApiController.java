package com.example.Controller;

import com.example.external.ExerciseApiClient;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * API-driven exercise catalogue + calorie estimation (API Ninjas).
 * Replaces the old admin-managed exercise table.
 */
@RestController
@RequestMapping("/api/exercises")
public class ExerciseApiController {

    private final ExerciseApiClient client;

    public ExerciseApiController(ExerciseApiClient client) {
        this.client = client;
    }

    /** Browse/search the exercise catalogue. All params optional (name, muscle, type, difficulty). */
    @GetMapping
    public ResponseEntity<?> catalog(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String muscle,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) Integer offset) {

        if (!client.isConfigured()) {
            return apiKeyMissing();
        }
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        addIf(params, "name", name);
        addIf(params, "muscle", muscle);
        addIf(params, "type", type);
        addIf(params, "difficulty", difficulty);
        addIf(params, "offset", offset);
        try {
            List<Map<String, Object>> list = client.exercises(params);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Exercise API request failed: " + e.getMessage()));
        }
    }

    /** Calories burned for an activity (weight in lb, duration in minutes). */
    @GetMapping("/calories")
    public ResponseEntity<?> calories(
            @RequestParam String activity,
            @RequestParam(required = false) String weight,
            @RequestParam(required = false) String duration) {

        if (!client.isConfigured()) {
            return apiKeyMissing();
        }
        try {
            List<Map<String, Object>> list = client.caloriesBurned(activity, weight, duration);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Exercise API request failed: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> apiKeyMissing() {
        return ResponseEntity.status(503).body(Map.of(
                "error", "Exercise API key not configured",
                "hint", "Set EXERCISE_API_KEY in the backend environment (.env locally, Render dashboard in prod)."));
    }

    private void addIf(MultiValueMap<String, String> params, String key, Object value) {
        if (value != null && !value.toString().isBlank()) {
            params.add(key, value.toString());
        }
    }
}
