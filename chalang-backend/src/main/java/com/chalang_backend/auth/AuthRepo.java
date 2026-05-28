package com.chalang_backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepo extends JpaRepository<Auth, Long> {
    Optional<Auth> findByEmail(String email);
}
