document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", loginSubmit);
});

async function loginSubmit(event){
    event.preventDefault();

    const formData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    }

    const response = await fetch("https://localhost:8080/Accounts/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const result = await response.json();
        alert(`Login Successful`);
    }   else {
        alert('Invalid username or password!');
    }
}