package com.chalang_backend;

import com.chalang_backend.exam.Exam;
import com.chalang_backend.exam.ExamRepo;
import com.chalang_backend.opportunity.Opportunity;
import com.chalang_backend.opportunity.OpportunityRepo;
import com.chalang_backend.resource.Resource;
import com.chalang_backend.resource.ResourceRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final OpportunityRepo opportunityRepo;
    private final ExamRepo examRepo;
    private final ResourceRepo resourceRepo;

    public DatabaseInitializer(OpportunityRepo opportunityRepo, ExamRepo examRepo, ResourceRepo resourceRepo) {
        this.opportunityRepo = opportunityRepo;
        this.examRepo = examRepo;
        this.resourceRepo = resourceRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (opportunityRepo.count() == 0) {
            opportunityRepo.save(new Opportunity(
                "Google Summer of Code 2026", 
                "Google", 
                "Work with global open-source organizations on real-world projects and get paid while contributing to impactful software.", 
                "Open to students", 
                "https://summerofcode.withgoogle.com", 
                "15 June 2026", 
                "Internship", 
                "Admin"
            ));
            opportunityRepo.save(new Opportunity(
                "Microsoft Learn Student Ambassadors", 
                "Microsoft", 
                "Join a global student program to build technical skills, organize events, and collaborate with Microsoft.", 
                "Open to students", 
                "https://studentambassadors.microsoft.com/", 
                "31 December 2026", 
                "Fellowship / Community", 
                "Admin"
            ));
            opportunityRepo.save(new Opportunity(
                "Amazon Future Engineer Internship", 
                "Amazon", 
                "Internship opportunity for students interested in software development and real-world industry experience.", 
                "Open to students", 
                "https://www.amazonfutureengineer.com/", 
                "15 July 2026", 
                "Internship", 
                "Admin"
            ));
            opportunityRepo.save(new Opportunity(
                "Meta Hacker Cup", 
                "Meta", 
                "Competitive programming contest by Meta with exciting prizes and global recognition.", 
                "Open to all", 
                "https://www.facebook.com/codingcompetitions/hacker-cup", 
                "30 November 2026", 
                "Competition / Coding", 
                "Admin"
            ));
            opportunityRepo.save(new Opportunity(
                "Smart India Hackathon", 
                "Government of India", 
                "National-level hackathon where students solve real-world government and industry problems.", 
                "Indian Students", 
                "https://www.sih.gov.in/", 
                "30 September 2026", 
                "Hackathon", 
                "Admin"
            ));
        }

        if (examRepo.count() == 0) {
            examRepo.save(new Exam(
                "JEE Main", 
                "National engineering entrance exam for NITs and IIITs.", 
                "12th PCM", 
                "Online", 
                "National", 
                "January 2026", 
                "https://jeemain.nta.nic.in"
            ));
            examRepo.save(new Exam(
                "NEET UG", 
                "Medical entrance examination for MBBS, BDS and allied courses.", 
                "12th PCB", 
                "Offline", 
                "National", 
                "February 2026", 
                "https://neet.nta.nic.in"
            ));
            examRepo.save(new Exam(
                "UPSC Civil Services", 
                "Prestigious civil services examination for IAS, IPS and IFS.", 
                "Graduation", 
                "Offline", 
                "National", 
                "March 2026", 
                "https://upsc.gov.in"
            ));
            examRepo.save(new Exam(
                "GATE", 
                "Graduate Aptitude Test in Engineering for M.Tech and PSU jobs.", 
                "Engineering Degree", 
                "Online", 
                "National", 
                "August 2026", 
                "https://gate2026.iitr.ac.in"
            ));
        }

        if (resourceRepo.count() == 0) {
            resourceRepo.save(new Resource(
                "C++ Complete Notes", 
                "Programming", 
                "Comprehensive C++ notes covering basics, OOP, STL, DSA concepts, pointers, file handling, and advanced programming topics.", 
                "https://www.learncpp.com/"
            ));
            resourceRepo.save(new Resource(
                "Web Development Roadmap", 
                "Web Development", 
                "Complete frontend and backend roadmap including HTML, CSS, JavaScript, React, Node.js, Flask, databases, deployment, and projects.", 
                "https://roadmap.sh/full-stack"
            ));
            resourceRepo.save(new Resource(
                "Python for Beginners", 
                "Programming", 
                "Learn Python programming from scratch including variables, loops, functions, OOP, modules, APIs, and projects.", 
                "https://www.python.org/about/gettingstarted/"
            ));
            resourceRepo.save(new Resource(
                "Data Structures & Algorithms Sheet", 
                "DSA", 
                "Top coding interview problems covering arrays, linked lists, trees, graphs, DP, recursion, and advanced DSA patterns.", 
                "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
            ));
        }
    }
}
