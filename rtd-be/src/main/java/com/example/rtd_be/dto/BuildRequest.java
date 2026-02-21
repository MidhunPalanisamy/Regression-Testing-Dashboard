package com.example.rtd_be.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BuildRequest {
    private String version;
    private String description;
    private LocalDateTime createdAt;
}
