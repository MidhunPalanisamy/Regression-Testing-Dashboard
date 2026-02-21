package com.example.rtd_be.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "regression_runs")
@Data
public class RegressionRun {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "build_id", nullable = false)
    private Build build;

    private Integer totalTests;
    private Integer passed;
    private Integer failed;
    private LocalDateTime executedAt = LocalDateTime.now();
}
