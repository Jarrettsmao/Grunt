document.addEventListener("DOMContentLoaded", function() {
    submitForm();
});

async function submitForm(){
    const form = document.getElementById("signupForm");

    if (form){
        form.addEventListener("submit", async function (event){
            event.preventDefault();

            const submitButton = document.getElementById("signupBtn");
            submitButton.disabled = true;

            const formData = {
                id: "",
                email: document.getElementById("email").value,
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            };
            
            try {
                const response = await fetch("https://localhost:8080/Accounts/SignUpReq", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
    
                if (response.ok) {
                    const result = await response.json();
                    alert(`User created with ID: ${result.id}`);
                    window.location.href = "/Accounts/Login";
                    
                } else {
                    // If email already in use, the backend should return a specific message
                    const error = await response.json();
                    if (error.message === "Email in use") {
                        alert("The email is already in use. Please try a different one.");
                    } else {
                        alert('Error signing up!');
                    }
                } 
            } catch (error) {
                console.error("Error signing up:", error);
                alert("An error occurred while signing up.");
            } finally {
                submitButton.disabled = false;
            }
        });
    }
    
}

