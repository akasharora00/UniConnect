import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { GraduationCap } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constraints";

/**
 * Signup Page Component.
 * Collects student signup details and registers them through the backend API.
 */
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!firstName || !lastName || !emailId || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      
      setSuccess("Account created successfully! Redirecting to login...");
      setFirstName("");
      setLastName("");
      setEmailId("");
      setPassword("");
      
      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#09090F] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#11111E] border border-[#232338] rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Join UniConnect to network and collaborate with university peers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-800/40 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-emerald-200 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              First Name
            </label>
            <div className="flex items-center bg-[#161626] rounded-xl border border-[#2B2B44] px-4 focus-within:border-indigo-500 transition-all duration-200">
              <FiUser className="text-gray-500 flex-shrink-0" />
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="John"
                className="bg-transparent w-full py-3 px-3 outline-none text-white text-sm"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Last Name
            </label>
            <div className="flex items-center bg-[#161626] rounded-xl border border-[#2B2B44] px-4 focus-within:border-indigo-500 transition-all duration-200">
              <FiUser className="text-gray-500 flex-shrink-0" />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Doe"
                className="bg-transparent w-full py-3 px-3 outline-none text-white text-sm"
                required
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="flex items-center bg-[#161626] rounded-xl border border-[#2B2B44] px-4 focus-within:border-indigo-500 transition-all duration-200">
              <FiLock className="text-gray-500 flex-shrink-0" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="bg-transparent w-full py-3 px-3 outline-none text-white text-sm"
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
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-semibold hover:underline transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
