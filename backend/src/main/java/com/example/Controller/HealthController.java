package com.example.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Lightweight, dependency-free liveness endpoint. Returns 200 instantly without
 * touching the database — ideal for Render health checks and for an UptimeRobot
 * keep-warm ping that prevents free-tier cold starts.
 */
@RestController
public class HealthController {

    @GetMapping({"/health", "/ping"})
    public Map<String, Object> health() {
        return Map.of("status", "ok", "service", "proteinpro-backend", "time", System.currentTimeMillis());
    }
}
