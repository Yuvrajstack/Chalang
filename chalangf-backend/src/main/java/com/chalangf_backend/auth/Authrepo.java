package com.chalangf_backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Authrepo extends JpaRepository<Auth, Long> {

    Optional<Auth> findByEmail(String email);

}