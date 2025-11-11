package com.example.PBL3.config;

import com.example.PBL3.util.PassEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

//@Configuration
public class UserDetailsConfig {
//    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username("admin")
                .password("{noop}123456")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user);
    }
}
