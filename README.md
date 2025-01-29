
# Face Shape Analyzer

The Face Shape Analyzer is a Node.js application that uses the `face-api.js` library to analyze human faces. It captures a live video feed from the user's webcam, takes a photo, and measures the width, height, and shape of the face. This tool can be used for various applications, such as beauty analysis, virtual makeup, or personalized recommendations.

## Features

- **Live Video Capture**: Captures a live video feed from the user's webcam.
- **Photo Capture**: Takes a photo from the live video feed for analysis.
- **Face Detection**: Detects human faces in the captured photo.
- **Width and Height Measurement**: Calculates the width and height of the detected face.
- **Face Shape Analysis**: Determines the shape of the face (e.g., oval, round, square, etc.).
- **User-Friendly Interface**: Simple and intuitive interface for interacting with the webcam and viewing results.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for handling HTTP requests.
- **face-api.js**: JavaScript library for face detection and analysis.
- **HTML/CSS/JavaScript**: Frontend for user interaction and display.
- **WebRTC**: For accessing the user's webcam and capturing live video.

## Installation

Follow these steps to set up the Face Shape Analyzer on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dhruvil-kathiriya/Face-Shape-Analyze.git
   cd Face-Shape-Analyze
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Download face-api.js Models**:
   - Download the required models from the [face-api.js repository](https://github.com/justadudewhohacks/face-api.js).
   - Place the models in the `models` directory.

4. **Run the Application**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Allow the application to access your webcam when prompted.
3. Position your face within the video frame and click the "Capture Photo" button to take a photo.
4. The application will detect the face, measure its width and height, and determine the face shape.
5. View the results displayed on the screen.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push your branch and submit a pull request.

## Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) for providing an excellent face detection library.
- [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) for backend development.
- [WebRTC](https://webrtc.org/) for enabling live video capture.

## Contact

For any questions or feedback, feel free to reach out:

- **Name**: Dhruvil Kathiriya
- **GitHub**: [dhruvil-kathiriya](https://github.com/dhruvil-kathiriya)

---

Enjoy analyzing face shapes with the Face Shape Analyzer! 😊
