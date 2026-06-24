package com.example.Controller;

import com.example.external.ExerciseApiClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Exercise catalogue + calorie estimation.
 *
 * The catalogue is served from a curated local dataset (exercises.json) so it is
 * always available and free — API Ninjas moved its /exercises endpoint behind a
 * paywall. Calorie estimates still use API Ninjas' (free) caloriesburned endpoint.
 */
@RestController
@RequestMapping("/api/exercises")
public class ExerciseApiController {

    private final ExerciseApiClient client;
    private final List<Map<String, Object>> catalogue;

    public ExerciseApiController(ExerciseApiClient client) {
        this.client = client;
        this.catalogue = loadCatalogue();
    }

    private List<Map<String, Object>> loadCatalogue() {
        try (InputStream in = new ClassPathResource("exercises.json").getInputStream()) {
            return new ObjectMapper().readValue(in, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /** Browse/search the curated catalogue. All params optional (name, muscle, type, difficulty). */
    @GetMapping
    public ResponseEntity<?> catalog(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String muscle,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) Integer offset) {

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> ex : catalogue) {
            if (!matches(ex.get("name"), name, true)) continue;
            if (!matches(ex.get("muscle"), muscle, false)) continue;
            if (!matches(ex.get("type"), type, false)) continue;
            if (!matches(ex.get("difficulty"), difficulty, false)) continue;
            result.add(ex);
        }
        if (offset != null && offset > 0 && offset < result.size()) {
            result = result.subList(offset, result.size());
        }
        return ResponseEntity.ok(result);
    }

    /** Calories burned for an activity (weight in lb, duration in minutes) via API Ninjas. */
    @GetMapping("/calories")
    public ResponseEntity<?> calories(
            @RequestParam String activity,
            @RequestParam(required = false) String weight,
            @RequestParam(required = false) String duration) {

        if (!client.isConfigured()) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "Exercise calories API key not configured",
                    "hint", "Set EXERCISE_API_KEY in the backend environment."));
        }
        try {
            return ResponseEntity.ok(client.caloriesBurned(activity, weight, duration));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Calories API request failed: " + e.getMessage()));
        }
    }

    /** Case-insensitive match; {@code contains} = substring match, otherwise exact. */
    private boolean matches(Object field, String filter, boolean contains) {
        if (filter == null || filter.isBlank()) return true;
        if (field == null) return false;
        String f = field.toString().toLowerCase();
        String q = filter.toLowerCase().trim();
        return contains ? f.contains(q) : f.equals(q);
    }
}
