     package com.pekka.moni.config;

     import org.springframework.context.annotation.Bean;
     import org.springframework.context.annotation.Configuration;
     import org.springframework.web.cors.CorsConfiguration;
     import org.springframework.web.cors.CorsConfigurationSource;
     import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
     import org.springframework.web.filter.CorsFilter;

     import java.util.List;

     @Configuration
     public class CorsFilterConfig {

         @Bean
         public CorsConfigurationSource corsConfigurationSource() {
             CorsConfiguration corsConfiguration = new CorsConfiguration();

             // Allow origins - includes development and deployment patterns
             corsConfiguration.setAllowedOrigins(List.of(
                     // Development
                     "http://localhost:5173",  // Vite dev server
                     "http://localhost:4173",
                     "http://localhost:8081",
                     "http://localhost:8080", 
                     "http://localhost:80",
                     "http://localhost:30081",
                     "http://localhost:30080",
                     
                     // Docker Compose internal
                     "http://moni-be:8080",
                     "http://moni-fe:80",
                     
                     // NodePort access patterns
                     "http://localhost:31773"
                     ));
             
             // Add dynamic origin patterns for any EC2 instance
             corsConfiguration.setAllowedOriginPatterns(List.of(
                     "http://*.amazonaws.com:*",      // AWS hostnames
                     "http://*.*.*.*:30081",          // Any IP with frontend port
                     "http://*.*.*.*:30080",          // Any IP with backend port  
                     "http://*.*.*.*:8080",           // Development backend
                     "http://*.*.*.*:3000",           // Development frontend
                     "http://*.*.*.*"                 // Any IP (less secure, consider restricting)
                     ));
             
             // Allow credentials (cookies, authorization headers)
             corsConfiguration.setAllowCredentials(true);
             
             // Allow all headers and methods
             corsConfiguration.addAllowedHeader("*");
             corsConfiguration.addAllowedMethod("*");

             UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
             source.registerCorsConfiguration("/**", corsConfiguration);

             return source;
         }
     }
