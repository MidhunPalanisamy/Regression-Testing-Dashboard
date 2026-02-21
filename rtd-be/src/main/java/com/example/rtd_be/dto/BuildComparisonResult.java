package com.example.rtd_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BuildComparisonResult {
    private String testCaseName;
    private String module;
    private String build1Status;
    private String build2Status;
    private Double build1Duration;
    private Double build2Duration;
    private String statusChange;
    private Double durationChange;
}
