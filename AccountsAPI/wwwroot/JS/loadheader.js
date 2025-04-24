document.addEventListener("DOMContentLoaded", function () {
    fetch('/HTML/Templates/header.html')
        .then(response => response.text())
        .then(data => {
            // console.log("header content", data);
            document.getElementById('header-placeholder').innerHTML = data;
        });
});