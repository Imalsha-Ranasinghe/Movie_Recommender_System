from flask import Flask, request, jsonify
import pickle
import os
import requests
from flask_cors import CORS

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

# Replace with your GitHub RAW URLs (Ensure LFS is enabled for large files)
MOVIE_LIST_URL = "https://raw.githubusercontent.com/Imalsha-Ranasinghe/Movie_Recommendation_System/main/movie_list.pkl"
SIMILARITY_URL = "https://raw.githubusercontent.com/Imalsha-Ranasinghe/Movie_Recommendation_System/main/similarity.pkl"

# Function to download files if not exists
def download_file(url, filename):
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        response = requests.get(url)
        with open(filename, "wb") as f:
            f.write(response.content)
        print(f"{filename} downloaded successfully.")
    else:
        print(f"{filename} already exists.")

# Download the necessary files
download_file(MOVIE_LIST_URL, "movie_list.pkl")
download_file(SIMILARITY_URL, "similarity.pkl")

# Load the pickle files with error handling
def load_pickle_file(filename):
    try:
        with open(filename, "rb") as file:
            return pickle.load(file)
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return None

# Load the movie list and similarity matrix
movie_list = load_pickle_file("movie_list.pkl")
similarity = load_pickle_file("similarity.pkl")

# Movie Recommendation Function
def recommend_movies(movie_name):
    if movie_list is None or similarity is None:
        return ["Error: Pickle files not loaded properly."]

    movie_name = movie_name.lower()  # Case insensitive search
    movie_index = movie_list[movie_list['title'].str.lower() == movie_name].index
    if movie_index.empty:
        return ["Movie not found."]
    movie_index = movie_index[0]
    movie_distances = sorted(list(enumerate(similarity[movie_index])), key=lambda x: x[1], reverse=True)
    return [movie_list.iloc[i[0]]['title'] for i in movie_distances[1:6]]

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    movie_name = data.get('movie', '')
    recommendations = recommend_movies(movie_name)
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)
