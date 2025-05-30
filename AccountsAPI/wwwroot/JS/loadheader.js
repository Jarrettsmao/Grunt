document.addEventListener("DOMContentLoaded", function () {
    fetch('/HTML/Templates/header.html')
        .then(response => response.text())
        .then(data => {
            // console.log("header content", data);
            document.getElementById('header-placeholder').innerHTML = data;

            const navLinks = document.getElementById('nav-links');
            const token = localStorage.getItem("token");

            if (navLinks){
                if (token){
                    navLinks.innerHTML = `
                    <a href="/HTML/accountpage.html" class="account" onclick="showBorder(this)">Account</a>
                    `;
                    // console.log(token);
                } else {
                    navLinks.innerHTML = `
                    <a href="/HTML/login.html" class="login" onclick="showBorder(this)">Login</a>
                    <a href="/HTML/signup.html" class="signup" onclick="showBorder(this)">Sign Up</a>
                    `;
                }
            }
        })
        .catch(function(error){
            console.error("Failed to load header:", error);
        });
});

// Function to show border when clicked
function showBorder(button) {
    // Add border color when clicked
    button.style.border = "solid 0.1rem #ffde59";
    
    // Optionally remove the border after a short delay (e.g., 2 seconds)
    setTimeout(() => {
        button.style.border = "none";
    }, 2000); // Adjust the duration to how long you want the border to stay visible
}