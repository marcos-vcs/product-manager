package br.com.product.mannager.security;

import br.com.product.mannager.provider.Firebase;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class RequestFilter extends OncePerRequestFilter {

    Firebase firebase;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            /*if(request.getRequestURI().contains("/api/product-manager")){
                User user = firebase.getUserByToken(request.getHeader("Authorization"));
            }else{
                filterChain.doFilter(request, response);
            }*/

            filterChain.doFilter(request, response);

        }catch (RuntimeException e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

}
