let userId;
let username;

document.addEventListener("DOMContentLoaded", function() {
    CheckToken();

    const userInfo = GetUserInfoFromToken();
    userId = userInfo.id;
    username = userInfo.username;

    DisplayWelcomeMessage();
    DeleteAccount();
    ChangeUsername();
    ValidateMatch();
    Logout();

    const newNameInput = document.getElementById("newName");
    const confirmNameInput = document.getElementById("confirmName");
    newNameInput.addEventListener("input", ValidateMatch);
    confirmNameInput.addEventListener("input", ValidateMatch);
});

async function CheckToken(){
    const token = sessionStorage.getItem("token");
    console.log(token);

    if (!token) {
        // alert("No token found, please log in.");
        window.location.href = "/Accounts/Login";
        return;
    }

    try {
        const response = await fetch(`https://localhost:8080/Accounts/ValidateToken`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Unauthorized");
        }

        const data = await response.json();
    } catch (error) {
        alert("Invalid or expired token. Please log in again.");
        sessionStorage.clear();
        window.location.href = "/Accounts/Login";
    }
}

//function to display welcome message
function DisplayWelcomeMessage() {
    // const username = localStorage.getItem("username"); // Retrieve username
    if (username) {
        const welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent = `UGG! ${username} Here! Good!`;
    } else {
        console.log("Username not found.");
    }
}

//function to handle account deletion
function DeleteAccount(){
    document.getElementById("deleteAccountBtn").addEventListener("click", async function(){
        // const userId = localStorage.getItem("userId");
        if (confirm("Are you sure you want to delete your account?")){
            try {
                const response = await fetch("https://localhost:8080/Accounts/Delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ Id: userId})
                });

                if (response.ok){
                    alert("Friend gone...");
                    sessionStorage.clear();
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

function Logout(){
    document.getElementById("logoutBtn").addEventListener("click", async function(){
        sessionStorage.clear();
        window.location.href = "/Accounts/Login";
    });
}

async function ChangeUsername(){
    const form = document.getElementById("changeNameForm");

    if (form){
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (confirm("Are you sure you want to change your username?")){
                const newName = document.getElementById("newName").value;
                // const confirmName =  document.getElementById("confirmName").value;
        
                // if (newName === confirmName){
                const formData = {
                    id: userId,
                    username: newName
                };
                
                try {
                    const response = await fetch("https://localhost:8080/Accounts/Edit/Username", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                        },
                        body: JSON.stringify(formData)
                    });
        
                    if (response.ok){
                        const result = await response.json();
                        sessionStorage.clear();
                        alert("Username changed successfully! Log in again for it to take affect.");
                        window.location.href = "/Accounts/Login";
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
        
                } catch (error){
                    console.error("Error changing username.", error);
                    alert("An error occurred while changing username.");
                }
                // } else {
                //     alert("Usernames do not match!");
                // }
            }
        });
    }
    
}

function ValidateMatch(){
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

function GetUserInfoFromToken(){
    const token = sessionStorage.getItem("token");
    if (!token){
        return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));

    // console.log(payload.nameid);
    // console.log(payload.unique_name);
    return {
        id: payload.nameid,
        username: payload.unique_name
    };
}