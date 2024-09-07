const video = document.getElementById('video');
const ascii = document.getElementById('ascii');

// Ask for access to the user's webcam
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();
  processVideo();
}).catch((err) => {
  console.error("Error accessing camera: ", err);
});

function processVideo() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  function drawAscii() {
    // Adjust canvas dimensions to a smaller resolution for ASCII conversion
    canvas.width = video.videoWidth / 10;
    canvas.height = video.videoHeight / 10;

    // Draw the current frame of the video to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get pixel data from the frame
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let asciiImage = '';
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Convert the pixel color to grayscale
      const avg = (r + g + b) / 3;

      // Map grayscale value to a character
      asciiImage += avg > 128 ? '#' : ' ';

      // Add a new line after each row of pixels
      if ((i / 4) % canvas.width === canvas.width - 1) {
        asciiImage += '\n';
      }
    }

    // Output the ASCII image to the pre element
    ascii.textContent = asciiImage;

    // Keep processing frames
    requestAnimationFrame(drawAscii);
  }

  // Start processing
  drawAscii();
}
