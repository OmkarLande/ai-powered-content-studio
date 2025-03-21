import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import GenScript from './pages/GenScript';
import Features from "./pages/Features";
import Voiceover from "./pages/Voiceover";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features/gen-script" element={<GenScript />} />
            <Route path="/features/voice-over" element={<Voiceover />} />
            <Route path="/features" element={<Features />} />
          </Routes>
        </div>
        <footer className="border-t border-gray-300 bg-white w-full py-6 text-center text-gray-500">
          © 2025 AI Content Studio. All rights reserved.
        </footer>
      </div>
    </Router>
  );
};

export default App;
