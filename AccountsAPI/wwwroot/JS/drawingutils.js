let canvas;

document.getElementById('clearCanvas').addEventListener('click', () => {
    clear();  // Clears the canvas
    background(255); 
});

function setup() {
    canvas = createCanvas(350, 350); 
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
