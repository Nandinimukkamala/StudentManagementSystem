const apiUrl = "http://localhost:8080/students"; // Adjust the URL based on your backend setup

// Function to load all students
function loadStudents() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            return response.json();
			
        })
        .then(students => {
            const studentsList = document.getElementById("studentsList");
            studentsList.innerHTML = ''; // Clear the existing table rows

            if (students.length > 0) {
                // Display the table rows if there are students
                students.forEach(student => {
                    const tr = document.createElement("tr");
                    tr.classList.add('student-item');

                    // Add student details in table format
                    tr.innerHTML = `
                        <td><input type="checkbox" class="student-checkbox" data-id="${student.id}" /></td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.course}</td>
						<td>${student.graduate}</td>
                    `;
                    studentsList.appendChild(tr);
                });

                // Add event listeners to checkboxes for selection
                document.querySelectorAll('.student-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', toggleActionButtons); // Listen for checkbox changes
                });
            } else {
                // If no students, show a message
                studentsList.innerHTML = '<tr><td colspan="4">No students found.</td></tr>';
            }

            toggleActionButtons(); // Ensure the action buttons are correctly displayed
        })
        .catch(error => {
            console.error("Error fetching students:", error);
            alert('Error loading students');
        });
}

// Function to toggle the visibility of action buttons based on selected students
function toggleActionButtons() {
    const selectedStudents = document.querySelectorAll(".student-checkbox:checked");

    const editBtn = document.getElementById("editBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    // If at least one student is selected, show the Edit and Delete buttons
    if (selectedStudents.length > 0) {
        editBtn.classList.remove("hidden");
        deleteBtn.classList.remove("hidden");
    } else {
        editBtn.classList.add("hidden");
        deleteBtn.classList.add("hidden");
    }
}

// Function to delete selected students
function deleteSelectedStudent() {
    const selectedStudentIds = Array.from(document.querySelectorAll(".student-checkbox:checked"))
                                     .map(checkbox => checkbox.getAttribute("data-id"));

    if (selectedStudentIds.length === 0) {
        alert('No students selected');
        return;
    }

    // Get names of students to be deleted before making delete request
    Promise.all(selectedStudentIds.map(id => fetch(`${apiUrl}/${id}`).then(response => response.json())))
	
        .then(students => {
            // Confirm before deleting
            if (confirm(`Are you sure you want to delete the selected students?`)) {
                // Delete students
                Promise.all(selectedStudentIds.map(id => {
                    return fetch(`${apiUrl}/${id}`, {
                        method: "DELETE"
                    });
                }))
                .then(() => {
                    loadStudents(); // Reload the list after deleting students
                    
                    // Alert with student names after successful deletion
                    const deletedNames = students.map(student => student.name).join(', ');
                    alert(`${deletedNames} deleted successfully`);
                })
                .catch(error => {
                    console.error("Error deleting students:", error);
                    alert('Error deleting students');
                });
            }
        })
        .catch(error => {
            console.error("Error fetching student details:", error);
            alert('Error fetching student details for deletion');
        });
}

document.addEventListener("DOMContentLoaded", function () {
    // Load all students on page load
    loadStudents();

    // Show edit form when clicking "Edit Selected Students"
    document.getElementById('editBtn').addEventListener('click', function () {
        const selectedStudentIds = Array.from(document.querySelectorAll(".student-checkbox:checked"))
                                         .map(checkbox => checkbox.getAttribute("data-id"));

        if (selectedStudentIds.length !== 1) {
            alert('Please select only one student to edit');
            return;
        }

        // Redirect to the edit page with the student ID
        const studentId = selectedStudentIds[0];
        window.location.href = `edit.html?id=${studentId}`;
    });

    // Delete selected student(s) when clicking "Delete Selected Students"
    document.getElementById('deleteBtn').addEventListener('click', deleteSelectedStudent);

    // Redirect to create.html when clicking "Create New Student"
    document.getElementById('createBtn').addEventListener('click', function() {
        window.location.href = 'create.html';  // Navigate to create.html page
    });
});
