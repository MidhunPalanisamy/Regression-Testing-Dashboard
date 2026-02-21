package com.example.rtd_be.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "test_cases")
@Data
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    
    private String module;
    
    private Double duration;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @ManyToOne
    @JoinColumn(name = "build_id")
    private Build build;

    public enum Status {
        PASS, FAIL, BLOCKED, PENDING
    }
}
