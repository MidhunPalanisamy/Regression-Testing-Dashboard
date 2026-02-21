package com.example.rtd_be.dto;

import lombok.Data;

@Data
public class TestResultImport {
    private String testCaseName;
    private String module;
    private String status;
    private Double duration;
}
