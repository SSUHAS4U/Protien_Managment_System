package com.example.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thin client around the Spoonacular Food API.
 * The API key is injected from the SPOONACULAR_API_KEY environment variable and
 * is never exposed to the frontend — all calls are proxied through the backend.
 *
 * Responses are cached in-memory with a short TTL so repeated identical
 * queries (e.g. the default recommendations shown on every page load) return
 * instantly instead of hitting the (slow, rate-limited) Spoonacular API.
 */
@Component
public class SpoonacularClient {

    private static final long TTL_MS = 30 * 60 * 1000L; // 30 minutes
    private final ConcurrentHashMap<String, Cached> cache = new ConcurrentHashMap<>();

    private final RestClient restClient;
    private final String apiKey;

    public SpoonacularClient(RestClient.Builder builder,
                             @Value("${spoonacular.api.key:}") String apiKey,
                             @Value("${spoonacular.api.base-url:https://api.spoonacular.com}") String baseUrl) {
        this.apiKey = apiKey;
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("CHANGE_ME");
    }

    /**
     * Complex recipe search with nutrition + full recipe information (incl. cooking steps).
     * Accepts an arbitrary set of Spoonacular query params (query, diet, minProtein,
     * maxCalories, sort, sortDirection, number, etc.).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> complexSearch(MultiValueMap<String, String> params) {
        MultiValueMap<String, String> clean = sanitize(params);
        return cached("search:" + clean, () -> restClient.get()
                .uri(builder -> builder.path("/recipes/complexSearch")
                        .queryParam("apiKey", apiKey)
                        .queryParam("addRecipeNutrition", "true")
                        .queryParam("addRecipeInformation", "true")
                        .queryParam("instructionsRequired", "true")
                        .queryParam("fillIngredients", "false")
                        .queryParams(clean)
                        .build())
                .retrieve()
                .body(Map.class));
    }

    /** Full recipe information including analyzed (step-by-step) cooking instructions. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> recipeInformation(long id) {
        return cached("recipe:" + id, () -> restClient.get()
                .uri(builder -> builder.path("/recipes/{id}/information")
                        .queryParam("apiKey", apiKey)
                        .queryParam("includeNutrition", "true")
                        .build(id))
                .retrieve()
                .body(Map.class));
    }

    /** Returns a cached value if fresh, otherwise loads, stores and returns it. */
    private Map<String, Object> cached(String key, java.util.function.Supplier<Map<String, Object>> loader) {
        Cached hit = cache.get(key);
        if (hit != null && System.currentTimeMillis() - hit.at < TTL_MS) {
            return hit.value;
        }
        Map<String, Object> value = loader.get();
        cache.put(key, new Cached(value, System.currentTimeMillis()));
        return value;
    }

    private record Cached(Map<String, Object> value, long at) {}

    /** Drops blank params and our reserved apiKey so callers can't override it. */
    private MultiValueMap<String, String> sanitize(MultiValueMap<String, String> params) {
        MultiValueMap<String, String> out = new LinkedMultiValueMap<>();
        if (params == null) {
            return out;
        }
        params.forEach((key, values) -> {
            if ("apiKey".equalsIgnoreCase(key)) {
                return;
            }
            for (String v : values) {
                if (v != null && !v.isBlank()) {
                    out.add(key, v);
                }
            }
        });
        return out;
    }
}
