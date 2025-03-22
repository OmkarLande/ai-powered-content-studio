import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Lottie from "react-lottie";
import animation from "../assets/robot.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Features = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1  flex items-center justify-center p-6">
        <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
          <Lottie options={defaultOptions} height={"60%"} width={"60%"} />
        </div>
      </div>

      {/* Default Lottie Animation on Right */}
      {/* <div className="hidden lg:flex items-center justify-center w-1/3 bg-white shadow-lg ml-4 rounded-lg">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div> */}
    </div>
  );
};

export default Features;
