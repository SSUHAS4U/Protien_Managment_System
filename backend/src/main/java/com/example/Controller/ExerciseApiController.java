package com.example.Controller;

import com.example.external.ExerciseApiClient;
import com.example.external.ExerciseDbClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Exercise catalogue + calorie estimation.
 *
 * Catalogue is served by {@link ExerciseDbClient} (animated ExerciseDB exercises
 * merged with a curated local set), so it is always available with GIFs and
 * instructions. Calorie estimates use API Ninjas' free caloriesburned endpoint.
 */
@RestController
@RequestMapping("/api/exercises")
public class ExerciseApiController {

    private final ExerciseApiClient calorieClient;
    private final ExerciseDbClient catalogClient;

    public ExerciseApiController(ExerciseApiClient calorieClient, ExerciseDbClient catalogClient) {
        this.calorieClient = calorieClient;
        this.catalogClient = catalogClient;
    }

    /** Browse/search the catalogue. Filter by name (substring) and bodyPart (exact). */
    @GetMapping
    public ResponseEntity<?> catalog(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String bodyPart,
            @RequestParam(required = false) Integer offset,
            @RequestParam(required = false) Integer limit) {

        List<Map<String, Object>> all = catalogClient.catalogue();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> ex : all) {
            if (!matches(ex.get("name"), name, true)) continue;
            if (!matches(ex.get("bodyPart"), bodyPart, false)) continue;
            result.add(ex);
        }
        int from = (offset != null && offset > 0) ? Math.min(offset, result.size()) : 0;
        int to = (limit != null && limit > 0) ? Math.min(from + limit, result.size()) : result.size();
        return ResponseEntity.ok(result.subList(from, to));
    }

    /** Calories burned for an activity (weight in lb, duration in minutes) via API Ninjas. */
    @GetMapping("/calories")
    public ResponseEntity<?> calories(
            @RequestParam String activity,
            @RequestParam(required = false) String weight,
            @RequestParam(required = false) String duration) {

        if (!calorieClient.isConfigured()) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "Exercise calories API key not configured",
                    "hint", "Set EXERCISE_API_KEY in the backend environment."));
        }
        try {
            return ResponseEntity.ok(calorieClient.caloriesBurned(activity, weight, duration));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Calories API request failed: " + e.getMessage()));
        }
    }

    private boolean matches(Object field, String filter, boolean contains) {
        if (filter == null || filter.isBlank()) return true;
        if (field == null) return false;
        String f = field.toString().toLowerCase();
        String q = filter.toLowerCase().trim();
        return contains ? f.contains(q) : f.equals(q);
    }
}
