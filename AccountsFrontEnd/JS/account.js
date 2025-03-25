document.addEventListener("DOMContentLoaded", function() {
    displayWelcomeMessage();
    setupDeleteAccountButton();
});

//function to display welcome message
function displayWelcomeMessage() {
    const username = localStorage.getItem("username"); // Retrieve username
    if (username) {
        const welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent = `UGG! ${username} Here! Good!`;
    } else {
        console.log("Username not found in localstorage.");
    }
}

//function to handle account deletion
function setupDeleteAccountButton(){
    document.getElementById("deleteAccountBtn").addEventListener("click", async function(){
        const userId = localStorage.getItem("userId");
        if (confirm("Are you sure you want to delete your account?")){
            try {
                const response = await fetch("https://localhost:8080/Accounts/Delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ Id: localStorage.getItem("userId")})
                });

                if (response.ok){
                    alert("Friend gone...");
                    localStorage.removeItem("username");
                    localStorage.removeItem("userId");
                    window.location.href = "login.html";
                } else {
                    alert("Failed to delete account.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occured while deleting.")
            }
        }
    });
}