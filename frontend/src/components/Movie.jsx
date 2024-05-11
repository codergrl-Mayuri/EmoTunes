import axios from "axios";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaSpotify, FaYoutube, FaMusic } from "react-icons/fa";
import { RiMusic2Fill } from "react-icons/ri";
import neutral from "../assets/neutral.gif";
import happy from "../assets/512.gif";
import energetic from "../assets/surprise.gif";
import sad from "../assets/sad.gif";

const Movie = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [mood, setMood] = useState([]);

  const startRecording = () => {
    setIsRecording(true);
    setImage(null); // Reset the image when recording starts
    setRecommendations([]); // Reset recommendations
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const capture = async () => {
    if (!isRecording) {
      alert("Please start recording first!");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    stopRecording(); // Stop recording when capturing

    // Convert base64 image to Blob
    const blob = await fetch(imageSrc).then((res) => res.blob());

    // Create FormData object
    const formData = new FormData();
    formData.append("image", blob, "image.jpg");

    // Send the image to the backend
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setRecommendations(response.data.recommended_movie); // Assuming backend sends recommendations in an array under 'recommended_music' key
      console.log(recommendations);
      console.log(mood);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  //   console.log(recommendations)
  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-white mb-8">
        Matching your movie...
      </h1>
      <div className="w-full max-w-6xl border border-gray-600 rounded-lg overflow-hidden relative">
        <div className="relative">
          {isRecording && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              className="w-full"
            />
          )}
          <div className="text-white flex items-center ">
  {image && <img src={image} alt="Captured" className="w-1/2" />}
  <div className="text-white flex-1 w-auto">
    {recommendations && recommendations.length > 0 && (
      <>
        {recommendations[0].mood === "Happy" && <img src={happy} alt="" />}
        {recommendations[0].mood === "Calm" && <img src={neutral} alt="" />}
        {recommendations[0].mood === "Energetic" && <img src={energetic} alt="" />}
        {recommendations[0].mood === "Sad" && <img src={sad} alt="" />}
      </>
    )}
  </div>
</div>

        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-4">
            Movie Recommendations:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations && recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {recommendation.names}
                  </h4>
                  <p className="text-gray-400 mt-2">
                    <span className="font-semibold">Maturity_rating:</span>{" "}
                    {recommendation.maturity_rating}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-semibold">Year:</span>{" "}
                    {recommendation.release_year}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-semibold">duration:</span>{" "}
                    {recommendation.duration}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-semibold">Discription:</span>{" "}
                    {recommendation.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {!isRecording ? (
              <button
                className="bg-[#aa0505] text-white px-6 py-2 rounded-md shadow-lg text-lg font-medium mr-4 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                onClick={startRecording}
              >
                Start Recording
              </button>
            ) : (
              <>
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded-md shadow-lg text-lg font-medium mr-4 hover:bg-red-600"
                  onClick={capture}
                >
                  Capture
                </button>
                <button
                  className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow-lg text-lg font-medium hover:bg-yellow-600"
                  onClick={stopRecording}
                >
                  Stop Recording
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;