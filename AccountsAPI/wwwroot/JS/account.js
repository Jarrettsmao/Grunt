let userId;
let username;

document.addEventListener("DOMContentLoaded", function() {
    CheckToken();

    const userInfo = GetUserInfoFromToken();
    userId = userInfo.id;
    username = userInfo.username;
    localStorage.setItem("userId", userInfo.id);
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("areacode", userInfo.areacode);

    DisplayWelcomeMessage();
});

async function CheckToken(){
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
function DisplayWelcomeMessage() {
    const username = localStorage.getItem("username"); // Retrieve username
    if (username) {
        const welcomeMessage = document.getElementById("welcomeMessage");
         welcomeMessage.innerHTML = `UGG! <span class="username">${username}</span> Here! Good!`; 
    } else {
        console.log("Username not found.");
    }
}

function GetUserInfoFromToken(){
    const token = localStorage.getItem("token");
    if (!token){
        return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));

    // console.log(payload.nameid);
    // console.log(payload.unique_name);
    // console.log(payload.area_code);
    return {
        id: payload.nameid,
        username: payload.unique_name,
        areacode: payload.area_code
    };
}