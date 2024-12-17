import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getMe, logout } from "../../api/api.js"; // Ensure that these API functions are set up correctly

const ProfileNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the backend to check if the user is authenticated
        const user = await getMe(); // Makes the request with cookies automatically
        if (user) {
          console.log("User authenticated:", user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("User is not authenticated:", error.message);
        setIsLoggedIn(false); // User is not authenticated
      }
    };

    checkAuth();
  }, []);
  
  const handleLogout = async () => {
    try {
      // Call the logout API
      await logout();
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="navbar-end">
      {location.pathname !== "/login" &&
        (!isLoggedIn ? (
          <Link to="/login" className="btn">
            Log In
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/notifications">
                  Alerts
                  <span className="badge">99+</span>
                </Link>
              </li>
              <li>
                <Link to="/my-account">My Account</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ))}
    </div>
  );
};

export default ProfileNav;