import { useState } from "react";
import axios from "axios";

export default function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", {
        movie: movie,
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Movie Recommender</h1>
      <input
        className="p-2 text-black rounded-md"
        type="text"
        placeholder="Enter a movie name"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
      />
      <button className="mt-2 bg-blue-500 px-4 py-2 rounded-md" onClick={fetchRecommendations}>
        Get Recommendations
      </button>
      <ul className="mt-4">
        {recommendations.map((rec, index) => (
          <li key={index} className="p-2">{rec}</li>
        ))}
      </ul>
    </div>
  );
}
