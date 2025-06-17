document.addEventListener("DOMContentLoaded", function() {
    SubmitBugReport();
});

async function SubmitBugReport() {
    const form = document.getElementById("bugForm"); // Assume your form has the id "bugForm"
    const token = localStorage.getItem("token");

    const params = new URLSearchParams(window.location.search);
    let id = null;
    if (params.has('id')) {
        id = params.get('id');
    }

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const submitButton = document.getElementById("bugBtn");

            // Check if the user is logged in (same as in your review submission)
            if (!token) {
                alert("Please login before submitting a bug report.");
                window.location.href = "/Accounts/Login";
                return;
            }

            submitButton.disabled = true;

            const bugDescription = document.getElementById("bug").value; // Assuming your textarea has the id "bugDescription"

            // Handling file upload for photos
            const photoInput = document.getElementById("bugPhoto"); // Assuming your photo input has the id "bugPhoto"
            let picture = null;
            
            const formData = new FormData();

            // resizes photo
            // if (photoInput && photoInput.files.length > 0) {
            //     const file = photoInput.files[0];
            //     const height = 350;
            //     const width = 350;

            //     // Resize the image (assuming ResizeImage is a function you have that returns a base64 string)
            //     const resizedBase64String = await ResizeImage(file, height, width);
            //     formData.append("bugPhoto", resizedBase64String);
            // }

            if (photoInput && photoInput.files.length > 0) {
                const file = photoInput.files[0];
                picture = await ConvertToBase64(file);
                // Append the photo directly without resizing
                formData.append("picture", file);
            }
            formData.append("report", bugDescription);

            try {
                const response = await fetch("https://localhost:8080/Bugs/MakeReport", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}` // Attach JWT token for authentication
                    },
                    body: formData // Send formData which includes bug details and potentially a photo
                });

                if (response.ok) {
                    const result = await response.json();
                    alert("Bug report submitted successfully!");
                    // window.location.href = "/bugs"; // Redirect to the bugs page or some other location
                    console.log("Bug report submitted.");
                } else {
                    const result = await response.json();
                    alert(`Error: ${result.message}`);
                    submitButton.disabled = false;
                }
            } catch (error) {
                console.error("Error submitting bug report:", error);
                submitButton.disabled = false;
            }
        });
    }
}

function ConvertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            // Get base64 string by splitting the result on the comma (remove the data URL part)
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        
        reader.onerror = reject;  
        reader.readAsDataURL(file); 
    });
}
