package com.chalang_backend.opportunity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpportunityRepo extends JpaRepository<Opportunity, Long> {
}
