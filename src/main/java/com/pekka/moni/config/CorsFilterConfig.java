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

             corsConfiguration.setAllowedOrigins(List.of(
                     "http://localhost:4173",
                     "http://localhost:8081",
                     "http://localhost:8080",
                     "http://localhost:80",
                     "http://moni-be:8080",
                     "http://localhost:31773" // NodePort direct access
                     ));
             corsConfiguration.setAllowCredentials(true);
             corsConfiguration.addAllowedHeader("*");
             corsConfiguration.addAllowedMethod("*");

             UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
             source.registerCorsConfiguration("/**", corsConfiguration);

             return source;
         }
     }
