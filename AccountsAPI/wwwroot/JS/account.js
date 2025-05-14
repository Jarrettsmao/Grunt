let userId;
let username;

document.addEventListener("DOMContentLoaded", function() {
    checkToken();

    const userInfo = getUserInfoFromToken();
    userId = userInfo.id;
    username = userInfo.username;
    localStorage.setItem("userId", userInfo.id);
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("areacode", userInfo.areacode);

    displayWelcomeMessage();
    displayAreaCode();
    changeAreaCode();
    deleteAccount();
    changeUsername();
    validateMatch();
    logout();

    const newNameInput = document.getElementById("newName");
    const confirmNameInput = document.getElementById("confirmName");
    newNameInput.addEventListener("input", validateMatch);
    confirmNameInput.addEventListener("input", validateMatch);
});

async function checkToken(){
    const token = localStorage.getItem("token");
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
        localStorage.clear();
        window.location.href = "/Accounts/Login";
    }
}

//function to display welcome message
function displayWelcomeMessage() {
    const username = localStorage.getItem("username"); // Retrieve username
    if (username) {
        const welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent = `UGG! ${username} Here! Good!`;
    } else {
        console.log("Username not found.");
    }
}

function displayAreaCode(){
    const areacode = localStorage.getItem("areacode");
    if (areacode) {
        const areacodeMessage = document.getElementById("areacodeMessage");
        areacodeMessage.textContent = `${areacode}`; 
    } else {
        console.log("No area code found.");
    }
}

//function to handle account deletion
function deleteAccount(){
    document.getElementById("deleteAccountBtn").addEventListener("click", async function(){
        // const userId = localStorage.getItem("userId");
        if (confirm("Are you sure you want to delete your account?")){
            try {
                const response = await fetch("https://localhost:8080/Accounts/Delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ Id: userId})
                });

                if (response.ok){
                    alert("Friend gone...");
                    localStorage.clear();
                    window.location.href = "https://localhost:8080/Home";
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

function logout(){
    document.getElementById("logoutBtn").addEventListener("click", async function(){
        localStorage.clear();
        window.location.href = "/Accounts/Login";
    });
}

async function changeUsername(){
    const form = document.getElementById("changeNameForm");

    if (form){
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (confirm("Are you sure you want to change your username?")){
                const newName = document.getElementById("newName").value;

                const formData = {
                    id: userId,
                    username: newName
                };
                
                try {
                    const response = await fetch("https://localhost:8080/Accounts/Edit/Username", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify(formData)
                    });
        
                    if (response.ok){
                        const result = await response.json();
                        localStorage.clear();
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

async function changeAreaCode(){
    const form = document.getElementById("changeZipForm");

    if (form){
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (confirm("Are you sure you want to change your default area code?")){
                const newZip = document.getElementById("newZip").value;

                const formData = {
                    id: userId,
                    areacode: newZip
                };
                
                try {
                    const response = await fetch("https://localhost:8080/Accounts/Edit/AreaCode", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify(formData)
                    });
        
                    if (response.ok){
                        const result = await response.json();
                        localStorage.clear();
                        alert("Zip code changed successfully! Log in again for it to take affect.");
                        window.location.href = "/Accounts/Login";
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
        
                } catch (error){
                    console.error("Error changing zip code.", error);
                    alert("An error occurred while changing zip code.");
                }
                // } else {
                //     alert("Usernames do not match!");
                // }
            }
        });
    }
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

function getUserInfoFromToken(){
    const token = localStorage.getItem("token");
    if (!token){
        return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));

    console.log(payload.nameid);
    console.log(payload.unique_name);
    console.log(payload.area_code);
    return {
        id: payload.nameid,
        username: payload.unique_name,
        areacode: payload.area_code
    };
}