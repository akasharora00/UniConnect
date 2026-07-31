import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constraints";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { FiCheck, FiX, FiInfo, FiInbox } from "react-icons/fi";

/**
 * Requests Page Component.
 * Fetches and displays pending connection requests sent by other campus students.
 */
const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      // Note the backend spelling: /user/request/recieved
      const res = await axios.get(BASE_URL + "/user/request/recieved", {
        withCredentials: true,
      });
      // The backend returns { message: "...", data: [...] }
      dispatch(addRequests(res.data.data || []));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /**
   * Accepts or declines an incoming connection request.
   * @param {string} status - either "accepted" or "rejected"
   * @param {string} requestId - the connection request record ID
   */
  const handleReview = async (status, requestId) => {
    try {
      setActionLoadingId(requestId);
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      // Remove reviewed request from Redux state
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg text-indigo-500"></span>
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Checking for new campus requests...</p>
      </div>
    );
  }

  // Filter out request elements where fromUserId is null/undefined to prevent runtime rendering bugs
  const validRequests = (requests || []).filter(
    (req) => req && req.fromUserId !== null && req.fromUserId !== undefined
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-[75vh]">
      {/* Page Header */}
      <div className="border-b border-[#232338] pb-6 mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FiInbox className="text-indigo-400" />
          Pending Requests
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Respond to connection invitations from peers wanting to network or collaborate.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-950/40 border border-red-800/40 rounded-2xl text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Requests list */}
      {validRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#11111E]/30 border border-[#232338]/50 rounded-3xl p-8 max-w-xl mx-auto backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <FiInfo className="w-12 h-12 text-indigo-500/40 mb-4" />
          <h3 className="text-xl font-bold text-gray-200">No Pending Requests</h3>
          <p className="text-gray-400 mt-3 max-w-sm text-sm leading-relaxed">
            You don't have any incoming connection requests at the moment. Keep exploring profiles in the discover tab to initiate connections!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {validRequests.map((request) => {
            const student = request.fromUserId;
            const avatarUrl = student.photoUrl && student.photoUrl.startsWith("http")
              ? student.photoUrl
              : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.firstName + " " + (student.lastName || ""))}`;

            return (
              <div
                key={request._id}
                className="bg-[#11111E]/70 border border-[#232338] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/30 transition shadow-lg backdrop-blur-md"
              >
                {/* Left - Profile details */}
                <div className="flex items-start gap-4">
                  <img
                    src={avatarUrl}
                    alt={student.firstName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.firstName)}`;
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {student.firstName} {student.lastName || ""}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2 max-w-md">
                      {student.about || "Interested in connection and collaboration."}
                    </p>
                    
                    {/* Skills pills */}
                    {student.skills && student.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {student.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right - Accept / Decline Buttons */}
                <div className="flex items-center gap-3 self-end md:self-center border-t border-[#232338]/30 pt-3 md:pt-0 md:border-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleReview("rejected", request._id)}
                    disabled={actionLoadingId !== null}
                    className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    <FiX />
                    Decline
                  </button>
                  
                  <button
                    onClick={() => handleReview("accepted", request._id)}
                    disabled={actionLoadingId !== null}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    <FiCheck />
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
