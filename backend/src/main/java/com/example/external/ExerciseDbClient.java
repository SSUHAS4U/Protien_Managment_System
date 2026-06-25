package com.example.external;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.InputStream;
import java.util.*;

/**
 * Builds the exercise catalogue. Combines:
 *  - animated exercises from the free, keyless ExerciseDB OSS API (gifUrl), and
 *  - a curated local dataset (exercises.json) for breadth and reliability.
 * Everything is normalized to one shape and cached in memory.
 *
 * Normalized item: { name, gifUrl, bodyPart, target, equipment, instructions[] }
 */
@Component
public class ExerciseDbClient {

    private final RestClient restClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private volatile List<Map<String, Object>> cache;

    // Map the curated dataset's "muscle" values onto ExerciseDB body-part taxonomy
    // so a single body-part filter works across both sources.
    private static final Map<String, String> MUSCLE_TO_BODYPART = Map.ofEntries(
            Map.entry("biceps", "upper arms"), Map.entry("triceps", "upper arms"),
            Map.entry("forearms", "lower arms"), Map.entry("chest", "chest"),
            Map.entry("lats", "back"), Map.entry("shoulders", "shoulders"),
            Map.entry("quadriceps", "upper legs"), Map.entry("hamstrings", "upper legs"),
            Map.entry("glutes", "upper legs"), Map.entry("calves", "lower legs"),
            Map.entry("abdominals", "waist"));

    public ExerciseDbClient(RestClient.Builder builder,
                            @Value("${exercisedb.base-url:https://oss.exercisedb.dev/api/v1}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    /** Cached, merged, normalized catalogue (ExerciseDB animated + curated local). */
    public List<Map<String, Object>> catalogue() {
        if (cache != null) return cache;
        synchronized (this) {
            if (cache != null) return cache;
            List<Map<String, Object>> merged = new ArrayList<>();
            Set<String> seen = new HashSet<>();
            for (Map<String, Object> e : fetchExerciseDb()) {
                if (seen.add(((String) e.get("name")).toLowerCase())) merged.add(e);
            }
            for (Map<String, Object> e : loadLocal()) {
                if (seen.add(((String) e.get("name")).toLowerCase())) merged.add(e);
            }
            cache = merged;
            return merged;
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchExerciseDb() {
        try {
            Map<String, Object> resp = restClient.get()
                    .uri(u -> u.path("/exercises").queryParam("limit", 25).build())
                    .retrieve().body(Map.class);
            List<Map<String, Object>> data = (List<Map<String, Object>>) resp.get("data");
            if (data == null) return List.of();
            List<Map<String, Object>> out = new ArrayList<>();
            for (Map<String, Object> ex : data) {
                out.add(normalize(
                        (String) ex.get("name"),
                        (String) ex.get("gifUrl"),
                        first((List<String>) ex.get("bodyParts")),
                        first((List<String>) ex.get("targetMuscles")),
                        first((List<String>) ex.get("equipments")),
                        (List<String>) ex.get("instructions")));
            }
            return out;
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<Map<String, Object>> loadLocal() {
        try (InputStream in = new ClassPathResource("exercises.json").getInputStream()) {
            List<Map<String, Object>> raw = mapper.readValue(in, new TypeReference<>() {});
            List<Map<String, Object>> out = new ArrayList<>();
            for (Map<String, Object> ex : raw) {
                String muscle = String.valueOf(ex.get("muscle"));
                String type = String.valueOf(ex.get("type"));
                String bodyPart = "cardio".equalsIgnoreCase(type) ? "cardio"
                        : MUSCLE_TO_BODYPART.getOrDefault(muscle, muscle);
                out.add(normalize(
                        (String) ex.get("name"), null, bodyPart, muscle,
                        (String) ex.get("equipment"),
                        List.of(String.valueOf(ex.get("instructions")))));
            }
            return out;
        } catch (Exception e) {
            return List.of();
        }
    }

    private Map<String, Object> normalize(String name, String gifUrl, String bodyPart,
                                          String target, String equipment, List<String> instructions) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("name", name);
        m.put("gifUrl", gifUrl);
        m.put("bodyPart", bodyPart);
        m.put("target", target);
        m.put("equipment", equipment);
        m.put("instructions", instructions == null ? List.of() : instructions);
        return m;
    }

    private String first(List<String> list) {
        return (list == null || list.isEmpty()) ? null : list.get(0);
    }
}
