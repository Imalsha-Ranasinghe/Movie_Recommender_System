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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Movie Recommender 🎬</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-md">
        <input
          className="p-3 text-black rounded-md flex-1 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Enter a movie name..."
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
        />
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition duration-300 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          onClick={fetchRecommendations}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-4 text-center">
            <img
              src={rec.poster || "https://via.placeholder.com/200x300"} 
              alt={rec.title}
              className="w-full h-72 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold">{rec.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
