package com.example.student_crud.repository;

import com.example.student_crud.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Add method to find a student by email
    Optional<Student> findByEmail(String email);
}
