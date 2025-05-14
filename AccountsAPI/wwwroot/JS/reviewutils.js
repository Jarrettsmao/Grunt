document.addEventListener("DOMContentLoaded", function() {
    getUserReviews();
});


async function getUserReviews(){
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
            displayReviews(reviews, type);
        } else {
            console.error("Failed to load reviews");
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

function displayReviews(reviews, type){
    const container = document.getElementById("userReviews");

    if (reviews.length === 0){
        container.innerHTML = "<p>No reviews yet.</p>";
        return;
    }
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
    
                container.innerHTML += reviewHTML;
            });
        })
        .catch(function(error) {
            console.error("Error loading review template:", error);
            container.innerHTML = "<p>There was an error loading the reviews.</p>";
        });
    } else {
        //Fetch the review template HTML
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

                container.innerHTML += reviewHTML;
            });
        })
        .catch(function(error) {
            console.error("Error loading review template:", error);
            container.innerHTML = "<p>There was an error loading the reviews.</p>";
        });
    }
}