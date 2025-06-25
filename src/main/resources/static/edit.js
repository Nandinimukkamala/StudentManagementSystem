const apiUrl = "http://localhost:8080/students"; // Adjust the URL based on your backend setup

// Get the student ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');

// Function to fetch and load the student data
function loadStudentData() {
    fetch(`${apiUrl}/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch student data');
            }
            return response.json();
        })
        .then(student => {
            // Populate the form fields with the student data
            document.getElementById('studentId').value = student.id;
            document.getElementById('name').value = student.name;
            document.getElementById('email').value = student.email;
            document.getElementById('course').value = student.course;
            document.getElementById('graduate').value = student.graduate; 
        })
        .catch(error => {
            console.error("Error fetching student data:", error);
            alert('Error loading student data');
        });
}

// Function to update the student data
function updateStudent(event) {
    event.preventDefault();

    const updatedStudent = {
        id: document.getElementById('studentId').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        graduate: document.getElementById('graduate').value 
    };

    fetch(`${apiUrl}/${studentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudent)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update student');
            }
            return response.json();
        })
        .then(student => {
            alert(`${student.name} updated successfully`); // Alert with student's name
            window.location.href = 'index.html'; // Redirect back to the main student list
        })
		
		
        .catch(error => {
            console.error("Error updating student:", error);
            alert('Error updating student');
        });
}

// Function to show the toast notification
function showToast() {
    const toast = document.createElement("div");
    toast.classList.add("toast", "show"); // Add default classes
    toast.innerText = "This is a toast notification!";
    
    toast.classList.add("success"); // You can change this to 'error' or 'info' for different types

    // Append the toast to the container
    const toastContainer = document.getElementById("toast-container");
    toastContainer.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 3000); // Wait 3 seconds before disappearing
}


document.getElementById('editStudentForm').addEventListener('submit', updateStudent);

// Load student data when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    loadStudentData();
});
