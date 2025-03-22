import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar Component
import { Play, Link as LinkIcon, Download } from "lucide-react";

const ShortsCreation = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [shorts, setShorts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate generating shorts
  const generateShorts = () => {
    if (!videoUrl.trim()) {
      alert("Please enter a valid YouTube link.");
      return;
    }

    setIsGenerating(true);

    // Simulated short clips (replace with API call in future)
    setTimeout(() => {
      setShorts([
        {
          id: 1,
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          duration: "00:15",
        },
        {
          id: 2,
          url: "https://www.w3schools.com/html/movie.mp4",
          duration: "00:20",
        },
        {
          id: 3,
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          duration: "00:18",
        },
        {
          id: 4,
          url: "https://www.w3schools.com/html/movie.mp4",
          duration: "00:12",
        },
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  // Download Short
  const downloadShort = (shortUrl) => {
    const link = document.createElement("a");
    link.href = shortUrl;
    link.download = "short-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-black">
              🎥 Create <span className="text-red-500">Shorts</span> from
              YouTube
            </h2>
            <p className="text-gray-600 text-lg">
              Paste a YouTube video link below to generate AI-powered shorts.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter YouTube video link..."
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <button
                onClick={generateShorts}
                className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 ${
                  isGenerating && "opacity-50 cursor-not-allowed"
                }`}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Shorts"}
                <LinkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Shorts Section */}
          {shorts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-black mb-4">
                📹 Generated Shorts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {shorts.map((short) => (
                  <div
                    key={short.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <video
                      src={short.url}
                      controls
                      className="w-full h-56 rounded-lg"
                    />
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-gray-600 text-sm">
                        Duration: {short.duration}
                      </p>
                      <button
                        onClick={() => downloadShort(short.url)}
                        className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                      >
                        <Download className="h-5 w-5" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShortsCreation;
