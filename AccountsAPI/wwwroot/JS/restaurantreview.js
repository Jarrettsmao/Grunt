const stars = document.querySelectorAll('#star-rating .fa-star');

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

    if (form){
        form.addEventListener("submit", async function (event){
            // console.log("translate");

            event.preventDefault();
            const translateButton = document.getElementById("translate-btn");
            const translatedForm = document.getElementById("translated-form");
            const token = localStorage.getItem("token");
            const reviewBtn = document.getElementById("review-btn");

            if (!token){
                alert("Please login before submitting a review.");
                window.location.href = "/Accounts/Login";
            }

            translateButton.disabled = true;

            console.log(document.getElementById("translateReviewText").value);

            const formData = {
                reviewText: document.getElementById("translateReviewText").value
            };

            try {
                const response = await fetch ("/Reviews/Cavemanify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                reviewText.disabled = false; // Enable textarea
                reviewBtn.disabled = false; // Enable submit button

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
    const form = document.getElementById("translated-form");
    const token = localStorage.getItem("token");

    const params = new URLSearchParams(window.location.search);
    if (params.has('id')){
        id = params.get('id');
    }

    if (form){
        form.addEventListener("submit", async function (event){
            event.preventDefault();
            
            const submitButton = document.getElementById("review-btn");

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

            if(!IsCanvasDrawn()){
                const drawingAlert = confirm("You haven't drawn anything on the canvas. Are you sure you want to submit without drawing?");

                // Check if the canvas has any drawing
                if (!drawingAlert) {
                    submitButton.disabled = false;
                    return;    
                }
            }

            const formData = new FormData();
            formData.append("authorId", localStorage.getItem("userId"));
            formData.append("authorName", localStorage.getItem("username"));
            formData.append("restaurantName", decodedName);
            formData.append("restaurantId", id);
            formData.append("reviewText", document.getElementById("reviewText").value);
            formData.append("rating", selectedRating);

            //allows for uploading photos
            // const photoInput = document.getElementById("reviewPhoto");
            // const height = 350;
            // const width = 350;
            // if (photoInput && photoInput.files.length > 0) {
            //     const file = photoInput.files[0];
            //     const resizedBase64String = await ResizeImage(file, height, width);
            //     formData.append("reviewPhoto", resizedBase64String);
            // }

            // Get canvas drawing as base64 and append it to FormData
            // const canvasData = canvas.elt.toDataURL('image/png'); // Use canvas.elt to access the raw canvas element
            // const base64String = await ConvertToBase64(canvasData);
            const base64String = await ResizeCanvasToBase64(canvas.elt, 350, 350);
            formData.append("reviewPhoto", base64String);
 
            try {
                const response = await fetch("/Reviews/PostReq", {
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

async function ResizeCanvasToBase64(originalCanvas, targetWidth, targetHeight) {
    // Create an off-screen canvas
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;

    const ctx = resizedCanvas.getContext("2d");

    // Draw the original canvas content onto the new canvas
    ctx.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);

    // Get the base64 string from the resized canvas
    const resizedDataURL = resizedCanvas.toDataURL("image/png");
    return resizedDataURL.split(',')[1]; // remove the data:image/png;base64, part
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

function IsCanvasDrawn(){
    console.log("checking canvas");
    loadPixels();
    const pixelsData = pixels;

    //loop through the pixels to check if non-background data exists
    for (let i = 0; i < pixelsData.length; i += 4) {
        const r = pixelsData[i];     // Red channel
        const g = pixelsData[i + 1]; // Green channel
        const b = pixelsData[i + 2]; // Blue channel
        const a = pixelsData[i + 3]; // Blue channel

        // If any pixel is different from white return true
        if (r !== 255 || g !== 255 || b !== 255 && a !==0) {
            return true; 
        }
    }
    return false;
}

//made to resize images from upload
// async function ResizeImage(file, width, height) {
//     // First, convert the file to a base64 string using the existing ConvertToBase64 function
//     const base64String = await ConvertToBase64(file);

//     return new Promise((resolve, reject) => {
//         const img = new Image(); 
//         img.src = `data:image/jpeg;base64,${base64String}`

//         img.onload = function () { 
//             const canvas = document.createElement("canvas"); 
//             const ctx = canvas.getContext("2d");  

//             canvas.width = width;  
//             canvas.height = height; 

//             ctx.drawImage(img, 0, 0, width, height);  

//             const resizedBase64String = canvas.toDataURL("image/jpeg");  
//             resolve(resizedBase64String.split(',')[1]);  
//         };

//         img.onerror = reject;  
//     });
// }


