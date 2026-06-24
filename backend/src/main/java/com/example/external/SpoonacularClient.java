package com.example.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Thin client around the Spoonacular Food API.
 * The API key is injected from the SPOONACULAR_API_KEY environment variable and
 * is never exposed to the frontend — all calls are proxied through the backend.
 */
@Component
public class SpoonacularClient {

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
        return restClient.get()
                .uri(builder -> builder.path("/recipes/complexSearch")
                        .queryParam("apiKey", apiKey)
                        .queryParam("addRecipeNutrition", "true")
                        .queryParam("addRecipeInformation", "true")
                        .queryParam("instructionsRequired", "true")
                        .queryParam("fillIngredients", "false")
                        .queryParams(sanitize(params))
                        .build())
                .retrieve()
                .body(Map.class);
    }

    /** Full recipe information including analyzed (step-by-step) cooking instructions. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> recipeInformation(long id) {
        return restClient.get()
                .uri(builder -> builder.path("/recipes/{id}/information")
                        .queryParam("apiKey", apiKey)
                        .queryParam("includeNutrition", "true")
                        .build(id))
                .retrieve()
                .body(Map.class);
    }

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
