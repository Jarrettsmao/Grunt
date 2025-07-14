let restaurantName;
let restaurantId;

document.addEventListener("DOMContentLoaded", function() {
    displayRestaurantInfo();
    setRedirectReviewButton();
});

function displayRestaurantInfo(){
    const params = new URLSearchParams(window.location.search);

    if (params.has('name')){
        //get the value of the 'name' parameter from URL
        restaurantName = params.get('name');
        
        //decode the paramater in case it contains encoded characters
        decodedName = decodeURIComponent(restaurantName);

        document.getElementById('restaurantName').textContent = decodedName;
    }
}

function setRedirectReviewButton(){
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')){
        restaurantId = params.get('id');
    }
    document.getElementById("reviewBtn").addEventListener("click", function (){
        
        //Construct the URL with query paramaters
        const reviewPageURL = new URL('/reviews/writereview', window.location.origin);
        reviewPageURL.searchParams.set('id', restaurantId);
        reviewPageURL.searchParams.set('name', restaurantName);

        window.location.href = reviewPageURL; 
    });
}