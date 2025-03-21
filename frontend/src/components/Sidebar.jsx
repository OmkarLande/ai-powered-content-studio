import React from "react";
import { Link } from "react-router-dom";
import { FileText, Mic , Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-64 bg-gray-900 text-white  top-16 left-0 shadow-lg z-20"
      style={{ top: "4rem" }} // Adjust this value based on your navbar height
    >
      <div
        className="flex items-center justify-center h-16 bg-red-600 cursor-pointer"
        onClick={() => navigate("/features")}
      >
        <h1 className="text-xl font-bold text-white">AI Content Studio</h1>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col p-4 space-y-4">
        <SidebarItem
          to="/features/gen-script"
          Icon={FileText}
          label="AI Script Generator"
        />
        <SidebarItem
          to="/features/voice-over"
          Icon={Mic}
          label="AI Voice Over"
        />
        <SidebarItem
          to="/features/text-to-speech"
          Icon={Mic}
          label="Text to Speech"
        />
        <SidebarItem
          to="/features/shorts-creation"
          Icon={Video}
          label="Shorts Creation"
        />
      </nav>
    </div>
  );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ to, Icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-all"
  >
    <Icon className="w-5 h-5 text-white" />
    <span className="text-lg">{label}</span>
  </Link>
);

export default Sidebar;
