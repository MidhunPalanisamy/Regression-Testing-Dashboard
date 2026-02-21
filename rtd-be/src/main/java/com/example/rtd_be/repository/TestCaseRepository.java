package com.example.rtd_be.repository;

import com.example.rtd_be.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByBuildId(Long buildId);
    long countByStatus(TestCase.Status status);
}
