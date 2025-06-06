let canvas;

document.getElementById('clearCanvas').addEventListener('click', () => {
    clear();  // Clears the canvas
    background(255); 
});

function setup() {
    let canvasSize = 480;
    canvas = createCanvas(canvasSize, canvasSize); 
    canvas.parent('canvasWrapper');   
    background(255);
}

function draw() {
    if (mouseIsPressed) {
        stroke(0);  
        strokeWeight(3);  
        line(pmouseX, pmouseY, mouseX, mouseY); 
    }
}
