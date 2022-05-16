package br.com.product.mannager.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class RequestFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{

            if(request.getRequestURI().contains("/api/product-manager") || !(request.getRequestURI().contains("/api/user")) ){

                String uid = FirebaseAuth.getInstance().verifyIdToken(request.getHeader("Authorization").split(" ")[1]).getUid();

                if(uid != null){
                    filterChain.doFilter(request, response);
                }else{
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                }
            }else{
                filterChain.doFilter(request, response);
            }

        }catch (RuntimeException | FirebaseAuthException e){
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

}
