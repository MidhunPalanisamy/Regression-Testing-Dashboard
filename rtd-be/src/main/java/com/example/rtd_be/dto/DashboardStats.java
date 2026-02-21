package com.example.rtd_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalBuilds;
    private long totalTestCases;
    private long passedTests;
    private long failedTests;
    private double passPercentage;
}
