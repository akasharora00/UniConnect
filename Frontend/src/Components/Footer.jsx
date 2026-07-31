import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Footer Component.
 * Contains copyright notices, brand styling elements, and secondary social links.
 */
const Footer = () => {
  return (
    <footer className="w-full bg-[#09090F] border-t border-[#232334] py-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Section - Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>

          <h1 className="text-base font-bold text-white tracking-wide">
            Uni<span className="text-indigo-400">Connect</span>
          </h1>
        </div>

        {/* Center Section - Copyright info */}
        <p className="text-xs text-gray-500 text-center font-medium">
          © {new Date().getFullYear()} UniConnect Inc. All rights reserved. Connecting campuses nationwide.
        </p>

        {/* Right Section - Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 rounded-lg bg-[#11111E] border border-[#23233A] text-gray-500 hover:text-indigo-400 flex items-center justify-center transition"
            aria-label="GitHub Link"
          >
            <FaGithub size={16} />
          </a>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 rounded-lg bg-[#11111E] border border-[#23233A] text-gray-500 hover:text-indigo-400 flex items-center justify-center transition"
            aria-label="Twitter Link"
          >
            <FaTwitter size={16} />
          </a>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 rounded-lg bg-[#11111E] border border-[#23233A] text-gray-500 hover:text-indigo-400 flex items-center justify-center transition"
            aria-label="LinkedIn Link"
          >
            <FaLinkedin size={16} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;