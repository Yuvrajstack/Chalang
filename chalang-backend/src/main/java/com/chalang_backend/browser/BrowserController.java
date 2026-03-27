package com.chalang_backend.browser;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/browser")
public class BrowserController {

    private final BrowserRepo repo;

    public BrowserController(BrowserRepo repo) {
        this.repo = repo;
    }

   @PostMapping("/check")
public String checkUrl(@RequestBody Map<String, String> body) {

    String url = body.get("url");

    String status;

    if (url.contains("https")) {
        status = "ALLOW";
    } else if (url.contains("http")) {
        status = "WARN";
    } else {
        status = "BLOCK";
    }

    BrowserLog log = new BrowserLog(url, status);
    repo.save(log);

    return "URL Status: " + status;
}
}