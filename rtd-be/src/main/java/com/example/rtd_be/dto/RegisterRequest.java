package com.example.rtd_be.dto;

import com.example.rtd_be.model.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private User.Role role;
}
