package com.chalang_backend.opportunity;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OpportunityService {

    private final OpportunityRepo opportunityRepo;

    public OpportunityService(OpportunityRepo opportunityRepo) {
        this.opportunityRepo = opportunityRepo;
    }

    public Opportunity createOpportunity(Opportunity opportunity) {
        return opportunityRepo.save(opportunity);
    }

    public List<Opportunity> getAllOpportunities() {
        return opportunityRepo.findAll();
    }

    public Optional<Opportunity> getOpportunityById(Long id) {
        return opportunityRepo.findById(id);
    }

    public boolean deleteOpportunity(Long id) {
        if (opportunityRepo.existsById(id)) {
            opportunityRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Opportunity> updateOpportunity(Long id, Opportunity opportunityDetails) {
        return opportunityRepo.findById(id).map(opportunity -> {
            opportunity.setTitle(opportunityDetails.getTitle());
            opportunity.setCompany(opportunityDetails.getCompany());
            opportunity.setDescription(opportunityDetails.getDescription());
            opportunity.setEligibility(opportunityDetails.getEligibility());
            opportunity.setLink(opportunityDetails.getLink());
            opportunity.setDeadline(opportunityDetails.getDeadline());
            opportunity.setCategory(opportunityDetails.getCategory());
            opportunity.setPostedBy(opportunityDetails.getPostedBy());
            return opportunityRepo.save(opportunity);
        });
    }
}
