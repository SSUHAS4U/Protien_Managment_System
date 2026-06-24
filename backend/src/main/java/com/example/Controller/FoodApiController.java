package com.example.Controller;

import com.example.external.SpoonacularClient;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Public food catalogue backed by Spoonacular. Replaces the old admin-managed
 * food/recommendation tables — items, macros, images and cooking steps all come
 * live from the API, so admins no longer add anything manually.
 */
@RestController
@RequestMapping("/api/foods")
public class FoodApiController {

    private final SpoonacularClient spoonacular;

    public FoodApiController(SpoonacularClient spoonacular) {
        this.spoonacular = spoonacular;
    }

    /** Free-text + filter search. All params are optional and forwarded to Spoonacular. */
    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String diet,
            @RequestParam(required = false) String intolerances,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Double minProtein,
            @RequestParam(required = false) Double maxProtein,
            @RequestParam(required = false) Double minCalories,
            @RequestParam(required = false) Double maxCalories,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(defaultValue = "12") int number) {

        if (!spoonacular.isConfigured()) {
            return apiKeyMissing();
        }

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        addIf(params, "query", query);
        addIf(params, "diet", diet);
        addIf(params, "intolerances", intolerances);
        addIf(params, "type", type);
        addIf(params, "cuisine", cuisine);
        addIf(params, "minProtein", minProtein);
        addIf(params, "maxProtein", maxProtein);
        addIf(params, "minCalories", minCalories);
        addIf(params, "maxCalories", maxCalories);
        addIf(params, "sort", sort);
        addIf(params, "sortDirection", sortDirection);
        params.add("number", String.valueOf(number));

        try {
            return ResponseEntity.ok(spoonacular.complexSearch(params));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Spoonacular request failed: " + e.getMessage()));
        }
    }

    /**
     * Curated recommendation buckets driven purely by filters.
     * Supported: high-protein, high-energy, low-fat, low-calorie, low-carb, balanced.
     */
    @GetMapping("/recommendations")
    public ResponseEntity<?> recommendations(
            @RequestParam(defaultValue = "high-protein") String filter,
            @RequestParam(required = false) String diet,
            @RequestParam(defaultValue = "12") int number) {

        if (!spoonacular.isConfigured()) {
            return apiKeyMissing();
        }

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        addIf(params, "diet", diet);
        params.add("number", String.valueOf(number));

        switch (filter.toLowerCase()) {
            case "high-protein" -> { params.add("sort", "protein"); params.add("sortDirection", "desc"); params.add("minProtein", "20"); }
            case "high-energy"  -> { params.add("sort", "calories"); params.add("sortDirection", "desc"); params.add("minCalories", "400"); }
            case "low-fat"      -> { params.add("sort", "saturated-fat"); params.add("sortDirection", "asc"); params.add("maxFat", "15"); }
            case "low-calorie"  -> { params.add("sort", "calories"); params.add("sortDirection", "asc"); params.add("maxCalories", "400"); }
            case "low-carb"     -> { params.add("sort", "carbs"); params.add("sortDirection", "asc"); params.add("maxCarbs", "20"); }
            case "balanced"     -> { params.add("sort", "healthiness"); params.add("sortDirection", "desc"); }
            default             -> { params.add("sort", "protein"); params.add("sortDirection", "desc"); }
        }

        try {
            return ResponseEntity.ok(spoonacular.complexSearch(params));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Spoonacular request failed: " + e.getMessage()));
        }
    }

    /** Full recipe detail incl. step-by-step cooking instructions and nutrition. */
    @GetMapping("/{id}")
    public ResponseEntity<?> recipe(@PathVariable long id) {
        if (!spoonacular.isConfigured()) {
            return apiKeyMissing();
        }
        try {
            return ResponseEntity.ok(spoonacular.recipeInformation(id));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Spoonacular request failed: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> apiKeyMissing() {
        return ResponseEntity.status(503).body(Map.of(
                "error", "Spoonacular API key not configured",
                "hint", "Set SPOONACULAR_API_KEY in the backend environment (.env locally, Render dashboard in prod)."));
    }

    private void addIf(MultiValueMap<String, String> params, String key, Object value) {
        if (value != null && !value.toString().isBlank()) {
            params.add(key, value.toString());
        }
    }
}
