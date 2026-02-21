package com.example.rtd_be.service;

import com.example.rtd_be.dto.TestCaseRequest;
import com.example.rtd_be.dto.TestResultImport;
import com.example.rtd_be.dto.BuildComparisonResult;
import com.example.rtd_be.model.Build;
import com.example.rtd_be.model.TestCase;
import com.example.rtd_be.repository.BuildRepository;
import com.example.rtd_be.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestCaseService {
    
    private final TestCaseRepository testCaseRepository;
    private final BuildRepository buildRepository;
    
    public List<TestCase> getAllTestCases() {
        return testCaseRepository.findAll();
    }
    
    public List<TestCase> getTestCasesByBuild(Long buildId) {
        return testCaseRepository.findByBuildId(buildId);
    }
    
    public TestCase getTestCaseById(Long id) {
        return testCaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test case not found"));
    }
    
    public TestCase createTestCase(TestCaseRequest request) {
        TestCase testCase = new TestCase();
        testCase.setName(request.getName());
        testCase.setDescription(request.getDescription());
        testCase.setStatus(request.getStatus() != null ? request.getStatus() : TestCase.Status.PENDING);
        
        if (request.getBuildId() != null) {
            Build build = buildRepository.findById(request.getBuildId())
                    .orElseThrow(() -> new RuntimeException("Build not found"));
            testCase.setBuild(build);
        }
        
        return testCaseRepository.save(testCase);
    }
    
    public TestCase updateTestCase(Long id, TestCaseRequest request) {
        TestCase testCase = getTestCaseById(id);
        testCase.setName(request.getName());
        testCase.setDescription(request.getDescription());
        testCase.setStatus(request.getStatus());
        
        if (request.getBuildId() != null) {
            Build build = buildRepository.findById(request.getBuildId())
                    .orElseThrow(() -> new RuntimeException("Build not found"));
            testCase.setBuild(build);
        }
        
        return testCaseRepository.save(testCase);
    }
    
    public void deleteTestCase(Long id) {
        testCaseRepository.deleteById(id);
    }
    
    public List<TestCase> importTestResults(Long buildId, MultipartFile file) {
        try {
            Build build = buildRepository.findById(buildId)
                    .orElseThrow(() -> new RuntimeException("Build not found"));
            
            List<TestResultImport> imports;
            String filename = file.getOriginalFilename();
            
            if (filename != null && filename.toLowerCase().endsWith(".csv")) {
                imports = parseCSV(file);
            } else if (filename != null && filename.toLowerCase().endsWith(".json")) {
                imports = parseJSON(file);
            } else {
                throw new RuntimeException("Unsupported file format. Use CSV or JSON");
            }
            
            List<TestCase> testCases = new ArrayList<>();
            for (TestResultImport imp : imports) {
                TestCase testCase = new TestCase();
                testCase.setName(imp.getTestCaseName());
                testCase.setModule(imp.getModule());
                testCase.setDuration(imp.getDuration());
                testCase.setStatus(TestCase.Status.valueOf(imp.getStatus().toUpperCase()));
                testCase.setBuild(build);
                testCases.add(testCaseRepository.save(testCase));
            }
            
            return testCases;
        } catch (Exception e) {
            throw new RuntimeException("Failed to import: " + e.getMessage(), e);
        }
    }
    
    private List<TestResultImport> parseCSV(MultipartFile file) throws Exception {
        List<TestResultImport> results = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line = reader.readLine();
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 4) {
                    TestResultImport result = new TestResultImport();
                    result.setTestCaseName(parts[0].trim());
                    result.setModule(parts[1].trim());
                    result.setStatus(parts[2].trim());
                    result.setDuration(Double.parseDouble(parts[3].trim()));
                    results.add(result);
                }
            }
        }
        return results;
    }
    
    private List<TestResultImport> parseJSON(MultipartFile file) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(file.getInputStream(), new TypeReference<List<TestResultImport>>(){});
    }
    
    public List<BuildComparisonResult> compareBuilds(Long build1Id, Long build2Id) {
        List<TestCase> build1Tests = testCaseRepository.findByBuildId(build1Id);
        List<TestCase> build2Tests = testCaseRepository.findByBuildId(build2Id);
        
        Map<String, TestCase> build1Map = build1Tests.stream()
                .collect(Collectors.toMap(TestCase::getName, tc -> tc));
        Map<String, TestCase> build2Map = build2Tests.stream()
                .collect(Collectors.toMap(TestCase::getName, tc -> tc));
        
        Set<String> allTestNames = new HashSet<>();
        allTestNames.addAll(build1Map.keySet());
        allTestNames.addAll(build2Map.keySet());
        
        List<BuildComparisonResult> results = new ArrayList<>();
        for (String testName : allTestNames) {
            TestCase tc1 = build1Map.get(testName);
            TestCase tc2 = build2Map.get(testName);
            
            String status1 = tc1 != null ? tc1.getStatus().name() : "N/A";
            String status2 = tc2 != null ? tc2.getStatus().name() : "N/A";
            Double duration1 = tc1 != null ? tc1.getDuration() : null;
            Double duration2 = tc2 != null ? tc2.getDuration() : null;
            String module = tc1 != null ? tc1.getModule() : (tc2 != null ? tc2.getModule() : "N/A");
            
            String statusChange = "SAME";
            if (!status1.equals(status2)) {
                if (status1.equals("PASS") && status2.equals("FAIL")) {
                    statusChange = "REGRESSION";
                } else if (status1.equals("FAIL") && status2.equals("PASS")) {
                    statusChange = "FIXED";
                } else {
                    statusChange = "CHANGED";
                }
            }
            
            Double durationChange = null;
            if (duration1 != null && duration2 != null) {
                durationChange = duration2 - duration1;
            }
            
            results.add(new BuildComparisonResult(
                testName, module, status1, status2, duration1, duration2, statusChange, durationChange
            ));
        }
        
        return results;
    }
}
