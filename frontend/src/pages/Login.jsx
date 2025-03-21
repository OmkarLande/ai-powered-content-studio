import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import loginImage from "../assets/login.png"; // Add your image in assets folder
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", credentials);
      const token = response.data.token;
      console.log("token from login", token);
      login(token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl lg:max-w-6xl flex flex-col md:flex-row  rounded-3xl overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-3/5 p-10 lg:p-12 flex flex-col justify-center bg-white rounded-3xl min-h-[600px]">
          <h2 className="text-4xl font-bold text-center mb-8 text-black">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-red-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-2/5 h-[600px]">
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
