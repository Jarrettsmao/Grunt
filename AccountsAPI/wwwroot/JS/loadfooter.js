document.addEventListener("DOMContentLoaded", function () {
    fetch('/HTML/Templates/footer.html')
        .then(response => response.text())
        .then(data => {
            // console.log("header content", data);
            document.getElementById('footer-placeholder').innerHTML = data;

            const navLinks = document.getElementById('about-link');
            const token = localStorage.getItem("token");

            if (navLinks){
                    navLinks.innerHTML = `
                    <a href="/HTML/aboutpage.html" class="about" onclick="showBorder(this)">About Grunt</a>
                    <a href="/HTML/reportbug.html" class="about" onclick="showBorder(this)">Report Bugs</a>
                    `;
            }
        })
        .catch(function(error){
            console.error("Failed to load footer:", error);
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