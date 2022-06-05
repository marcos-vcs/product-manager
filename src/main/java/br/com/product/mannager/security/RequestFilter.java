package br.com.product.mannager.security;

import br.com.product.mannager.models.User;
import br.com.product.mannager.service.UserService;
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

    UserService userService;

    public RequestFilter(UserService userService){
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{

            if(request.getRequestURI().contains("/api/product-manager") ||
               request.getRequestURI().contains("/api/client-manager") ||
               request.getRequestURI().contains("/api/supplier-manager")){

                String uid = FirebaseAuth.getInstance().verifyIdToken(request.getHeader("Authorization").split(" ")[1]).getUid();
                User user = userService.getUserByUid(uid);

                if(user != null){
                    request.setAttribute("user",user);
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
