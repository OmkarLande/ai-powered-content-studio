import React from "react";
import Lottie from "react-lottie";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FileText, Video, TrendingUp, Scissors } from "lucide-react";
import animation from "../assets/animation.json";
import script from "../assets/script.png";
import video from "../assets/video.png";
import performance from "../assets/performance.png";
import youtube from "../assets/youtube.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const carouselItems = [
    {
      title: "Script Generation AI Model",
      description:
        "Generates and refines high-quality scripts using AI models.",
      imgSrc: script,
      link: "/model/1",
    },
    {
      title: "Video Editing Automation",
      description:
        "Automatically edits and resizes videos for different platforms.",
      imgSrc: video,
      link: "/model/2",
    },
    {
      title: "Performance Optimizer AI",
      description:
        "Analyzes trends and suggests content optimization strategies.",
      imgSrc: performance,
      link: "/model/3",
    },
    {
      title: "Shorts Creation Model",
      description:
        "Identifies key moments in long videos and generates shorts.",
      imgSrc: youtube,
      link: "/model/4",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black w-full">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col-reverse sm:flex-row items-center justify-center bg-white m-0 p-0">
          <div className="block sm:hidden w-full flex justify-center mt-8">
            <Lottie options={defaultOptions} height={400} width={400} />
          </div>

          <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-between px-4 sm:px-8 lg:px-20">
            <div className="max-w-2xl text-center sm:text-left mb-8 sm:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight">
                AI-Powered <span className="text-red-500">Content Studio</span>
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Revolutionizing content creation with AI-driven scriptwriting,
                video editing, and performance optimization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-lg">
                  Get Started
                </button>
                <button className="border border-gray-400 text-gray-700 hover:bg-gray-200 py-3 px-6 rounded-lg text-lg">
                  Learn More
                </button>
              </div>
            </div>

            <div className="hidden sm:flex w-1/2">
              <Lottie options={defaultOptions} className="w-full max-w-lg" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-100 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              Key <span className="text-red-500">Features</span>
            </h2>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={<FileText className="text-red-500 w-14 h-14" />}
                title="Script Generation"
                desc="AI-powered script writing and refinement."
              />
              <Feature
                icon={<Video className="text-blue-500 w-14 h-14" />}
                title="Video Editing"
                desc="Automated video cutting, resizing, and voiceovers."
              />
              <Feature
                icon={<TrendingUp className="text-green-500 w-14 h-14" />}
                title="Performance Analysis"
                desc="Content optimization using AI-driven analytics."
              />
              <Feature
                icon={<Scissors className="text-yellow-500 w-14 h-14" />}
                title="Shorts Creation"
                desc="Auto-generates engaging short clips from long videos."
              />
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="py-16 bg-white w-full">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              Explore <span className="text-red-500">Models</span>
            </h2>

            <Slider {...settings} className="w-full">
              {carouselItems.map((item, index) => (
                <div key={index} className="flex justify-center">
                  <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
                    <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-black">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                      <Link
                        to={item.link}
                        className="mt-4 inline-block bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Explore Model
                      </Link>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                      <img
                        src={item.imgSrc}
                        alt={item.title}
                        className="w-full max-w-md object-contain rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white w-full py-6 text-center text-gray-500">
        © 2025 AI Content Studio. All rights reserved.
      </footer>
    </div>
  );
};

// Feature Component
const Feature = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center space-y-4">
    {icon}
    <h3 className="text-xl font-bold text-black">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
