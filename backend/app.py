from flask import Flask, request, jsonify
import pickle
import pandas as pd
import re
from flask_cors import CORS

app = Flask(__name__)

# Load your .pkl files for movie data and similarity matrix
movie_list = pickle.load(open("../artifacts/movie_list.pkl", "rb"))
similarity = pickle.load(open("../artifacts/similarity.pkl", "rb"))

# Function to clean and normalize movie names (lowercase and remove special characters)
def normalize_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'[-_]', '', text)  # Remove hyphens and underscores
    return text

# Function to get movie recommendations
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
        recommended_movies = [movie_list.iloc[i[0]]['title'] for i in movie_distances[1:6]]  # Exclude the movie itself
        
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
