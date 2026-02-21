package com.example.rtd_be.repository;

import com.example.rtd_be.model.RegressionRun;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegressionRunRepository extends JpaRepository<RegressionRun, Long> {
    List<RegressionRun> findByBuildIdOrderByExecutedAtDesc(Long buildId);
}
