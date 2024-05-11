from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import logging
import base64
from base64 import b64encode, b64decode
from PIL import Image
import io
from io import BytesIO
from pymongo import MongoClient
from api import MONGO_URI, DB_NAME, COLLECTION_NAME

app = FastAPI()

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Allow requests from all origins (you can restrict this to specific origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

data_path = "/Users/seemanthrajukurapati/Documents/ml projects/music_recommendation/datasets/data_moods.csv"
music_data = pd.read_csv(data_path)

model_path = '/Users/seemanthrajukurapati/Documents/ml projects/music_recommendation/models/emotion_detection_model.h5'
model = load_model(model_path)

movie_path = "/Users/seemanthrajukurapati/Documents/ml projects/music_recommendation/datasets/netfix_cleaned.csv"
movie_data = pd.read_csv(movie_path)

limited_emotions_to_moods = {
    'angry': ['Gritty', 'Violent'],
    'disgust': ['Gritty', 'Chilling'],
    'fear': ['Scary', 'Suspenseful', 'Dark', 'Chilling'],
    'happy': ['Feel-Good', 'Romantic', 'Charming', 'Quirky'],
    'neutral': ['Neutral', 'Understated', 'Offbeat'],
    'sad': ['Sad', 'Bittersweet', 'Sentimental', 'Emotional'],
    'surprise': ['Exciting', 'Mind-Bending', 'Suspenseful', 'Gritty']
}


emotion_mapping = {
    'angry': 'Energetic',
    'disgust': 'Calm',
    'fear': 'Calm',
    'happy': 'Happy',
    'neutral': 'Calm',
    'sad': 'Sad',
    'surprise': 'Energetic'
}

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_user(email: str, username: str, password: str):
    # Check if the email already exists
    if collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Insert new user details into the database
    user_data = {"email": email, "username": username, "password": password}
    collection.insert_one(user_data)
    return user_data
    

def detect_emotion(frame):
    try:
        faces = face_cascade.detectMultiScale(frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces) == 0:
            logger.info("No faces detected.")
            return "No faces detected."

        for (x, y, w, h) in faces:
            # Extract the face region of interest (ROI)
            face_roi = frame[y:y + h, x:x + w]

            # Resize the face ROI to match the input size of the emotion detection model
            rgb_face_resized = cv2.resize(face_roi, (256, 256))

            # Preprocess the image for model prediction
            img_array = np.expand_dims(rgb_face_resized, axis=0)  # Add batch dimension
            img_array = img_array / 255.0  # Normalize to [0,1]
            img_array = (img_array * 255).astype(np.uint8)  # Convert back to integer values
            
            # Make predictions
            predictions = model.predict(img_array)
            predicted_class = np.argmax(predictions)
            predicted_emotion = list(emotion_mapping.keys())[predicted_class]
            user_mood = predicted_emotion

            return user_mood
    except Exception as e:
        logger.error(f"Error detecting emotion: {e}")
        raise HTTPException(status_code=422, detail="Error detecting emotion.")

def recommend_movie(emotion, movie_data):
    try:
        logger.info(f"Received emotion: {emotion}")
        
        # Get the corresponding moods for the given emotion
        moods_for_emotion = limited_emotions_to_moods.get(emotion.lower(), [])
        logger.info(f"Moods for emotion: {moods_for_emotion}")
        
        # Filter movies based on moods present in the mapping
        mood_filtered_movies = pd.DataFrame()
        for mood in moods_for_emotion:
            mood_filtered_movies = pd.concat([mood_filtered_movies, movie_data[movie_data['mood'].str.lower() == mood.lower()]])
        
        logger.info(f"Filtered movies count: {len(mood_filtered_movies)}")
        
        # Sort movies by release year
        mood_filtered_movies = mood_filtered_movies.sort_values(by='release_year', ascending=False)
        
        # Select specific columns for recommendation
        recommended_movies = mood_filtered_movies[['names', 'duration', 'description', 'release_year', 'maturity_rating']]
        
        # Convert DataFrame to list of dictionaries
        recommended_movies_list = recommended_movies.to_dict(orient='records')
        
        return recommended_movies_list[:5]  # Return only the first 5 recommended movies
    except Exception as e:
        logger.error(f"Error recommending movie: {e}")
        raise HTTPException(status_code=422, detail="Error recommending movie.")







def recommend_music(user_mood,music_data):
    try:
        user_mood = emotion_mapping[user_mood]
        recommended_music = music_data[music_data['mood'] == user_mood]
        recommended_music = recommended_music.sort_values(by='popularity', ascending=False).head(5)
        
        # Convert DataFrame to a list of dictionaries
        recommended_music_list = []
        for index, row in recommended_music.iterrows():
            recommended_music_list.append({
                'name': row['name'],
                'artist': row['artist'],
                'album': row['album'],
                'mood' : user_mood
            })
            
        return recommended_music_list
    except Exception as e:
        logger.error(f"Error recommending music: {e}")
        raise HTTPException(status_code=422, detail="Error recommending music.")



@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    # Read image data
    image_data = await image.read()

    # Process the image data
    try:
        image_bytes = io.BytesIO(image_data)
        img = Image.open(image_bytes)
        image_type = img.format
        img_array = np.array(img)
        frame = img_array
        image_shape = img_array.shape
        
        user_mood = detect_emotion(frame)
        print("i am in final",user_mood)
        # Get recommended music
        recommended_music = recommend_music(user_mood, music_data)
        
        # Ensure user_mood is a single string representing the dominant mood
        if isinstance(user_mood, list):
            user_mood = user_mood[0]

        # Get recommended movie
        recommended_movie = recommend_movie(user_mood, movie_data)  # Pass movie_data as an argument
        
        return {"recommended_music": recommended_music, "recommended_movie": recommended_movie}
    except Exception as e:
        print("Error processing image:", e)
        return {"message": "Error processing image."}

@app.post("/register")
async def register_new_user(email: str, username: str, password: str):
    try:
        user_data = register_user(email, username, password)
        return user_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

