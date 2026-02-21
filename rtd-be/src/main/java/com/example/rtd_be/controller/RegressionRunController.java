package com.example.rtd_be.controller;

import com.example.rtd_be.model.RegressionRun;
import com.example.rtd_be.service.RegressionRunService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/regression")
@RequiredArgsConstructor
public class RegressionRunController {
    
    private final RegressionRunService regressionRunService;
    
    @GetMapping
    public ResponseEntity<List<RegressionRun>> getAllRuns() {
        return ResponseEntity.ok(regressionRunService.getAllRuns());
    }
    
    @GetMapping("/build/{buildId}")
    public ResponseEntity<List<RegressionRun>> getRunsByBuild(@PathVariable Long buildId) {
        return ResponseEntity.ok(regressionRunService.getRunsByBuild(buildId));
    }
    
    @PostMapping("/execute/{buildId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<RegressionRun> executeRun(@PathVariable Long buildId) {
        return ResponseEntity.ok(regressionRunService.executeRegressionRun(buildId));
    }
}
