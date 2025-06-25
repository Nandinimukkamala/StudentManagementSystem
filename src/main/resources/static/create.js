const apiUrl = "http://localhost:8080/students"; // Adjust the URL based on your backend setup

document.addEventListener("DOMContentLoaded", function () {
    const createStudentForm = document.getElementById("createStudentForm");

    // Handle form submission to create a new student
    createStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent the form from submitting normally

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const course = document.getElementById("course").value;
		const graduate = document.getElementById("graduate").value;

        const studentData = { name, email, course,graduate};

        // Check if the student exists (check email)
        checkIfStudentExists(studentData);
    });

    // Function to check if the student already exists (based on email)
    async function checkIfStudentExists(studentData) {
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            
            const students = await response.json();
            console.log("Fetched students:", students);

            const studentExists = students.some(student => student.email === studentData.email);
            console.log("Student exists check result:", studentExists);  

            if (studentExists) {
                alert('A student with this email already exists. Please use a different email.');
            } else {
                createStudent(studentData);
            }
        } catch (error) {
            console.error("Error checking student:", error);
            alert('Error checking student existence');
        }
    }

    // Function to create a new student
    async function createStudent(studentData) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            });

            if (response.ok) {
                const result = await response.json();  // Expecting a JSON response
                alert(`${result.message} Name: ${result.student.name}, Email: ${result.student.email}`);  // Alert the success message
                window.location.href = "index.html";  // Redirect to the main page after creating the student
            } else {
                const errorText = await response.text();
                console.error("Error response text:", errorText);
                alert(`Error creating student: ${errorText}`);
            }
        } catch (error) {
            console.error("Error creating student:", error);
            alert('Error creating student');
        }
    }
});
