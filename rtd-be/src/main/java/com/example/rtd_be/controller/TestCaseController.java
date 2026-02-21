package com.example.rtd_be.controller;

import com.example.rtd_be.dto.TestCaseRequest;
import com.example.rtd_be.dto.BuildComparisonResult;
import com.example.rtd_be.model.TestCase;
import com.example.rtd_be.service.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/testcases")
@RequiredArgsConstructor
public class TestCaseController {
    
    private final TestCaseService testCaseService;
    
    @GetMapping
    public ResponseEntity<List<TestCase>> getAllTestCases() {
        return ResponseEntity.ok(testCaseService.getAllTestCases());
    }
    
    @GetMapping("/build/{buildId}")
    public ResponseEntity<List<TestCase>> getTestCasesByBuild(@PathVariable Long buildId) {
        return ResponseEntity.ok(testCaseService.getTestCasesByBuild(buildId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TestCase> getTestCaseById(@PathVariable Long id) {
        return ResponseEntity.ok(testCaseService.getTestCaseById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<TestCase> createTestCase(@RequestBody TestCaseRequest request) {
        return ResponseEntity.ok(testCaseService.createTestCase(request));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<TestCase> updateTestCase(@PathVariable Long id, @RequestBody TestCaseRequest request) {
        return ResponseEntity.ok(testCaseService.updateTestCase(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        testCaseService.deleteTestCase(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/import/{buildId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<List<TestCase>> importTestResults(
            @PathVariable Long buildId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(testCaseService.importTestResults(buildId, file));
    }
    
    @GetMapping("/compare")
    public ResponseEntity<List<BuildComparisonResult>> compareBuilds(
            @RequestParam Long build1Id,
            @RequestParam Long build2Id) {
        return ResponseEntity.ok(testCaseService.compareBuilds(build1Id, build2Id));
    }
}
