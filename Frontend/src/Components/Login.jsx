import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { GraduationCap } from "lucide-react";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constraints";

/**
 * Login Page Component.
 * Authenticates user credentials using email/password and redirects them to the Feed.
 */
const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!emailId || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || 
        "Invalid credentials or connection issue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#09090F]">
      <div className="w-full max-w-md bg-[#11111E] border border-[#232338] rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            UniConnect Login
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to access your campus network
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-800/40 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="flex items-center bg-[#161626] rounded-xl border border-[#2B2B44] px-4 focus-within:border-indigo-500 transition-all duration-200">
              <FiMail className="text-gray-500 flex-shrink-0" />
              <input
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                type="email"
                placeholder="john.doe@university.edu"
                className="bg-transparent w-full py-3 px-3 outline-none text-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="flex items-center bg-[#161626] rounded-xl border border-[#2B2B44] px-4 focus-within:border-indigo-500 transition-all duration-200">
              <FiLock className="text-gray-500 flex-shrink-0" />
              <input
                value={password}
                type="password"
                placeholder="••••••••"
                className="bg-transparent w-full py-3 px-3 outline-none text-white text-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 font-semibold hover:underline transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;