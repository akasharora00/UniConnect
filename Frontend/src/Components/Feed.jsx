import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constraints";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { FiX, FiCheck, FiInfo, FiLayers } from "react-icons/fi";
import { GraduationCap } from "lucide-react";

/**
 * Feed Component.
 * Fetches other student profiles from the campus network and presents them in a card swiper interface.
 */
const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      // The backend returns an array of users directly
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch discovery feed. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!feed) {
      fetchFeed();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Sends connection/ignore request to the backend.
   * @param {string} status - either "ignored" or "interested"
   * @param {string} userId - target user ID
   */
  const handleRequest = async (status, userId) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      // Remove the swiped user from local Redux state feed
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg text-indigo-500"></span>
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Scanning the campus directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="bg-red-950/20 border border-red-800/40 rounded-3xl p-8 max-w-md text-center shadow-xl">
          <FiInfo className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-200">Error Loading Feed</h3>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
          <button
            onClick={fetchFeed}
            className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle empty feed state
  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="bg-[#11111E]/40 border border-[#232338]/60 rounded-3xl p-8 max-w-md text-center shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
          <GraduationCap className="w-16 h-16 text-indigo-400/80 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-indigo-100">End of Feed</h3>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            You've explored all available student profiles in your campus circle.
          </p>
          <p className="text-gray-500 text-xs mt-2 italic">
            Check back later for new registrations, or adjust your own profile details.
          </p>
          <button
            onClick={fetchFeed}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl font-semibold transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            Refresh Directory
          </button>
        </div>
      </div>
    );
  }

  // Get the current active user card (first item in feed list)
  const currentUser = feed[0];

  // Helper to fallback avatar if photoUrl is broken or empty
  const avatarUrl = currentUser.photoUrl && currentUser.photoUrl.startsWith("http")
    ? currentUser.photoUrl
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.firstName + " " + (currentUser.lastName || ""))}`;

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Student Card Container */}
      <div className="w-full max-w-md bg-[#11111E]/80 border border-[#232338] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-indigo-950/20">
        
        {/* Profile Image & Badges Banner */}
        <div className="h-80 w-full relative bg-[#181829] overflow-hidden">
          <img
            src={avatarUrl}
            alt={`${currentUser.firstName} ${currentUser.lastName || ""}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.firstName)}`;
            }}
          />
          {/* Transparent Dark overlay bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11111E] via-transparent to-black/30" />

          {/* Age & Gender badges on image overlay */}
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            {currentUser.gender && (
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-700/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                {currentUser.gender}
              </span>
            )}
            {currentUser.age && (
              <span className="px-3.5 py-1.5 rounded-xl bg-violet-950/70 border border-violet-700/30 text-violet-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                Age: {currentUser.age}
              </span>
            )}
          </div>
        </div>

        {/* Profile Bio Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {currentUser.firstName} {currentUser.lastName || ""}
              </h2>
            </div>
          </div>

          {/* About Bio Section */}
          <div className="mb-6">
            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">About</h4>
            <p className="text-gray-300 text-sm leading-relaxed bg-[#161626]/50 p-4 rounded-2xl border border-[#23233A]/40">
              {currentUser.about || "This student hasn't updated their bio yet."}
            </p>
          </div>

          {/* Skills Tag Section */}
          {currentUser.skills && currentUser.skills.length > 0 && (
            <div className="mb-8">
              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Skills & Projects</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Pass (Ignore) or Connect (Interested) */}
        <div className="flex border-t border-[#232338]">
          {/* Ignore Button */}
          <button
            onClick={() => handleRequest("ignored", currentUser._id)}
            disabled={actionLoading}
            className="flex-1 py-5 hover:bg-red-500/5 active:bg-red-500/10 flex items-center justify-center gap-3 border-r border-[#232338] text-gray-400 hover:text-red-400 font-semibold tracking-wide transition-all uppercase text-xs"
          >
            <FiX className="w-5 h-5" />
            <span>Ignore</span>
          </button>

          {/* Connect Button */}
          <button
            onClick={() => handleRequest("interested", currentUser._id)}
            disabled={actionLoading}
            className="flex-1 py-5 hover:bg-indigo-500/5 active:bg-indigo-500/10 flex items-center justify-center gap-3 text-indigo-400 hover:text-indigo-300 font-semibold tracking-wide transition-all uppercase text-xs"
          >
            <FiCheck className="w-5 h-5" />
            <span>Connect</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Feed;
