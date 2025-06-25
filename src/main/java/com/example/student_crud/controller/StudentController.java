package com.example.student_crud.controller;

import com.example.student_crud.model.Student;
import com.example.student_crud.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Add this import for using Map
import java.util.Optional;

@RestController
@RequestMapping("/students")
public class StudentController {

	@Autowired
	private StudentService studentService;

	// Get all students
	@GetMapping
	public List<Student> getAllStudents() {
		return studentService.getAllStudents();
	}

	// Get student by ID
	@GetMapping("/{id}")
	public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
		Optional<Student> student = studentService.getStudentById(id);
		return student.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	// Create or update student
	@PostMapping
	public ResponseEntity<Object> saveStudent(@RequestBody Student student) {
		// Check if a student with the same email already exists
		Optional<Student> existingStudent = studentService.getStudentByEmail(student.getEmail());

		if (existingStudent.isPresent()) {
			// Return a BAD_REQUEST response with a message
			return new ResponseEntity<>(
					Map.of("message", "A student with this email already exists. Please use a different email."),
					HttpStatus.BAD_REQUEST);
		}

		try {
			// Save student to database
			studentService.saveStudent(student);
			// Return a success message with the student details
			return new ResponseEntity<>(Map.of("message", "Student created successfully.", "student", student),
					HttpStatus.CREATED);
		} catch (Exception e) {
			// Handle unexpected server errors
			return new ResponseEntity<>(
					Map.of("message", "An error occurred while creating the student. Please try again."),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Delete student by ID
	@DeleteMapping("/{id}")
	public void deleteStudent(@PathVariable Long id) {
		studentService.deleteStudent(id);
	}

	@PutMapping("/{id}/graduate")
	public ResponseEntity<Student> updateGraduationStatus(@PathVariable Long id, @RequestParam boolean graduate) {
		try {
			Student updatedStudent = studentService.updateGraduationStatus(id, graduate);
			return ResponseEntity.ok(updatedStudent);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// Delete all students
	@DeleteMapping
	public ResponseEntity<Void> deleteAllStudents() {
		studentService.deleteAllStudents();
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	// Update student by ID
	@PutMapping("/{id}")
	public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
		Student updatedStudent = studentService.updateStudent(id, student);
		return ResponseEntity.ok(updatedStudent);
	}
}
