import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar Component
import { Download, Mic } from "lucide-react";

const TextToVoice = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("male");
  const [audioUrl, setAudioUrl] = useState("");

  const voices = [
    { id: "male", name: "Male Voice" },
    { id: "female", name: "Female Voice" },
    { id: "child", name: "Child Voice" },
    { id: "robot", name: "Robot Voice" },
  ];

  // Simulated voice generation logic
  const generateAudio = () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    // Simulate audio generation (replace with real API in future)
    const generatedUrl = `https://dummy-audio-url.com/audio-${voice}.mp3`;
    setAudioUrl(generatedUrl);
  };

  // Download Audio
  const downloadAudio = () => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "generated-audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-black">
              🎙️ Convert <span className="text-red-500">Text to Voice</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Enter your text below, select a voice, and generate downloadable
              audio.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <textarea
              rows="5"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              {/* Voice Selection */}
              <div className="w-full sm:w-1/2">
                <label className="text-gray-700 font-semibold mb-2 block">
                  Select Voice
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateAudio}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2"
              >
                <Mic className="h-5 w-5" />
                Generate Voice
              </button>
            </div>

            {/* Audio Preview & Download */}
            {audioUrl && (
              <div className="mt-6 bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between gap-4">
                <audio
                  controls
                  src={audioUrl}
                  className="w-full sm:w-3/4 rounded-lg"
                />
                <button
                  onClick={downloadAudio}
                  className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Audio
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextToVoice;
