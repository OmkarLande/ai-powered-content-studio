import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import signupImage from "../assets/signup.png"; // Add your image in assets folder
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const Signup = () => {
  const { login } = useAuth();
  const [userData, setUserData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", userData);
      toast.success("Signup successful! Please login.");
      console.log("Signup response:", response.data);
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl lg:max-w-6xl flex flex-col md:flex-row  rounded-3xl overflow-hidden">
        {/* Left Side - Signup Form */}
        <div className="w-full md:w-3/5 p-10 lg:p-12 flex flex-col justify-center bg-white rounded-3xl min-h-[600px]">
          <h2 className="text-4xl font-bold text-center mb-8 text-black">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-500 hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-2/5 h-[600px]">
          <img
            src={signupImage}
            alt="Sign Up"
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
