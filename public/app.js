const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
let stream;

// Initially hide canvas and show video
canvas.style.display = 'none';
video.style.display = 'block';

async function initializeCamera() {
    try {
        console.log('Initializing camera...');
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });

        // Set video source
        video.srcObject = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                console.log('Video metadata loaded');
                resolve();
            };
        });

        // Start playing video
        try {
            await video.play();
            console.log('Video playing started');
        } catch (playError) {
            console.error('Error playing video:', playError);
        }

        // Enable button once video is actually playing
        video.addEventListener('playing', () => {
            console.log('Video is now playing');
            captureBtn.disabled = false;
            console.log('Capture button enabled');
        });

        // Add a fallback to enable button after a short delay if events don't fire
        setTimeout(() => {
            if (captureBtn.disabled) {
                console.log('Enabling capture button via fallback');
                captureBtn.disabled = false;
            }
        }, 2000);

        console.log('Camera initialized successfully');
        await loadFaceModels();
    } catch (error) {
        console.error('Camera initialization failed:', error);
        alert('Error accessing camera: ' + error.message);
    }
}

async function loadFaceModels() {
    console.log('Loading face detection models...');
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);
        console.log('Face detection models loaded successfully');
    } catch (error) {
        console.error('Failed to load face detection models:', error);
        alert('Please ensure the model files exist in your /models directory');
    }
}

async function analyzeFace() {
    console.log('Starting face analysis...');
    try {
        const detection = await faceapi.detectSingleFace(
            canvas,
            new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.5
            })
        ).withFaceLandmarks();

        if (!detection) {
            console.warn('No face detected in the captured photo');
            alert('No face detected! Please ensure your face is clearly visible.');
            return false;
        }

        console.log('Face detected, calculating measurements...');
        const landmarks = detection.landmarks;
        const jaw = landmarks.getJawOutline();

        // Calculate face width
        const leftSide = [jaw[0], jaw[1], jaw[2]];
        const rightSide = [jaw[14], jaw[15], jaw[16]];

        let totalWidth = 0;
        leftSide.forEach(left => {
            rightSide.forEach(right => {
                totalWidth += Math.hypot(right.x - left.x, right.y - left.y);
            });
        });
        const faceWidth = totalWidth / 9;

        // Calculate face height
        const foreheadPoints = [landmarks.positions[19], landmarks.positions[24]];
        const chinPoints = [jaw[8], jaw[7], jaw[9]];

        let totalHeight = 0;
        foreheadPoints.forEach(top => {
            chinPoints.forEach(bottom => {
                totalHeight += Math.hypot(top.x - bottom.x, top.y - bottom.y);
            });
        });
        const faceHeight = totalHeight / 6;

        // Convert to centimeters
        const STANDARD_FACE_WIDTH_CM = 14;
        const pixelsPerCm = faceWidth / STANDARD_FACE_WIDTH_CM;

        const widthCm = faceWidth / pixelsPerCm;
        const heightCm = faceHeight / pixelsPerCm;

        // Determine face shape
        const ratio = widthCm / heightCm;
        let shape;
        if (ratio > 0.95) shape = 'Round';
        else if (ratio < 0.75) shape = 'Long';
        else if (ratio >= 0.85 && ratio <= 0.95) shape = 'Square';
        else shape = 'Oval';

        // Display results
        document.getElementById('width').textContent = widthCm.toFixed(1);
        document.getElementById('height').textContent = heightCm.toFixed(1);
        document.getElementById('shape').textContent = shape;

        // Draw landmarks
        const drawOptions = {
            drawLines: true,
            color: '#00ff00',
            lineWidth: 2
        };
        faceapi.draw.drawFaceLandmarks(canvas, detection, drawOptions);

        console.log('Face analysis completed successfully');
        return true;
    } catch (error) {
        console.error('Error during face analysis:', error);
        alert('Error analyzing face. Please try again.');
        return false;
    }
}

captureBtn.addEventListener('click', async () => {
    console.log('Capture button clicked');
    try {
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            throw new Error('Video stream not ready');
        }

        // Ensure canvas dimensions match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Capture frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Show canvas and hide video temporarily
        video.style.display = 'none';
        canvas.style.display = 'block';

        // Analyze the captured image
        const success = await analyzeFace();

        if (success) {
            // Stop the stream only if analysis succeeds
            stream.getTracks().forEach(track => track.stop());

            // Toggle buttons
            captureBtn.style.display = 'none';
            retakeBtn.style.display = 'inline-block';
        } else {
            // If analysis fails, go back to video
            video.style.display = 'block';
            canvas.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    } catch (error) {
        console.error('Error during photo capture:', error);
        alert('Error capturing photo. Please try again.');
    }
});

retakeBtn.addEventListener('click', async () => {
    console.log('Retake button clicked');
    try {
        // Clear previous capture
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';

        // Reinitialize camera
        await initializeCamera();

        // Show video
        video.style.display = 'block';

        // Reset buttons
        captureBtn.style.display = 'inline-block';
        retakeBtn.style.display = 'none';
    } catch (error) {
        console.error('Error during retake:', error);
        alert('Error retaking photo. Please refresh the page.');
    }
});

// Initialize app
initializeCamera();