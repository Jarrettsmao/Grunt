document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem("username"); // Retrieve username

    if (username) {
        const welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent = `UGG! ${username} Here! Good!`;
    } else {
        console.log("Username not found in localstorage.");
    }
});
