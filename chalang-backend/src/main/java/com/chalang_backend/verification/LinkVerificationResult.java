package com.chalang_backend.verification;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "verification_results")
public class LinkVerificationResult {

    public enum VerificationStatus {
         SAFE, SUSPICIOUS, UNSAFE, UNREACHABLE, UNKNOWN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @Enumerated(EnumType.STRING)
    private VerificationStatus status;

    private int safetyScore;
    private String safetyGrade;

    private boolean isReachable;
    private boolean isHttps;
    private boolean hasSslCertificate;
    private boolean isDomainTrusted;
    private boolean isBlacklisted;
    private int httpStatusCode;
    private long responseTimeMs;

    private String domain;
    private String domainAgeCategory;
    private boolean isKnownJobPortal;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "verification_warning_flags", joinColumns = @JoinColumn(name = "result_id"))
    @Column(name = "flag")
    private List<String> warningFlags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "verification_positive_signals", joinColumns = @JoinColumn(name = "result_id"))
    @Column(name = "positive_signal")
    private List<String> positiveSignals = new ArrayList<>();

    private LocalDateTime verifiedAt;
    private String verifiedBy;

    public LinkVerificationResult() {
        this.verifiedAt = LocalDateTime.now();
    }

    public static LinkVerificationResult unreachable(String url) {
        LinkVerificationResult r = new LinkVerificationResult();
        r.setUrl(url);
        r.setStatus(VerificationStatus.UNREACHABLE);
        r.setSafetyScore(0);
        r.setSafetyGrade("F");
        r.setReachable(false);
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    public String getUrl() { 
        return url; 
    }

    public void setStatus(VerificationStatus status) { 
        this.status = status;
    }
    public VerificationStatus getStatus() {
        return status; 
    }

    public void setSafetyScore(int safetyScore) { 
        this.safetyScore = safetyScore;
    }
    public int getSafetyScore() { 
        return safetyScore;
    }

    public void setSafetyGrade(String safetyGrade) { 
        this.safetyGrade = safetyGrade; 
    }
    public String getSafetyGrade() { 
        return safetyGrade;
    }
    
    public void setReachable(boolean reachable) { 
        isReachable = reachable; 
    }
    public boolean isReachable() { 
        return isReachable;
    }

    public void setHttps(boolean https) { 
        isHttps = https; 
    }
    public boolean isHttps() { 
        return isHttps; 
    }

    public void setHasSslCertificate(boolean hasSslCertificate) { 
        this.hasSslCertificate = hasSslCertificate;
    }
    public boolean isHasSslCertificate() { 
        return hasSslCertificate;
    }

    public void setDomainTrusted(boolean domainTrusted) { 
        isDomainTrusted = domainTrusted;
    }
    public boolean isDomainTrusted() {
        return isDomainTrusted;
    }

    public void setBlacklisted(boolean blacklisted) { 
        isBlacklisted = blacklisted;
    }
    public boolean isBlacklisted() { 
        return isBlacklisted; 
    }

    public void setHttpStatusCode(int httpStatusCode) { 
        this.httpStatusCode = httpStatusCode;
    }
    public int getHttpStatusCode() {
        return httpStatusCode;
    }

    public void setResponseTimeMs(long responseTimeMs) { 
        this.responseTimeMs = responseTimeMs;
    }
    public long getResponseTimeMs() { 
        return responseTimeMs; 
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }
    public String getDomain() { 
        return domain;
    }

    public void setDomainAgeCategory(String domainAgeCategory) { 
        this.domainAgeCategory = domainAgeCategory;
    }
    public String getDomainAgeCategory() { 
        return domainAgeCategory;
    }

    public void setKnownJobPortal(boolean knownJobPortal) { 
        isKnownJobPortal = knownJobPortal;
    }
    public boolean isKnownJobPortal() { 
        return isKnownJobPortal; 
    }

    public void setWarningFlags(List<String> warningFlags) { 
        this.warningFlags = warningFlags;
    }
    public List<String> getWarningFlags() { 
        return warningFlags;
    }

    public void setPositiveSignals(List<String> positiveSignals) { 
        this.positiveSignals = positiveSignals;
    }
    public List<String> getPositiveSignals() {
        return positiveSignals;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) { 
        this.verifiedAt = verifiedAt;
    }
    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy; 
    }
    public String getVerifiedBy() { 
        return verifiedBy;
    }
}
