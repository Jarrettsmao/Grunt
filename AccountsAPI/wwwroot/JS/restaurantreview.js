const stars = document.querySelectorAll('#starRating .fa-star');

// adds transitiondelay from left to right of stars
// stars.forEach(function(star, index){
//     star.style.transitionDelay = `${index * 0.05}s`;
// });

document.addEventListener("DOMContentLoaded", function() {
    TranslateReview();
    SubmitReview();
    DisplayRestaurantName()
});

let selectedRating = 0;
let prevRating = 0;

let decodedName;
let restaurantId;

stars.forEach(function(star) {
    star.addEventListener('mouseover', function() {
        const value = star.getAttribute('data-value'); //this is the data value of the selected star-rating
        HighlightStars(value, false);
    });

    star.addEventListener('mouseout', function() {
        star.classList.remove('hovered');
        HighlightStars(selectedRating, false);
    })

    star.addEventListener('click', function(){
        selectedRating = star.getAttribute('data-value');

        if (selectedRating === prevRating){
            selectedRating = 0;
            prevRating = 0;
        } else {
            prevRating = selectedRating;
        }
        
        HighlightStars(selectedRating, true);
        console.log("Submitted Rating: " + selectedRating);
    })
});

function DisplayRestaurantName() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('name')){
        //get the value of the 'name' parameter from URL
        const restaurantName = params.get('name');
        
        //decode the paramater in case it contains encoded characters
        decodedName = decodeURIComponent(restaurantName);

        document.getElementById('restaurantName').textContent = decodedName;
    }
}

async function TranslateReview(){
    const form = document.getElementById("reviewForm");
    const translatedForm = document.getElementById("translatedForm");
    const token = localStorage.getItem("token");

    if (form){
        form.addEventListener("submit", async function (event){

            event.preventDefault();
            const translateButton = document.getElementById("translateBtn");

            if (!token){
                alert("Please login before submitting a review.");
                window.location.href = "/Accounts/Login";
            }

            translateButton.disabled = true;

            const formData = {
                reviewText: document.getElementById("translateReviewText").value
            };

            try {
                const response = await fetch ("https://localhost:8080/Reviews/Cavemanify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                reviewText.disabled = false; // Enable textarea
                reviewBtn.disabled = false;          // Enable submit button

                if (response.ok) {
                    document.getElementById('reviewText').value = result.cavemanReview;
                } else {
                    alert(result.message);
                } 
            } catch (error){
                console.error('Error:', error);
            }
        });
    }
}

async function SubmitReview(){
    const form = document.getElementById("translatedForm");
    const token = localStorage.getItem("token");

    const params = new URLSearchParams(window.location.search);
    if (params.has('id')){
        id = params.get('id');
    }

    if (form){
        form.addEventListener("submit", async function (event){
            event.preventDefault();
            
            const submitButton = document.getElementById("reviewBtn");

            if (selectedRating === 0){
                const ratingError = document.getElementById("ratingError");
                if (ratingError) {
                    ratingError.style.display = "block";
                }
                return; // Prevent form submission
            } else {
                const ratingError = document.getElementById("ratingError");
                if (ratingError) {
                    ratingError.style.display = "none";
                }
            }

            if (!token){
                alert("Please login before submitting a review.");
                window.location.href = "/Accounts/Login";
            }

            submitButton.disabled = true;

            const formData = new FormData();
            formData.append("authorId", localStorage.getItem("userId"));
            formData.append("authorName", localStorage.getItem("username"));
            formData.append("restaurantName", decodedName);
            formData.append("restaurantId", id);
            formData.append("reviewText", document.getElementById("reviewText").value);
            formData.append("rating", selectedRating);

            const photoInput = document.getElementById("reviewPhoto");
            const height = 350;
            const width = 350;
            if (photoInput && photoInput.files.length > 0) {
                const file = photoInput.files[0];
                const resizedBase64String = await ResizeImage(file, height, width);
                formData.append("reviewPhoto", resizedBase64String);
            }
 
            try {
                const response = await fetch("https://localhost:8080/Reviews/PostReq", {
                    method: "POST",
                    headers: {
                        // "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok){
                    const result = await response.json();
                    alert("Review submitted successfully!");
                    window.location.href = `/restaurants/page?id=${id}&name=${encodeURIComponent(decodedName)}`;
                    console.log("review submitted.");
                }
            } catch (error) {
                console.error("Error submitting review:", error);
                submitButton.disabled = false
            } 
        });
    }
}

function ConvertToBase64(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function HighlightStars(rating, isSelect) {
    stars.forEach(function(star) {
        const value = star.getAttribute('data-value'); //if change data-value to int can remove parseint
        if (isSelect){
            if(value <= rating){
                star.classList.remove('hovered', 'selected');

                star.classList.add('selected');
            } else {
                star.classList.remove('hovered', 'selected');
            }
        } else {
            if(value <= rating){
                star.classList.add('hovered');
            }
        }
    });
}

async function ResizeImage(file, width, height) {
    // First, convert the file to a base64 string using the existing ConvertToBase64 function
    const base64String = await ConvertToBase64(file);

    return new Promise((resolve, reject) => {
        const img = new Image(); 
        img.src = `data:image/jpeg;base64,${base64String}`

        img.onload = function () { 
            const canvas = document.createElement("canvas"); 
            const ctx = canvas.getContext("2d");  

            canvas.width = width;  
            canvas.height = height; 

            ctx.drawImage(img, 0, 0, width, height);  

            const resizedBase64String = canvas.toDataURL("image/jpeg");  
            resolve(resizedBase64String.split(',')[1]);  
        };

        img.onerror = reject;  
    });
}


