import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut, Compass, Users, Inbox, User } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constraints";
import { removeUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import { clearConnections } from "../utils/connectionsSlice";
import { clearRequests } from "../utils/requestsSlice";

/**
 * Navbar Navigation Component.
 * Contains site-wide navigation links, logo branding, user status avatar, and responsive mobile controls.
 */
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector((store) => store.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Triggers logout API, removes session tokens, and cleans Redux state.
   */
  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      
      // Dispatch actions to clear all Redux store slices
      dispatch(removeUser());
      dispatch(clearFeed());
      dispatch(clearConnections());
      dispatch(clearRequests());
      
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /**
   * Checks if the given path is active.
   */
  const isActive = (path) => {
    if (path === "/feed" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  // Pre-calculate profile avatar
  const avatarUrl = user?.photoUrl && user.photoUrl.startsWith("http")
    ? user.photoUrl
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.firstName + " " + (user?.lastName || ""))}`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#09090F]/80 border-b border-[#232338] backdrop-blur-md px-6 md:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-600/10 group-hover:scale-105 transition duration-300">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Uni<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Connect</span>
          </h1>
        </Link>

        {/* Central Navigation - Desktop only (visible when user logged in) */}
        {user && (
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <li>
              <Link
                to="/feed"
                className={`flex items-center gap-1.5 transition-all py-1.5 px-3 rounded-lg ${
                  isActive("/feed")
                    ? "text-white bg-indigo-500/15 border border-indigo-500/20"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Compass size={16} />
                Discover
              </Link>
            </li>
            <li>
              <Link
                to="/connections"
                className={`flex items-center gap-1.5 transition-all py-1.5 px-3 rounded-lg ${
                  isActive("/connections")
                    ? "text-white bg-indigo-500/15 border border-indigo-500/20"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Users size={16} />
                Network
              </Link>
            </li>
            <li>
              <Link
                to="/requests"
                className={`flex items-center gap-1.5 transition-all py-1.5 px-3 rounded-lg ${
                  isActive("/requests")
                    ? "text-white bg-indigo-500/15 border border-indigo-500/20"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Inbox size={16} />
                Requests
              </Link>
            </li>
          </ul>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl border border-[#353550] text-sm font-semibold text-gray-300 hover:text-white hover:bg-[#161624] transition cursor-pointer"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Desktop User Status Card */}
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-3 bg-[#151523]/80 border border-[#2E2E42]/50 rounded-2xl px-3 py-1.5 hover:border-indigo-500/30 transition duration-300"
              >
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.firstName)}`;
                  }}
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none mb-0.5">
                    {user.firstName}
                  </p>
                  <p className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </Link>

              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition text-xs font-bold cursor-pointer"
              >
                <LogOut size={14} />
                Logout
              </button>

              {/* Mobile Menu Toggler Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-[#11111E] border border-[#232338] text-gray-400 hover:text-white transition"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Dropdown Panel */}
      {mobileMenuOpen && user && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#232338] flex flex-col gap-3 animate-fadeIn">
          <Link
            to="/feed"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition ${
              isActive("/feed")
                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Compass size={18} />
            Discover Peers
          </Link>

          <Link
            to="/connections"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition ${
              isActive("/connections")
                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Users size={18} />
            My Network
          </Link>

          <Link
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition ${
              isActive("/requests")
                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Inbox size={18} />
            Pending Requests
          </Link>

          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition ${
              isActive("/profile")
                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <User size={18} />
            Profile Hub
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition border border-red-500/20 text-left mt-2 cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;