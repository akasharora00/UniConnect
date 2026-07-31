import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { BASE_URL } from "../utils/constraints";
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import axios from 'axios';
import { useEffect } from 'react';

/**
 * Main Layout component wrapper containing the Navbar, page Outlet, and Footer.
 * Automatically checks and syncs student session state on mount.
 */
const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user)
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const fetchUser = async () => {
    // If we already have user data in redux, do not fetch again
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // Only redirect to login if we aren't already on an auth page
      if (err.response?.status === 401 || err.status === 401) {
        if (!isAuthPage) {
          navigate("/login");
        }
      } else {
        console.error("Error fetching user session:", err);
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, [location.pathname]); // re-run check when path changes to sync state

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#09090F] text-[#E4E4E7] transition-all duration-300">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body
