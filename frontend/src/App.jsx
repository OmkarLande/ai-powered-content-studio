// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import GenScript from "./pages/GenScript";
import Features from "./pages/Features";
import Voiceover from "./pages/Voiceover";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Texttovoice from "./pages/Texttovoice";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white text-black">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/features"
                element={
                  <ProtectedRoute>
                    <Features />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/gen-script"
                element={
                  <ProtectedRoute>
                    <GenScript />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/voice-over"
                element={
                  <ProtectedRoute>
                    <Voiceover />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/text-to-speech"
                element={
                  <ProtectedRoute>
                    <Texttovoice />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <footer className="border-t border-gray-300 bg-white w-full py-6 text-center text-gray-500">
            © 2025 AI Content Studio. All rights reserved.
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
