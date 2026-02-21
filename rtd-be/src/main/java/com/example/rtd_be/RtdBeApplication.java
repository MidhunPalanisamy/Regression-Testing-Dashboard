package com.example.rtd_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RtdBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(RtdBeApplication.class, args);
		System.out.println("DB URL = " + System.getenv("DB_URL"));
	}

}
