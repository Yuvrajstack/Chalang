package com.chalangf_backend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class Authcontroller {

    private final Authrepo authrepo;

    public Authcontroller(Authrepo authrepo) {
        this.authrepo = authrepo;
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<Auth> register(@RequestBody Auth user) {
        Auth savedUser = authrepo.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email,
                                        @RequestParam String password) {

        Optional<Auth> user = authrepo.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}