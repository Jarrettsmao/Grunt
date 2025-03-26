document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("signupForm").addEventListener("submit", submitForm);
});

async function submitForm(event){
    event.preventDefault();

    const formData = {
        id: "",
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    const response = await fetch("https://localhost:8080/Accounts/SignUp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const result = await response.json();
        alert(`User created with ID: ${result.id}`);
        // window.location.href = "accountpage.html";
        //make this redirect to the account page
    } else {
        // If email already in use, the backend should return a specific message
        const error = await response.json();
        if (error.message === "Email in use") {
            alert("The email is already in use. Please try a different one.");
        } else {
            alert('Error signing up!');
        }
    }
}

