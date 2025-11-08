package com.example.PBL3.config;

import com.example.PBL3.util.JwtAuthenticationFilter;
import com.example.PBL3.util.JwtUtil;
import com.example.PBL3.util.loginSuccessHandler;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final JwtUtil  jwtUtil;
    private final loginSuccessHandler loginHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/Images/**", "/Views/**").permitAll()
                        .requestMatchers("/login", "error").permitAll()
//                        .requestMatchers(HttpMethod.GET,"/api/users/**").hasAnyRole("ADMIN", "CUSTOMER")
//                        .requestMatchers(HttpMethod.POST,"/api/users/**").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.PUT,"/api/users/**").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.DELETE,"/api/users/**").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyRole("ADMIN","SELLER","CUSTOMER")
//                        .requestMatchers("/api/products/**").hasRole("SELLER")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .permitAll()
                        .successHandler(loginHandler)
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .deleteCookies("username", "role", "token")
                        .permitAll()
                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }



}