import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constraints";
import { addUser } from "../utils/userSlice";
import { FiUser, FiInfo, FiLock, FiSettings, FiImage, FiCompass, FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Profile Component.
 * Allows the student to update their personal details and modify their account security credentials.
 */
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // Profile Details Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");

  // Password Security Form State
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'security'
  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });
  const [securityMessage, setSecurityMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pre-fill form when user details are available from Redux store
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmailId(user.emailId || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "male");
      setAbout(user.about || "");
      setSkills(user.skills ? user.skills.join(", ") : "");
    }
  }, [user]);

  /**
   * Submits updated profile information to the backend /profile/edit.
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ text: "", type: "" });
    setLoading(true);

    // Validate inputs
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 50) {
      setProfileMessage({ text: "Age must be a number between 18 and 50.", type: "error" });
      setLoading(false);
      return;
    }

    // Convert comma-separated string back to array of skills
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          emailId,
          photoUrl,
          age: ageNum,
          gender,
          about,
          skills: skillsArray,
        },
        { withCredentials: true }
      );
      
      // Update local Redux store
      dispatch(addUser(res.data.data));
      setProfileMessage({ text: "Profile details updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setProfileMessage({
        text: err.response?.data || "Failed to update profile details. Check formatting.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submits password update details to the backend /profile/password.
   */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/password",
        { password, newPassword },
        { withCredentials: true }
      );

      setSecurityMessage({ text: res.data || "Password updated successfully!", type: "success" });
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setSecurityMessage({
        text: err.response?.data || "Failed to update password. Check current credentials.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg text-indigo-500"></span>
        <p className="text-gray-400 mt-4 text-sm">Authenticating your profile session...</p>
      </div>
    );
  }

  // Pre-calculate avatar thumbnail to reflect changes dynamically
  const previewAvatar = photoUrl && photoUrl.startsWith("http")
    ? photoUrl
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + " " + lastName)}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-[80vh]">
      {/* Glow overlays */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Page Header */}
      <div className="mb-10 border-b border-[#232338] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiSettings className="text-indigo-400" />
            Profile Hub
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Customize how other students see your profile and manage account details.
          </p>
        </div>

        {/* Tab Selector buttons */}
        <div className="flex bg-[#11111E] border border-[#23233A] p-1.5 rounded-2xl md:self-end">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "details"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FiUser className="w-4 h-4" />
            Profile details
          </button>
          
          <button
            onClick={() => setActiveTab("security")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FiLock className="w-4 h-4" />
            Password & Security
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side - Student Portfolio card preview */}
        <div className="w-full lg:w-4/12 bg-[#11111E]/80 border border-[#232338] rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-indigo-500/10 to-violet-500/10" />
          
          <img
            src={previewAvatar}
            alt={`${firstName} ${lastName}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-[#11111E] shadow-xl relative z-10 mt-4 mb-5"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName)}`;
            }}
          />

          <h3 className="text-2xl font-bold text-white tracking-tight">
            {firstName} {lastName}
          </h3>
          
          <p className="text-gray-500 text-xs mt-1 font-mono">{emailId}</p>

          <div className="flex items-center gap-2 mt-3.5">
            {gender && (
              <span className="px-3 py-1 rounded-lg bg-[#161626] border border-[#2B2B44] text-indigo-300 font-semibold text-[10px] uppercase tracking-wider">
                {gender}
              </span>
            )}
            {age && (
              <span className="px-3 py-1 rounded-lg bg-[#161626] border border-[#2B2B44] text-violet-300 font-semibold text-[10px] uppercase tracking-wider">
                Age: {age}
              </span>
            )}
          </div>

          <div className="w-full border-t border-[#232338]/60 my-6" />

          {/* About text summary snippet */}
          <div className="w-full text-left">
            <h4 className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
              <FiInfo /> About Me
            </h4>
            <p className="text-gray-300 text-xs leading-relaxed italic bg-[#161626]/40 p-3.5 rounded-xl border border-[#2B2B44]/20 min-h-12">
              {about || "No profile bio written yet."}
            </p>
          </div>

          {/* Render parsed skills tags */}
          {skills && (
            <div className="w-full text-left mt-5">
              <h4 className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-2.5 flex items-center gap-1.5">
                <FiCompass /> Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.split(",").map((s, i) => {
                  const cleaned = s.trim();
                  if (!cleaned) return null;
                  return (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {cleaned}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Interactive Form Content */}
        <div className="w-full lg:w-8/12 bg-[#11111E]/40 border border-[#232338]/60 rounded-3xl p-6 lg:p-8 shadow-xl backdrop-blur-md">
          {activeTab === "details" ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                <FiUser className="text-indigo-400" />
                Profile Settings
              </h2>

              {profileMessage.text && (
                <div className={`p-4 mb-6 rounded-2xl border text-sm flex items-center gap-2 ${
                  profileMessage.type === "success"
                    ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-200"
                    : "bg-red-950/30 border-red-800/40 text-red-200"
                }`}>
                  <FiInfo className="flex-shrink-0" />
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name (Disabled as backend model does not allow modifying it in edit data schema validation) */}
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      disabled
                      className="mt-1.5 w-full bg-[#161626]/40 text-gray-500 cursor-not-allowed rounded-2xl border border-[#23233A] py-3.5 px-4 outline-none text-sm font-semibold"
                    />
                  </div>

                  {/* Last Name (Disabled) */}
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      disabled
                      className="mt-1.5 w-full bg-[#161626]/40 text-gray-500 cursor-not-allowed rounded-2xl border border-[#23233A] py-3.5 px-4 outline-none text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 21"
                      className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Gender dropdown */}
                  <div>
                    <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm font-medium"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                </div>

                {/* Email Id (backend validator validates edit request fields) */}
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="student@university.edu"
                    className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm"
                    required
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <FiImage /> Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm"
                  />
                </div>

                {/* Skills array comma separated */}
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <FiCompass /> Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Java, UI/UX, Python"
                    className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 italic">Separate skills with commas (e.g. JavaScript, CSS, Project Management).</p>
                </div>

                {/* About bio text */}
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    About bio
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself, your department, and what collaborative project you're working on..."
                    className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {loading && <span className="loading loading-spinner loading-xs"></span>}
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                <FiLock className="text-indigo-400" />
                Change Password
              </h2>

              {securityMessage.text && (
                <div className={`p-4 mb-6 rounded-2xl border text-sm flex items-center gap-2 ${
                  securityMessage.type === "success"
                    ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-200"
                    : "bg-red-950/30 border-red-800/40 text-red-200"
                }`}>
                  <FiInfo className="flex-shrink-0" />
                  {securityMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="mt-1.5 flex items-center bg-[#161626] rounded-2xl border border-[#2B2B44] px-4 focus-within:border-indigo-500/60 transition-all">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent w-full py-3.5 px-0 outline-none text-white text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-300 p-1"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* New Password */}
                  <div>
                    <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1.5 w-full bg-[#161626] rounded-2xl border border-[#2B2B44] py-3.5 px-4 outline-none text-white focus:border-indigo-500/60 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {loading && <span className="loading loading-spinner loading-xs"></span>}
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
