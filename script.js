const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Access user's webcam
navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing webcam:', error);
    });

// Face detection and processing logic
async function detectAndApplyFaceFilter() {
    const faceDetector = new faceapi.TinyFaceDetectorOptions({ inputSize: 128 });
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

    setInterval(async () => {
        // Capture video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Detect faces in the video frame
        const detections = await faceapi.detectAllFaces(video, faceDetector)
            .withFaceLandmarks();

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw face filter effects
        detections.forEach(face => {
            // Apply face filter logic here (e.g., draw images, masks, etc.)
            ctx.drawImage(faceFilterImage, face.landmarks.positions[28].x, face.landmarks.positions[28].y, face.detection.box.width, face.detection.box.height);
        });
    }, 100); // Update every 100 milliseconds
}

// Load face filter image (replace 'path_to_face_filter_image.png' with the actual path)
const faceFilterImage = new Image();
faceFilterImage.src = 'path_to_face_filter_image.png';

// Call the face detection and filter function when the video is ready
video.addEventListener('play', () => {
    detectAndApplyFaceFilter();
});
