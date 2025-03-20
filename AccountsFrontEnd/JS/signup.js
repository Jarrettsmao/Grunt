async function submitForm(event){
    event.preventDefault();

    const formData = {
        id: "",
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
        alert('User created with ID: ${result.id}');
    }   else {
        alert('Error signing up!');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("signupForm").addEventListener("submit", submitForm);
});