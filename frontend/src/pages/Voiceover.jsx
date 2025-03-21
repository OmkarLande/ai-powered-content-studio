import React from "react";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import Lottie from "react-lottie";
import animation from "../assets/coming.json"; // Add coming soon animation

const Voiceover = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-black mb-4">
          AI Voiceover Model
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Stay tuned! We're working on exciting features to generate voiceovers
          using AI.
        </p>

        {/* Coming Soon Animation */}
        <div className="w-full max-w-lg">
          <Lottie options={defaultOptions}  />
        </div>
      </div>
    </div>
  );
};

export default Voiceover;
