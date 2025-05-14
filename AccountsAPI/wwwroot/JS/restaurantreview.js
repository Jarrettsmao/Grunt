const stars = document.querySelectorAll('#starRating .fa-star');

// adds transitiondelay from left to right of stars
// stars.forEach(function(star, index){
//     star.style.transitionDelay = `${index * 0.05}s`;
// });

document.addEventListener("DOMContentLoaded", function() {
    SubmitReview();
    displayRestaurantName()
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

function displayRestaurantName() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('name')){
        //get the value of the 'name' parameter from URL
        const restaurantName = params.get('name');
        
        //decode the paramater in case it contains encoded characters
        decodedName = decodeURIComponent(restaurantName);

        document.getElementById('restaurantName').textContent = decodedName;
    }
}

async function SubmitReview(){
    const form = document.getElementById("reviewForm");
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

            const formData = {
                authorId: localStorage.getItem("userId"),
                authorName: localStorage.getItem("username"),
                restaurantName: decodedName,
                restaurantId: id,
                reviewText: document.getElementById("reviewText").value,
                rating: selectedRating
            }
 
            try {
                const response = await fetch("https://localhost:8080/Reviews/PostReq", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
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
            // finally {
            //     submitButton.disabled = false;
            // }
        });
    }
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