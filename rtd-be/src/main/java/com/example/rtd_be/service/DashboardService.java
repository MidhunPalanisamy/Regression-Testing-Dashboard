package com.example.rtd_be.service;

import com.example.rtd_be.dto.DashboardStats;
import com.example.rtd_be.model.TestCase;
import com.example.rtd_be.repository.BuildRepository;
import com.example.rtd_be.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final BuildRepository buildRepository;
    private final TestCaseRepository testCaseRepository;
    
    public DashboardStats getStats() {
        long totalBuilds = buildRepository.count();
        long totalTestCases = testCaseRepository.count();
        long passedTests = testCaseRepository.countByStatus(TestCase.Status.PASS);
        long failedTests = testCaseRepository.countByStatus(TestCase.Status.FAIL);
        
        double passPercentage = totalTestCases > 0 ? (passedTests * 100.0 / totalTestCases) : 0;
        
        return new DashboardStats(totalBuilds, totalTestCases, passedTests, failedTests, passPercentage);
    }
}
