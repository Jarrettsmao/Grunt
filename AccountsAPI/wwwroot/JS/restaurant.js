const stars = document.querySelectorAll('#starRating .fa-star');

// adds transitiondelay from left to right of stars
// stars.forEach(function(star, index){
//     star.style.transitionDelay = `${index * 0.05}s`;
// });

const ratingValue = document.getElementById('ratingValue'); //this is the number rating value
let selectedRating = 0;
let prevRating = 0;

stars.forEach(function(star) {
    star.addEventListener('mouseover', function() {
        const value = parseInt(star.getAttribute('data-value')); //this is the data value of the selected star-rating
        // clearHover();
        highlightStars(value, false);
    });

    star.addEventListener('mouseout', function() {
        clearHover();
        highlightStars(selectedRating, false);
    })

    star.addEventListener('click', function(){
        selectedRating = parseInt(star.getAttribute('data-value'));

        if (selectedRating === prevRating){
            selectedRating = 0;
            prevRating = 0;
            ratingValue.textContent = '';
        } else {
            ratingValue.textContent = selectedRating;
            prevRating = selectedRating;
        }
        
        highlightStars(selectedRating, true);
        console.log("Submitted Rating: " + selectedRating);
    })
});

function highlightStars(rating, isSelect) {
    stars.forEach(function(star) {
        const value = parseInt(star.getAttribute('data-value')); //if change data-value to int can remove parseint
        // star.classList.remove('selected', 'hovered');
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

    // if (select) {
    //     stars.forEach(function(star) {
    //         const value = parseInt(star.getAttribute('data-value')); //if change data-value to int can remove parseint
    //         star.classList.toggle('selected', value <= rating);
    //     })
    // } else {
    //     stars.forEach(function(star) {
    //         const value = parseInt(star.getAttribute('data-value')); //if change data-value to int can remove parseint
    //         star.classList.toggle('hovered', value <= rating);
    //     })
    // }
}

function clearHover(){
    stars.forEach(function(star) {
        star.classList.remove('hovered');
    });
}