import { useState } from "react";
import Sidebar from "../components/Sidebar";

function GenScript() {
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateArticle = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Starting API request...");

      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.error) {
        setError(data.error);
      } else {
        setArticle(data.result);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to generate article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 items-center p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold text-red-500 mb-6 text-center">
            AI Script Generator
          </h1>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Enter a Topic:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., AI in Content Creation"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateArticle}
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Script"}
          </button>

          {/* Loading Spinner */}
          {loading && (
            <div className="mt-4 flex items-center justify-center text-gray-600">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>
                Generating content with AI crew. This may take a minute...
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Generated Article */}
          {article && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-4">
                Generated Script:
              </h2>
              <div className="prose prose-lg text-gray-700">{article}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default GenScript;
