package com.chalang_backend.browser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BrowserRepo extends JpaRepository<BrowserLog, Long> {
}