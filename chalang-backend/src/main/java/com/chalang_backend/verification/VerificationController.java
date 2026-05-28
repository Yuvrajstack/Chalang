package com.chalang_backend.verification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/verification")
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/verify")
    public ResponseEntity<LinkVerificationResult> verifyLink(@RequestBody LinkVerificationRequest request) {
        LinkVerificationResult result = verificationService.verifyLink(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LinkVerificationResult>> getAllResults() {
        return ResponseEntity.ok(verificationService.getAllResults());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LinkVerificationResult> getResultById(@PathVariable Long id) {
        LinkVerificationResult result = verificationService.getResultById(id);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }
}
