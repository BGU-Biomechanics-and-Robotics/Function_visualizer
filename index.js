const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let points = [];
let angles = [];
let backgroundImage = null;

// Function to handle image upload
function uploadImage() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (file) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the uploaded image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            backgroundImage = img;
        };
    };

    reader.readAsDataURL(file);
}

// Handle drag and drop events for the canvas container
canvasContainer.addEventListener('dragover', (event) => {
    event.preventDefault();

    // Add visual feedback by applying a dotted border style
    canvasContainer.style.border = '2px dotted #000';
});

canvasContainer.addEventListener('dragleave', (event) => {
    // Reset the border style when the drag leaves the container
    canvasContainer.style.border = 'none';
});

canvasContainer.addEventListener('drop', (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file) {
        loadImage(file);
    }

    // Reset the border style after dropping
    canvasContainer.style.border = 'none';
});

// Add a click event listener to capture points
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    points.push({ x, y });

    // Draw a point on the canvas at the clicked coordinates
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    if (points.length === 2) {
        calculateAndDisplayAngle(points[0], points[1]);
        angles.push({ point1: points[0], point2: points[1] });
        points = []; // Clear points array for the next pair
    }
});


function calculateAngle(point1, point2) {
    const x1 = point1.x;
    const y1 = point1.y;
    const x2 = point2.x;
    const y2 = point2.y;

    const angleRadians = Math.atan2(y2 - y1, x2 - x1);
    const angleDegrees = (angleRadians * 180) / Math.PI;

    // Calculate the length of the line connecting the two points
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Draw lines between the points
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw the first dotted horizontal line of the same length
    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 5]); // Set line to be dotted
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + lineLength, y1);
    ctx.stroke();

    // Draw the second dotted horizontal line of the same length
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1, y1 - lineLength); // Adjust the endpoint for a horizontal line
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash

    // Draw an arc to represent the angle
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.arc(x1, y1, 50, 0, angleRadians);
    ctx.stroke();

    // Display the angle beside the arc
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`${angleDegrees.toFixed(2)}°`, x1 + 30, y1 - 30);
}

// Function to calculate and display the angle between two points
function calculateAndDisplayAngle(point1, point2, normalized = false) {
    const x1 = point1.x;
    const y1 = point1.y;
    const x2 = point2.x;
    const y2 = point2.y;

    // Calculate the angle
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);
    const angleDegrees = (angleRadians * 180) / Math.PI;

    // Calculate the length of the line connecting the two points
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Draw lines between the points
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw the first dotted horizontal line of the same length
    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 5]); // Set line to be dotted
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + lineLength, y1);
    ctx.stroke();

    // Draw the second dotted horizontal line of the same length
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1, y1 - lineLength); // Adjust the endpoint for a horizontal line
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash

    // Draw an arc to represent the angle
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.arc(x1, y1, 50, 0, angleRadians);
    ctx.stroke();

    // Display the angle beside the arc
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`${angleDegrees.toFixed(2)}°`, x1 + 30, y1 - 30);

    // Display the points
    const pointsDisplay = normalized ? document.getElementById('normalized-points-display') : document.getElementById('non-normalized-points-display');
    pointsDisplay.innerHTML = `Points on screen: (${x1.toFixed(2)}, ${y1.toFixed(2)}) and (${x2.toFixed(2)}, ${y2.toFixed(2)})`;
    angleDegrees.innerHTML = `Angle: ${angle.toFixed(2)}°`;
    // Return the calculated angle in degrees
    return angleDegrees;
}

// Function to handle normalized angle calculation
function calculateNormalizedAngle() {
    const point1X = parseFloat(document.getElementById('point1X').value);
    const point1Y = parseFloat(document.getElementById('point1Y').value);
    const point2X = parseFloat(document.getElementById('point2X').value);
    const point2Y = parseFloat(document.getElementById('point2Y').value);

    if (isNaN(point1X) || isNaN(point1Y) || isNaN(point2X) || isNaN(point2Y)) {
        alert('Please enter valid normalized coordinates.');
        return;
    }

    // Convert normalized coordinates to pixel coordinates
    const imageWidth = backgroundImage.width;
    const imageHeight = backgroundImage.height;
    const x1 = point1X * imageWidth;
    const y1 = point1Y * imageHeight;
    const x2 = point2X * imageWidth;
    const y2 = point2Y * imageHeight;

    // Calculate and display the angle
    const angle = calculateAndDisplayAngle({ x: x1, y: y1 }, { x: x2, y: y2 }, true);
    // Display the angle result
    const angleResult = document.getElementById('normalized-angle-result');
}

// Function to handle non-normalized angle calculation
function calculateCoordinates() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        alert('Please enter valid non-normalized coordinates.');
        return;
    }

    // Calculate and display the angle
    const angle = calculateAndDisplayAngle({ x: x1, y: y1 }, { x: x2, y: y2 });

    // Display the angle result
    const angleResult = document.getElementById('non-normalized-angle-result');
}


function drawPoint(x, y) {
    // Draw a point on the canvas at the specified coordinates
    ctx.fillStyle = 'purple'; // Choose a color for the points
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}



function clearCanvas() {
    points = []; // Clear the points array
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    if (backgroundImage) {
        // Redraw the uploaded image if it exists
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

