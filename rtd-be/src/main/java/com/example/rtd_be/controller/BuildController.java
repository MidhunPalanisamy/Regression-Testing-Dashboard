package com.example.rtd_be.controller;

import com.example.rtd_be.dto.BuildRequest;
import com.example.rtd_be.model.Build;
import com.example.rtd_be.service.BuildService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/builds")
@RequiredArgsConstructor
public class BuildController {
    
    private final BuildService buildService;
    
    @GetMapping
    public ResponseEntity<List<Build>> getAllBuilds() {
        return ResponseEntity.ok(buildService.getAllBuilds());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Build> getBuildById(@PathVariable Long id) {
        return ResponseEntity.ok(buildService.getBuildById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<Build> createBuild(@RequestBody BuildRequest request) {
        return ResponseEntity.ok(buildService.createBuild(request));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
    public ResponseEntity<Build> updateBuild(@PathVariable Long id, @RequestBody BuildRequest request) {
        return ResponseEntity.ok(buildService.updateBuild(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBuild(@PathVariable Long id) {
        buildService.deleteBuild(id);
        return ResponseEntity.ok().build();
    }
}
