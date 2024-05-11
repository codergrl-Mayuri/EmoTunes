import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { FaSpotify, FaYoutube, FaMusic } from "react-icons/fa";
import { RiMusic2Fill } from "react-icons/ri";
import neutral from "../assets/neutral.gif";
import happy from "../assets/512.gif";
import energetic from "../assets/surprise.gif";
import sad from "../assets/sad.gif";

const RecommendationPage = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [category, setCategory] = useState(null);

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
  
      console.log("Response data:", response.data); // Add this line to check the response data structure
      console.log("Mood values:", response.data.recommended_music.map((music) => music.mood));
      console.log("Mood values:", response.data.recommended_movie.map((movie) => movie.mood));
      setRecommendations({
        music: response.data.recommended_music,
        movie: response.data.recommended_movie
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };
  

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-white mb-8">
        Matching your vibe...
      </h1>
      <div className="w-full max-w-6xl border border-gray-600 rounded-lg overflow-hidden relative">
      <div className="relative" style={isRecording ? { width: '50%', height: '50%' } : {}}>
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
            {recommendations?.music?.length > 0 && (
            <>
              {recommendations.music[0]?.mood === "Happy" && <img src={happy} alt="" />}
              {recommendations.music[0]?.mood === "Calm" && <img src={neutral} alt="" />}
              {recommendations.music[0]?.mood === "Energetic" && <img src={energetic} alt="" />}
              {recommendations.music[0]?.mood === "Sad" && <img src={sad} alt="" />}
            </>
          )}
          </div>
          </div>
          <div className="text-white flex-1 w-auto">
            {image && (
              <div className="flex justify-between mb-4">
                <button
                  className="bg-[#1DB954] text-white px-6 py-2 rounded-md shadow-lg text-lg font-medium mr-4 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                  onClick={() => handleCategoryChange("music")}
                >
                  Music Recommendations
                </button>
                <text>Select any one!!</text>
                <button
                  className="bg-[#E50914] text-white px-6 py-2 rounded-md shadow-lg text-lg font-medium mr-4 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                  onClick={() => handleCategoryChange("movie")}
                >
                  Movie Recommendations
                </button>
              </div>
            )}
            {recommendations && (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {category === "music" && recommendations.music && recommendations.music.length > 0 && (
      recommendations.music.map((recommendation, index) => (
        <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {recommendation.name}
                  </h4>
                  <p className="text-gray-400 mt-2">
                    <span className="font-semibold">Artist:</span>{" "}
                    {recommendation.artist}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-semibold">Album:</span>{" "}
                    {recommendation.album}
                  </p>
                </div>
                <div className="flex justify-center mt-4">
                  <FaSpotify className="text-green-500 cursor-pointer mx-2 hover:text-green-400" />
                  <FaYoutube className="text-red-500 cursor-pointer mx-2 hover:text-red-400" />
                  <RiMusic2Fill className="text-yellow-500 cursor-pointer mx-2 hover:text-yellow-400" />
                  <FaMusic className="text-blue-500 cursor-pointer mx-2 hover:text-blue-400" />
                </div>
              </div>
      ))
    )}
    </div>
    {/* Movie Recommendations */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {category === "movie" && recommendations.movie && recommendations.movie.length > 0 && (
      recommendations.movie.map((recommendation, index) => (
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
      ))
    )}
    </div>
  </>
)}

              
          </div>
        </div>
        <div className="p-4">
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

export default RecommendationPage;
