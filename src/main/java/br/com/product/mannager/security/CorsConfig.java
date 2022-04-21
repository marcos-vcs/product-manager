package br.com.product.mannager.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        //noinspection deprecation
        registry.addMapping("/**")
                .allowedOrigins(CrossOrigin.DEFAULT_ORIGINS)
                .allowedHeaders(CrossOrigin.DEFAULT_ALLOWED_HEADERS)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT");
    }

}
