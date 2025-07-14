//Initial shown reviews
const initialReviewCount = 2;

document.addEventListener("DOMContentLoaded", function() {
    getUserReviews();
    // DeleteReview();
});

async function DeleteReview(button){
    reviewId = button.getAttribute("data-id"); //get review id from button's dconstata-id attribute
    restaurantId = button.getAttribute("data-restId"); //get review id from button's dconstata-id attribute

    // document.getElementById("delete-btn").addEventListener("click", async function(){
        if (confirm("Are you sure you want to delete your review?")){
            try {
                // const reviewData = {
                //     id: reviewId,
                //     // restaurantId: restaurantId
                // };

                const response = await fetch("https://localhost:8080/Reviews/Delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({id: reviewId})
                });

                if (response.ok){
                    alert("Words gone...");
                    button.closest('.review').remove();
                    // localStorage.clear();
                    // window.location.href = "https://localhost:8080/Home";
                } else {
                    alert("Failed to delete review.");
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                alert("An error occured while deleting.");
            }
        }
    // });
}

async function getUserReviews(){
   const token = localStorage.getItem("token");
    let url = new URL("https://localhost:8080/Reviews/GetReviews");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const rating = params.get("rating");
    const numReviews = params.get("numReviews");
    let type;

    if (id){
        type = "Restaurant";
        url.searchParams.append("restId", id);
    }
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok){
            const reviews = await response.json();
            displayReviews(reviews, type, rating, numReviews);
        } else {
            console.error("Failed to load reviews");
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
} 

function displayReviews(reviews, type, rating, numReviews){
    const container = document.getElementById("userReviews");

    if (reviews.length === 0){
        container.innerHTML = "<p>No reviews yet.</p>";
        return;
    }

    //this is for list for restaurant reviews
    if (type === "Restaurant"){
        fetch('/HTML/Templates/restaurantreviewtemplate.html').then(function(response) {
            return response.text();
        }).then(function(template) {
                // Set the rating and numReviews in the page
            if (rating) {
                document.querySelector('.review-rating').textContent = `⭐ ${rating}`;
            } else {
                document.querySelector('.review-rating').textContent = '⭐ N/A';
            }

            if (numReviews) {
                document.querySelector('.num-reviews').textContent = `${numReviews} reviews`;
            } else {
                document.querySelector('.num-reviews').textContent = '0 reviews';
            }

            //Show the last 'initialReviewCount' reviews
            const startingIndex = reviews.length-1;

            for (let i = startingIndex; i >= startingIndex-initialReviewCount; i--){
                const review = reviews[i];
                var reviewHTML = template;
                var rawDate = new Date(review.createdDate);
                var formattedDate = rawDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
    
                reviewHTML = reviewHTML.replace(`{{rating}}`, review.rating);
                reviewHTML = reviewHTML.replace(`{{reviewText}}`, review.reviewText);
                reviewHTML = reviewHTML.replace(`{{createdDate}}`, formattedDate);
                reviewHTML = reviewHTML.replace(`{{authorName}}`, review.authorName);
                
                if (review.reviewPhoto){
                    reviewHTML = reviewHTML.replace(`{{reviewPhoto}}`, `data:image/jpeg;base64,${review.reviewPhoto}`);
                } else {
                    reviewHTML = reviewHTML.replace('<div class="review-photo">', '<div class="review-photo" style="display:none;">');
                    reviewHTML = reviewHTML.replace('<img src="{{reviewPhoto}}" alt="Review Photo"/>', ''); // Remove the img tag
                }

                //create new div element for each review
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('reviewOuter');
                reviewElement.innerHTML = reviewHTML;

                container.appendChild(reviewElement);
            }

            //Add the "See More" button if there ar more than 3 reviews
            if (reviews.length > initialReviewCount){
                const seeMoreBtn = document.getElementById("toggleReviewBtn");
                seeMoreBtn.textContent = "Show More";
                seeMoreBtn.onclick = function(){
                    toggleReviewVisibility(reviews, template, seeMoreBtn, initialReviewCount);
                };
                // container.appendChild(seeMoreBtn);
            }
        })
        .catch(function(error) {
            console.error("Error loading review template:", error);
            container.innerHTML = "<p>There was an error loading the reviews.</p>";
        });
    } else {
        //Show number of reviews
        const numReviewsContainer = document.getElementById('num-reviews');
        numReviewsContainer.innerHTML = `I wrote <span class="goldbold">${reviews.length}</span> reviews`;

        //this is for list of user reviews
        fetch('/HTML/Templates/accountreviewtemplate.html').then(function(response) {
            return response.text();
        }).then(function(template) {
            // Show the last 'initialReviewCount' reviews

            const startingIndex = reviews.length-1;

            for (let i = startingIndex; i >= startingIndex-initialReviewCount; i--){
                const review = reviews[i];
                var reviewHTML = template;
                var rawDate = new Date(review.createdDate);
                var formattedDate = rawDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
    
                reviewHTML = reviewHTML.replace(`{{rating}}`, review.rating);
                reviewHTML = reviewHTML.replace(`{{reviewText}}`, review.reviewText);
                reviewHTML = reviewHTML.replace(`{{createdDate}}`, formattedDate);
                reviewHTML = reviewHTML.replace(`{{authorName}}`, review.authorName);
                reviewHTML = reviewHTML.replace(`{{restaurantName}}`, review.restaurantName);

                // Replace the {{id}} placeholder with the actual review ID for the delete button
                reviewHTML = reviewHTML.replace(`{{id}}`, review.id);

                if (review.reviewPhoto){
                    reviewHTML = reviewHTML.replace(`{{reviewPhoto}}`, `data:image/jpeg;base64,${review.reviewPhoto}`);
                } else {
                    reviewHTML = reviewHTML.replace('<div class="review-photo">', '<div class="review-photo" style="display:none;">');
                    reviewHTML = reviewHTML.replace('<img src="{{reviewPhoto}}" alt="Review Photo"/>', ''); // Remove the img tag
                }

                //create new div element for each review
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('reviewOuter');
                reviewElement.innerHTML = reviewHTML;

                container.appendChild(reviewElement);
            }

            // Add the "See More" button if there are more than 3 reviews
            if (reviews.length > initialReviewCount) {
                const seeMoreBtn = document.getElementById('toggleReviewBtn');

                if (!seeMoreBtn){

                }
                seeMoreBtn.textContent = "Show More";
                seeMoreBtn.onclick = function() {
                    // console.log("clicked");
                    toggleReviewVisibility(reviews, template, seeMoreBtn, initialReviewCount);
                };
                // container.appendChild(seeMoreBtn);
            }
        })
        .catch(function(error) {
            console.error("Error loading review template:", error);
            container.innerHTML = "<p>There was an error loading the reviews.</p>";
        });
    }
}

function displayAllReviews(reviews, template){
    const container = document.getElementById("userReviews");

    let startingIndex = reviews.length-2; //need to subtract an extra 1 so it is lower than the initial 3
    startingIndex = startingIndex - initialReviewCount;
    // console.log(startingIndex);
    for (let i = startingIndex; i >= 0; i--){
        const review = reviews[i];
        var reviewHTML = template;
        var rawDate = new Date(review.createdDate);
        var formattedDate = rawDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        reviewHTML = reviewHTML.replace(`{{rating}}`, review.rating);
        reviewHTML = reviewHTML.replace(`{{reviewText}}`, review.reviewText);
        reviewHTML = reviewHTML.replace(`{{createdDate}}`, formattedDate);
        reviewHTML = reviewHTML.replace(`{{authorName}}`, review.authorName);
        reviewHTML = reviewHTML.replace(`{{restaurantName}}`, review.restaurantName);

        if (review.reviewPhoto){
            reviewHTML = reviewHTML.replace(`{{reviewPhoto}}`, `data:image/jpeg;base64,${review.reviewPhoto}`);
        } else {
            reviewHTML = reviewHTML.replace('<div class="review-photo">', '<div class="review-photo" style="display:none;">');
            reviewHTML = reviewHTML.replace('<img src="{{reviewPhoto}}" alt="Review Photo"/>', ''); // Remove the img tag
        }

        //create new div element for each review
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = reviewHTML;

        container.appendChild(reviewElement);
    }
}

function toggleReviewVisibility(reviews, template, button, initialReviewCount){
    const container = document.getElementById("userReviews");
    // console.log("running");

    if (button.textContent === "Show More"){
        //change text to show less when expanding
        button.textContent = "Show Less";
        displayAllReviews(reviews, template);
    } else {
        // console.log("else");
        button.textContent = "Show More";
        //Hide extra reviews
        container.innerHTML = ""; //clear existing reviews
        const startingIndex = reviews.length-1;
        for (let i = startingIndex; i >= startingIndex-initialReviewCount; i--){
            const review = reviews[i];
            var reviewHTML = template;
            var rawDate = new Date(review.createdDate);
            var formattedDate = rawDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            reviewHTML = reviewHTML.replace(`{{rating}}`, review.rating);
            reviewHTML = reviewHTML.replace(`{{reviewText}}`, review.reviewText);
            reviewHTML = reviewHTML.replace(`{{createdDate}}`, formattedDate);
            reviewHTML = reviewHTML.replace(`{{authorName}}`, review.authorName);
            reviewHTML = reviewHTML.replace(`{{restaurantName}}`, review.restaurantName);

            if (review.reviewPhoto) {
                reviewHTML = reviewHTML.replace(`{{reviewPhoto}}`, `data:image/jpeg;base64,${review.reviewPhoto}`);
            } else {
                reviewHTML = reviewHTML.replace('<div class="review-photo">', '<div class="review-photo" style="display:none;">');
                reviewHTML = reviewHTML.replace('<img src="{{reviewPhoto}}" alt="Review Photo"/>', ''); // Remove the img tag
            }

            //create new div element for each review
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = reviewHTML;

            container.appendChild(reviewElement);
        }
    }
}