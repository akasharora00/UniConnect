import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constraints";
import { addConnections } from "../utils/connectionsSlice";
import { FiUsers, FiMail, FiTrash2, FiExternalLink } from "react-icons/fi";

/**
 * Connections Page Component.
 * Fetches and displays a list of active student connections from the campus network.
 */
const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      // The backend returns { message: "...", data: [...] }
      // Due to a backend mapping bug, array items might be null. We handle it safely.
      dispatch(addConnections(res.data.data || []));
    } catch (err) {
      console.error(err);
      setError("Failed to load connection directory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg text-indigo-500"></span>
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading campus connections...</p>
      </div>
    );
  }

  // Filter out null elements (caused by the backend mapping bug) to avoid rendering issues
  const validConnections = (connections || []).filter(
    (conn) => conn !== null && conn !== undefined
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[75vh]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-[#232338] pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiUsers className="text-indigo-400" />
            My Network
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Manage your connected campus peers, team partners, and collaborators.
          </p>
        </div>
        <div className="text-xs text-[#9CA3AF] bg-[#161626] border border-[#2B2B44] px-4 py-2 rounded-xl">
          Total Connections: <span className="text-indigo-400 font-bold font-mono">{validConnections.length}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-950/40 border border-red-800/40 rounded-2xl text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Grid listing */}
      {validConnections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#11111E]/30 border border-[#232338]/50 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <FiUsers className="w-16 h-16 text-indigo-500/40 mb-4" />
          <h3 className="text-2xl font-bold text-gray-200">No Connections Yet</h3>
          <p className="text-gray-400 mt-3 max-w-md text-sm leading-relaxed">
            Your university network is empty. Swipe "Connect" on student profiles in the Discover Feed to establish project teams or study groups!
          </p>
          <Link
            to="/feed"
            className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            Start Discovering Peers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validConnections.map((student) => {
            const avatarUrl = student.photoUrl && student.photoUrl.startsWith("http")
              ? student.photoUrl
              : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.firstName + " " + (student.lastName || ""))}`;

            return (
              <div
                key={student._id}
                className="bg-[#11111E]/80 border border-[#232338]/80 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 shadow-xl backdrop-blur-md"
              >
                <div>
                  {/* Top Header details */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={avatarUrl}
                      alt={student.firstName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.firstName)}`;
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {student.firstName} {student.lastName || ""}
                      </h3>
                      {student.gender && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/20 text-indigo-300">
                          {student.gender} {student.age ? `• ${student.age}` : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student bio */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    {student.about || "This student profile does not have a bio description."}
                  </p>

                  {/* Skills tags */}
                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {student.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-500/5 border border-indigo-500/10 text-indigo-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 4 && (
                        <span className="text-[10px] text-gray-500 font-semibold self-center">
                          +{student.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Button Actions */}
                <div className="flex items-center gap-2.5 pt-4 border-t border-[#232338]/40">
                  <a
                    href={`mailto:${student.emailId || ""}`}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 hover:border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FiMail />
                    Email Peer
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;
