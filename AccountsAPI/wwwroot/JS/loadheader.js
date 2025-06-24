document.addEventListener("DOMContentLoaded", function () {
    fetch('/HTML/Templates/header.html')
        .then(response => response.text())
        .then(data => {
            // console.log("header content", data);
            document.getElementById('header-placeholder').innerHTML = data;

            const token = localStorage.getItem("token");

            // Get references to elements
            const navLinks = document.getElementById('nav-links');
            const loginLink = document.getElementById('loginLink');
            const accountDropdown = document.getElementById('accountDropdown');
            const dropDown = document.getElementById('dropDown');
        
            if (navLinks) {
                if (token) {
                    // Show Account dropdown and hide Login/Signup
                    loginLink.style.display = 'none';
                    signupLink.style.display = 'none';
                } else {
                    // Show Login/Signup links and hide Account dropdown
                    loginLink.style.display = 'inline-block';
                    signupLink.style.display = 'inline-block';
                    dropDown.style.display = 'none';
                }
            }
        })
        .catch(function(error){
            console.error("Failed to load header:", error);
        });
});

function toggleDropdown() {
    const dropdown = document.getElementById("accountDropdown");
    if (dropdown) {
        console.log("dropdown");
        dropdown.classList.toggle("show");
    } else {
        console.log("Dropdown not found");
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.account')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        // var i;
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
    
    }
}

// Function to show border when clicked
function showBorder(button) {
    // Add border color when clicked
    button.style.border = "solid 5rem #ffde59";
    
    // Optionally remove the border after a short delay (e.g., 2 seconds)
    setTimeout(() => {
        button.style.border = "none";
    }, 2000); // Adjust the duration to how long you want the border to stay visible
}