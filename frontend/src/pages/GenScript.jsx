import { useState } from "react";

function GenScript() {
  const [topic, setTopic] = useState(""); // Store user input
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
        body: JSON.stringify({ topic }), // Send user-input topic
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Article Generator</h1>

      {/* Input field for topic */}
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
      />

      <button
        onClick={generateArticle}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate Article"}
      </button>

      {loading && (
        <div className="mt-4 flex items-center text-gray-600">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generating content with AI crew. This may take a minute...
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {article && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Generated Article:</h2>
          <div className="prose prose-lg max-w-none">{article}</div>
        </div>
      )}
    </div>
  );
}

export default GenScript;
