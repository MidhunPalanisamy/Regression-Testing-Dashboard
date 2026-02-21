package com.example.rtd_be.dto;

import com.example.rtd_be.model.TestCase;
import lombok.Data;

@Data
public class TestCaseRequest {
    private String name;
    private String description;
    private TestCase.Status status;
    private Long buildId;
}
