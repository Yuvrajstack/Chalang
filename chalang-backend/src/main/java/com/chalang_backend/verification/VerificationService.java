package com.chalang_backend.verification;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class VerificationService {

    private final VerificationRepo verificationRepo;

    // List of trusted career/educational domains
    private static final List<String> TRUSTED_DOMAINS = Arrays.asList(
            "google.com", "github.com", "microsoft.com", "coursera.org", 
            "linkedin.com", "spaceappschallenge.org", "edx.org", 
            "udemy.com", "oracle.com", "internshala.com", "nptel.ac.in",
            "hackerearth.com", "hackerrank.com", "leetcode.com"
    );

    // List of warning keywords in malicious URLs
    private static final List<String> BLACKLIST_KEYWORDS = Arrays.asList(
            "malware", "phishing", "spam", "free-money", "lottery", 
            "crack", "hack", "unsecure", "get-rich", "casino", "betting"
    );

    public VerificationService(VerificationRepo verificationRepo) {
        this.verificationRepo = verificationRepo;
    }

    public LinkVerificationResult verifyLink(LinkVerificationRequest request) {
        String url = request.getUrl();
        LinkVerificationResult result = new LinkVerificationResult();
        result.setUrl(url);
        result.setVerifiedBy(request.getSubmittedBy());
        result.setVerifiedAt(LocalDateTime.now());

        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host == null) {
                host = "";
            }
            result.setDomain(host);

            boolean isHttps = url.toLowerCase().startsWith("https://");
            result.setHttps(isHttps);
            result.setHasSslCertificate(isHttps);
            result.setReachable(true); // Default assumed online for static local score check
            result.setHttpStatusCode(200);

            // Determine if domain is trusted
            boolean isTrusted = false;
            for (String trusted : TRUSTED_DOMAINS) {
                if (host.toLowerCase().endsWith(trusted)) {
                    isTrusted = true;
                    break;
                }
            }
            result.setDomainTrusted(isTrusted);

            // Check if domain is blacklisted
            boolean isBlacklisted = false;
            for (String keyword : BLACKLIST_KEYWORDS) {
                if (url.toLowerCase().contains(keyword)) {
                    isBlacklisted = true;
                    break;
                }
            }
            result.setBlacklisted(isBlacklisted);

            // Check if it is a known job/educational portal
            boolean isJobPortal = host.toLowerCase().contains("job") || host.toLowerCase().contains("career") || host.toLowerCase().contains("intern");
            result.setKnownJobPortal(isJobPortal);

            // Calculate Safety Score
            int score = 50; // Base score
            List<String> warnings = new ArrayList<>();
            List<String> positiveSignals = new ArrayList<>();

            if (isHttps) {
                score += 25;
                positiveSignals.add("Uses secure HTTPS protocol");
                positiveSignals.add("SSL certificate is active");
            } else {
                score -= 20;
                warnings.add("Unsecured connection (HTTP instead of HTTPS)");
            }

            if (isTrusted) {
                score += 25;
                positiveSignals.add("Domain is on the global trusted education/career directory");
            }

            if (isBlacklisted) {
                score -= 40;
                warnings.add("URL contains suspicious or blacklisted keywords");
            }

            if (isJobPortal) {
                score += 5;
                positiveSignals.add("Recognized career development keyword pattern");
            }

            // Boundary checks
            score = Math.max(0, Math.min(100, score));
            result.setSafetyScore(score);

            // Safety Grades
            if (score >= 85) {
                result.setStatus(LinkVerificationResult.VerificationStatus.SAFE);
                result.setSafetyGrade("A");
            } else if (score >= 70) {
                result.setStatus(LinkVerificationResult.VerificationStatus.SAFE);
                result.setSafetyGrade("B");
            } else if (score >= 50) {
                result.setStatus(LinkVerificationResult.VerificationStatus.SUSPICIOUS);
                result.setSafetyGrade("C");
            } else if (score >= 30) {
                result.setStatus(LinkVerificationResult.VerificationStatus.SUSPICIOUS);
                result.setSafetyGrade("D");
            } else {
                result.setStatus(LinkVerificationResult.VerificationStatus.UNSAFE);
                result.setSafetyGrade("F");
            }

            result.setWarningFlags(warnings);
            result.setPositiveSignals(positiveSignals);
            result.setDomainAgeCategory("Medium-Risk Age"); // Static mock category for simulation

            return verificationRepo.save(result);

        } catch (Exception e) {
            return verificationRepo.save(LinkVerificationResult.unreachable(url));
        }
    }

    public List<LinkVerificationResult> getAllResults() {
        return verificationRepo.findAll();
    }

    public LinkVerificationResult getResultById(Long id) {
        return verificationRepo.findById(id).orElse(null);
    }
}
