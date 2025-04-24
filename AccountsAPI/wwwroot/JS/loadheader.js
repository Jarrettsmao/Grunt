document.addEventListener("DOMContentLoaded", function () {
    fetch('/HTML/Templates/header.html')
        .then(response => response.text())
        .then(data => {
            // console.log("header content", data);
            document.getElementById('header-placeholder').innerHTML = data;

            const navLinks = document.getElementById('nav-links');
            const token = sessionStorage.getItem("token");

            if (navLinks){
                if (token){
                    navLinks.innerHTML = `
                    <a href="/HTML/accountpage.html">Account</a>
                    `;
                    console.log(token);
                } else {
                    navLinks.innerHTML = `
                    <a href="/HTML/login.html" class="login">Login</a>
                    <a href="/HTML/signup.html" class="signup">Sign Up</a>
                    `;
                }
            }
        })
        .catch(function(error){
            console.error("Failed to load header:", error);
        });
});