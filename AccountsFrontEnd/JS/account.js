document.addEventListener("DOMContentLoaded", function() {
    displayWelcomeMessage();
    setupDeleteAccountButton();
    changeUsername();
    validateMatch();

    const newNameInput = document.getElementById("newName");
    const confirmNameInput = document.getElementById("confirmName");
    newNameInput.addEventListener("input", validateMatch);
    confirmNameInput.addEventListener("input", validateMatch);
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
                    window.location.href = "home.html";
                } else {
                    alert("Failed to delete account.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occured while deleting.");
            }
        }
    });
}

async function changeUsername(){
    document.getElementById("changeNameForm").addEventListener("submit", async function(){
        event.preventDefault();
        if (confirm("Are you sure you want to change your username?")){
            const newName = document.getElementById("newName").value;
            // const confirmName =  document.getElementById("confirmName").value;

            // if (newName === confirmName){
            const formData = {
                id: localStorage.getItem("userId"),
                username: newName
            };
            
            try {
                const response = await fetch("https://localhost:8080/Accounts/Edit/Username", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok){
                    const result = await response.json();
                    localStorage.removeItem("username");
                    localStorage.setItem("username", newName);
                    alert("Username changed successfully! Reload page for it to take affect.");
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }

            } catch (error){
                console.error("Error changing username.", error);
                alert("An error ocurred while changing username.");
            }
            // } else {
            //     alert("Usernames do not match!");
            // }
        }
    });
}

function validateMatch(){
    const newNameInput = document.getElementById("newName");
    const confirmNameInput = document.getElementById("confirmName");
    const warningMessage = document.getElementById("warningMessage");

    if (newNameInput.value !== confirmNameInput.value){
        warningMessage.style.display = "block";
        submitBtn.disabled = true;
    } else {
        warningMessage.style.display = "none";
        submitBtn.disabled = false;
    }
}