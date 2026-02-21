package com.example.rtd_be.service;

import com.example.rtd_be.model.Build;
import com.example.rtd_be.model.RegressionRun;
import com.example.rtd_be.model.TestCase;
import com.example.rtd_be.repository.BuildRepository;
import com.example.rtd_be.repository.RegressionRunRepository;
import com.example.rtd_be.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegressionRunService {
    
    private final RegressionRunRepository regressionRunRepository;
    private final TestCaseRepository testCaseRepository;
    private final BuildRepository buildRepository;
    
    public List<RegressionRun> getAllRuns() {
        return regressionRunRepository.findAll();
    }
    
    public List<RegressionRun> getRunsByBuild(Long buildId) {
        return regressionRunRepository.findByBuildIdOrderByExecutedAtDesc(buildId);
    }
    
    public RegressionRun executeRegressionRun(Long buildId) {
        Build build = buildRepository.findById(buildId)
                .orElseThrow(() -> new RuntimeException("Build not found"));
        
        List<TestCase> testCases = testCaseRepository.findByBuildId(buildId);
        
        int total = testCases.size();
        int passed = (int) testCases.stream().filter(tc -> tc.getStatus() == TestCase.Status.PASS).count();
        int failed = (int) testCases.stream().filter(tc -> tc.getStatus() == TestCase.Status.FAIL).count();
        
        RegressionRun run = new RegressionRun();
        run.setBuild(build);
        run.setTotalTests(total);
        run.setPassed(passed);
        run.setFailed(failed);
        
        return regressionRunRepository.save(run);
    }
}
