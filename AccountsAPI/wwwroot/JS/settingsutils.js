let userId;

document.addEventListener("DOMContentLoaded", function() {
    DisplayUsername();
    DisplayAreaCode();
    ChangeAreaCode();
    DeleteAccount();
    ChangeUsername();
    ValidateMatch();

    const newNameInput = document.getElementById("newName");
    const confirmNameInput = document.getElementById("confirmName");
    newNameInput.addEventListener("input", ValidateMatch);
    confirmNameInput.addEventListener("input", ValidateMatch);

    userId = localStorage.getItem("userId");
});

function DisplayUsername(){
    const username = localStorage.getItem("username");
    if (username){
        const usernameCont = document.getElementById("usernameCont");
        usernameCont.textContent = `${username}`;
    } else {
        console.log("No username found.");
    }
}

function DisplayAreaCode(){
    const areacode = localStorage.getItem("areacode");
    if (areacode) {
        const areacodeMessage = document.getElementById("areacodeMessage");
        areacodeMessage.textContent = `${areacode}`; 
    } else {
        console.log("No area code found.");
    }
}

//function to handle account deletion
function DeleteAccount(){
    document.getElementById("deleteAccountBtn").addEventListener("click", async function(){
        if (confirm("Are you sure you want to delete your account?")){
            try {
                const response = await fetch("/Accounts/Delete", {
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
                    window.location.href = "/Home";
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

async function ChangeUsername(){
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
                    const response = await fetch("/Accounts/Edit/Username", {
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

async function ChangeAreaCode(){
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
                    const response = await fetch("/Accounts/Edit/AreaCode", {
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

function ValidateMatch(){
    const newNameInput = document.getElementById("newName");
    const confirmNameInput = document.getElementById("confirmName");
    const warningMessage = document.getElementById("warningMessage");

    if (newNameInput.value !== confirmNameInput.value){
        warningMessage.style.display = "block";
        newNameBtn.disabled = true;
    } else {
        warningMessage.style.display = "none";
        newNameBtn.disabled = false;
    }
}
