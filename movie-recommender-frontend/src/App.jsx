import { useState } from "react";
import axios from "axios";

export default function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    if (!movie.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", {
        movie: movie.trim(),
      });

      if (response.data.length === 0) {
        setError("No recommendations found. Try another movie.");
      } else {
        setRecommendations(response.data);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Error fetching recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Welcome Banner */}
      <div className="text-center py-12 bg-black bg-opacity-50">
        <h1 className="text-5xl font-extrabold text-blue-400 mb-4 animate-fadeIn">Welcome to Movie Recommender 🎬</h1>
        <p className="text-lg text-gray-300">Find the best movies based on your favorite picks!</p>
      </div>

      {/* Input Section */}
      <div className="flex flex-col items-center mt-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-lg">
          <input
            className="p-3 text-black rounded-md flex-1 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Enter a movie name..."
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
          />
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition duration-300 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            onClick={fetchRecommendations}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>

      {/* Recommendations Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg p-4 text-center transition transform hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={rec.poster || "https://via.placeholder.com/200x300"} 
                  alt={rec.title}
                  className="w-full h-72 object-cover rounded-md mb-3"
                />
                <h2 className="text-lg font-semibold">{rec.title}</h2>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-lg text-center w-full">No recommendations yet...</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 mt-10">
        <p>Made for movie lovers</p>
      </footer>
    </div>
  );
}
