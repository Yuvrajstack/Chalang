package com.chalang_backend.verification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LinkVerificationRequest {
    @NotBlank(message = "URL must not be blank")
    @Pattern(
        regexp = "^(https?://).*",
        message = "URL must start with http:// or https://"
    )
    private String url;

    private String submittedBy;
    private String context;

    public LinkVerificationRequest() {}

    public LinkVerificationRequest(String url, String submittedBy, String context) {
        this.url = url;
        this.submittedBy = submittedBy;
        this.context = context;
    }

    public void setUrl(String url) { 
        this.url = url; 
    }
    public String getUrl() { 
        return url; 
    }
    public void setSubmittedBy(String submittedBy) { 
        this.submittedBy = submittedBy; 
    }
    public String getSubmittedBy() { 
        return submittedBy; 
    }
    public void setContext(String context) { 
        this.context = context;
    }
    public String getContext() { 
        return context;
    }
}
