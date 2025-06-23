package com.pekka.moni.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsFilterConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:4173");
        corsConfiguration.addAllowedOrigin("http://localhost:31773"); // NodePort
        corsConfiguration.addAllowedOrigin("http://localhost:8081"); // NodePort
        corsConfiguration.addAllowedOrigin("http://localhost:8081/login"); // NodePort
        corsConfiguration.addAllowedOrigin("http://localhost:8081/register"); // NodePort
        corsConfiguration.addAllowedOriginPattern("http://localhost:31773/**"); // NodePort
        corsConfiguration.addAllowedOriginPattern("http://localhost:31777/**"); // NodePort
        corsConfiguration.addAllowedOriginPattern("http://localhost:8081/**"); // NodePort
        corsConfiguration.addAllowedOriginPattern("http://localhost:4173/**");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
