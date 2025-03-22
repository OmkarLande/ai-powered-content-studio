import React from "react";
import Lottie from "react-lottie";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FileText, Video, TrendingUp, Scissors, Mic } from "lucide-react";
import animation from "../assets/animation.json";
import script from "../assets/script.png";
import video from "../assets/video.png";
import performance from "../assets/performance.png";
import youtube from "../assets/youtube.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Import arrows

// Custom Arrow Components
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-0 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-red-500 transition-all"
      style={{ top: "50%", transform: "translateY(-50%)", marginLeft: "-30px" }}
      onClick={onClick}
    >
      <AiOutlineLeft className="w-6 h-6" />
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-0 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-red-500 transition-all"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        marginRight: "-30px",
      }}
      onClick={onClick}
    >
      <AiOutlineRight className="w-6 h-6" />
    </button>
  );
};

const Home = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      // preserveAspectRatio: "xMidYMid slice",
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
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
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
          <div className="block sm:hidden w-full justify-center mt-8">
            <Lottie options={defaultOptions} height={400} width={400} />
          </div>

          <div className="w-full flex flex-col-reverse sm:flex-row items-start justify-between px-6 sm:px-8 lg:px-24 py-2">
            <div className="max-w-2xl text-center pt-32 sm:text-left mb-8 sm:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight">
                AI-Powered <span className="text-red-500">Content Studio</span>
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Empower your content creation process with cutting-edge AI
                technology that automates scriptwriting, streamlines video
                editing, and enhances content performance. Our AI models ensure
                high-quality results, helping you engage your audience
                effectively while saving time and effort.
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

            <div className="hidden sm:flex w-1/2 overflow-hidden">
              <div className="overflow-hidden">
                <Lottie
                  options={defaultOptions}
                  height={1000}
                  width={1000}
                  className="max-w-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-100 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              Key <span className="text-red-500">Features</span>
            </h2>

            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-items-center ml-60">
              <Feature
                icon={<FileText className="text-red-500 w-14 h-14" />}
                title="Script Generation"
                desc="AI-powered script writing and refinement."
              />
              <Feature
                icon={<Mic className="text-blue-500 w-14 h-14" />}
                title="AI Voice Over"
                desc="Automated video cutting, resizing, and voiceovers."
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
        <section className="py-32 bg-white w-full">
          {" "}
          {/* Increased padding for height */}
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              Explore <span className="text-red-500">Models</span>
            </h2>

            <Slider {...settings} className="w-auto ">
              {carouselItems.map((item, index) => (
                <div key={index} className="flex justify-center">
                  <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
                    <div className="w-max space-y-4 text-center md:text-left">
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
                    <div className="w-[1000px]  flex justify-center">
                      <img
                        src={item.imgSrc}
                        alt={item.title}
                        className="w-auto h-[600px] object-cover rounded-lg "
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </main>
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
