package com.chalang_backend.auth;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final AuthRepo authRepo;

    public AuthService(AuthRepo authRepo) {
        this.authRepo = authRepo;
    }

    public Auth register(Auth user) {
        return authRepo.save(user);
    }

    public Optional<Auth> login(String email, String password) {
        return authRepo.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }
}
