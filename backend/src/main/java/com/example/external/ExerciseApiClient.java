package com.example.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Client for the API Ninjas exercise endpoints. Powers the now API-driven
 * exercise feature (catalog with instructions + calories burned), replacing the
 * old admin-managed exercise table. The key is injected from EXERCISE_API_KEY
 * and stays server-side only.
 */
@Component
public class ExerciseApiClient {

    private final RestClient restClient;
    private final String apiKey;

    public ExerciseApiClient(RestClient.Builder builder,
                             @Value("${exercise.api.key:}") String apiKey,
                             @Value("${exercise.api.base-url:https://api.api-ninjas.com/v1}") String baseUrl) {
        this.apiKey = apiKey;
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("CHANGE_ME");
    }

    /** Exercise catalog (name, type, muscle, equipment, difficulty, instructions). */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> exercises(MultiValueMap<String, String> params) {
        return restClient.get()
                .uri(b -> b.path("/exercises").queryParams(sanitize(params)).build())
                .header("X-Api-Key", apiKey)
                .retrieve()
                .body(List.class);
    }

    /** Calories burned for an activity given weight (lb) and duration (min). */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> caloriesBurned(String activity, String weight, String duration) {
        return restClient.get()
                .uri(b -> {
                    b.path("/caloriesburned").queryParam("activity", activity);
                    if (weight != null && !weight.isBlank()) b.queryParam("weight", weight);
                    if (duration != null && !duration.isBlank()) b.queryParam("duration", duration);
                    return b.build();
                })
                .header("X-Api-Key", apiKey)
                .retrieve()
                .body(List.class);
    }

    private MultiValueMap<String, String> sanitize(MultiValueMap<String, String> params) {
        MultiValueMap<String, String> out = new LinkedMultiValueMap<>();
        if (params == null) return out;
        params.forEach((key, values) -> {
            for (String v : values) {
                if (v != null && !v.isBlank()) out.add(key, v);
            }
        });
        return out;
    }
}
