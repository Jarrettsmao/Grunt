document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", loginSubmit);
});

async function loginSubmit(event){
    event.preventDefault();

    const formData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }

    const response = await fetch("https://localhost:8080/Accounts/LoginReq", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const result = await response.json();
        localStorage.setItem("username", result.username);
        localStorage.setItem("userId", result.id);
        console.log(localStorage.getItem("username"));
        console.log(localStorage.getItem("userId"));
        alert(`Login Successful for ${result.id}`);
        window.location.href = result.redirectUrl;
    } else {
        const error = await response.json(); // This will capture the error message sent by the backend
        alert(`${error.message}`);
    }
}