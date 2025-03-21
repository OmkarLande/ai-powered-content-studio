import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Features from "./pages/Features";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> */}
          </Routes>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-300 bg-white w-full py-6 text-center text-gray-500">
          © 2025 AI Content Studio. All rights reserved.
        </footer>
      </div>
    </Router>
  );
};

export default App;
