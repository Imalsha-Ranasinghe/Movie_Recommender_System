from flask import Flask, request, jsonify
import pickle
import pandas as pd
import re
import requests
from flask_cors import CORS

app = Flask(__name__)

# Load .pkl files for movie data and similarity matrix
movie_list = pickle.load(open("../artifacts/movie_list.pkl", "rb"))
similarity = pickle.load(open("../artifacts/similarity.pkl", "rb"))

# TMDb API Key (Replace with your actual key)
TMDB_API_KEY = "9d5b918cc656cf78eaa4dc6677b2be2f"

# Function to clean and normalize movie names (lowercase and remove special characters)
def normalize_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'[-_]', '', text)  # Remove hyphens and underscores
    return text

# Function to get a movie poster from TMDb API
def get_movie_poster(movie_name):
    try:
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={movie_name}"
        response = requests.get(search_url).json()
        if response["results"]:
            poster_path = response["results"][0].get("poster_path")
            if poster_path:
                return f"https://image.tmdb.org/t/p/w500{poster_path}"
        return None
    except Exception as e:
        print(f"Error fetching poster: {e}")
        return None

# Function to get movie recommendations with posters
def recommend_movies(movie_name):
    try:
        # Normalize the input movie name and movie list titles
        normalized_movie_name = normalize_text(movie_name)
        
        # Find the movie index by matching normalized movie titles
        movie_list['normalized_title'] = movie_list['title'].apply(normalize_text)
        movie_index = movie_list[movie_list['normalized_title'] == normalized_movie_name].index

        if movie_index.empty:
            return []  # Return empty list if movie not found
        
        movie_index = movie_index[0]
        
        # Sort movies by similarity
        movie_distances = sorted(list(enumerate(similarity[movie_index])), key=lambda x: x[1], reverse=True)
        recommended_movies = [
            {
                "title": movie_list.iloc[i[0]]['title'],
                "poster": get_movie_poster(movie_list.iloc[i[0]]['title'])
            }
            for i in movie_distances[1:6]  # Exclude the movie itself
        ]
        
        return recommended_movies
    except Exception as e:
        print(f"Error: {e}")
        return []

# Allow all origins (not recommended for production)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    movie_name = data.get('movie', '')
    recommendations = recommend_movies(movie_name)
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)
