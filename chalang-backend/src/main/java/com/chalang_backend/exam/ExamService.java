package com.chalang_backend.exam;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ExamService {

    private final ExamRepo examRepo;

    public ExamService(ExamRepo examRepo) {
        this.examRepo = examRepo;
    }

    public Exam createExam(Exam exam) {
        return examRepo.save(exam);
    }

    public List<Exam> getAllExams() {
        return examRepo.findAll();
    }

    public Optional<Exam> getExamById(Long id) {
        return examRepo.findById(id);
    }

    public boolean deleteExam(Long id) {
        if (examRepo.existsById(id)) {
            examRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Exam> updateExam(Long id, Exam examDetails) {
        return examRepo.findById(id).map(exam -> {
            exam.setName(examDetails.getName());
            exam.setDescription(examDetails.getDescription());
            exam.setEligibility(examDetails.getEligibility());
            exam.setMode(examDetails.getMode());
            exam.setLevel(examDetails.getLevel());
            exam.setApplicationDate(examDetails.getApplicationDate());
            exam.setOfficialLink(examDetails.getOfficialLink());
            return examRepo.save(exam);
        });
    }
}
