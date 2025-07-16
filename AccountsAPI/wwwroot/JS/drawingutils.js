let canvas;

function setup() {
    let canvasSize = 500;
    canvas = createCanvas(canvasSize, canvasSize); 
    canvas.parent('canvas-wrapper');   
    background(255);

    // Create the Clear Drawing button inside the canvas
    clearButton = createButton('Clear Drawing');
    clearButton.parent('canvas-wrapper');  // Position button inside canvas area
    clearButton.mousePressed(() => {
        clear();  // Clears the canvas
        background(255); // Set background to white
    });

    clearButton.style('position', 'absolute');  // Ensure button is fixed in the canvas area

    clearButton.style('right', '10px');  // 10px from the right edge of the canvas
    clearButton.style('bottom', '10px'); // 10px from the bottom edge of the canvas
}

function draw() {
    if (mouseIsPressed) {
        stroke(0);  
        strokeWeight(3);  
        line(pmouseX, pmouseY, mouseX, mouseY); 
    }
}
