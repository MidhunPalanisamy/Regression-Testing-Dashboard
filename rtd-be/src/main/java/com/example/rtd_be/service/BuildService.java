package com.example.rtd_be.service;

import com.example.rtd_be.dto.BuildRequest;
import com.example.rtd_be.model.Build;
import com.example.rtd_be.repository.BuildRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildService {
    
    private final BuildRepository buildRepository;
    
    public List<Build> getAllBuilds() {
        return buildRepository.findAll();
    }
    
    public Build getBuildById(Long id) {
        return buildRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Build not found"));
    }
    
    public Build createBuild(BuildRequest request) {
        Build build = new Build();
        build.setVersion(request.getVersion());
        build.setDescription(request.getDescription());
        if (request.getCreatedAt() != null) {
            build.setCreatedAt(request.getCreatedAt());
        }
        return buildRepository.save(build);
    }
    
    public Build updateBuild(Long id, BuildRequest request) {
        Build build = getBuildById(id);
        build.setVersion(request.getVersion());
        build.setDescription(request.getDescription());
        return buildRepository.save(build);
    }
    
    public void deleteBuild(Long id) {
        buildRepository.deleteById(id);
    }
}
