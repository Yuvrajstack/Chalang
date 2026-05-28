package com.chalang_backend.browser;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BrowserLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String status; // ALLOW / WARN / BLOCK
    private LocalDateTime timestamp = LocalDateTime.now();

    public BrowserLog() {}

    public BrowserLog(String url, String status) {
        this.url = url;
        this.status = status;
    }

    public Long getId() { return id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
}