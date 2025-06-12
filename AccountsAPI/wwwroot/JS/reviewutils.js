document.addEventListener("DOMContentLoaded", function() {
    GetUserReviews();
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

async function GetUserReviews(){
   const token = localStorage.getItem("token");
    let url = new URL("https://localhost:8080/Reviews/GetReviews");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
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
            DisplayReviews(reviews, type);
        } else {
            console.error("Failed to load reviews");
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
} 

function DisplayReviews(reviews, type){
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
            reviews.forEach(function(review) {
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
    
                container.innerHTML += reviewHTML;
            });
        })
        .catch(function(error) {
            console.error("Error loading review template:", error);
            container.innerHTML = "<p>There was an error loading the reviews.</p>";
        });
    } else {
        // console.log("Review #: " + reviews.length);
        const numReviewsContainer = document.getElementById('num-reviews');
        numReviewsContainer.innerHTML = `Number of Reviews: ${reviews.length}`;

        //this is for list of user reviews
        fetch('/HTML/Templates/accountreviewtemplate.html').then(function(response) {
            return response.text();
        }).then(function(template) {
            reviews.forEach(function(review) {
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
                reviewHTML = reviewHTML.replace(`{{restaurantName}}`, review.restaurantName);
                reviewHTML = reviewHTML.replace(`{{id}}`, review.id);

                if (review.reviewPhoto){
                    reviewHTML = reviewHTML.replace(`{{reviewPhoto}}`, `data:image/jpeg;base64,${review.reviewPhoto}`);
                } else {
                    reviewHTML = reviewHTML.replace('<div class="review-photo">', '<div class="review-photo" style="display:none;">');
                    reviewHTML = reviewHTML.replace('<img src="{{reviewPhoto}}" alt="Review Photo"/>', ''); // Remove the img tag
                }

                container.innerHTML += reviewHTML;
            });
        })
        .catch(function(error) {
            console.error("Error loading review template:", error);
            container.innerHTML = "<p>There was an error loading the reviews.</p>";
        });
    }
} 