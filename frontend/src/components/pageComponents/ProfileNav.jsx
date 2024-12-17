import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getMe, logout } from "../../api/api.js";
import { RxAvatar } from "react-icons/rx";

const ProfileNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await getMe();
        console.log("User logged in:", user);
        setIsLoggedIn(true);
        setUserData(user);
      } catch (error) {
        console.error("User not logged in");
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserData(null); // Clear user data
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="navbar-end">
      {isLoggedIn && (
        <Link to="/newPost" className="btn btn-ghost mr-4">
          New Post
        </Link>
      )}
      {location.pathname !== "/login" &&
        (!isLoggedIn ? (
          <Link to="/login" className="btn">
            Log In
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full flex items-center justify-center bg-gray-200">
                {userData?.profileImg ? (
                  <img
                    alt="User Avatar"
                    src={userData.profileImg}
                    className="rounded-full"
                  />
                ) : (
                  <RxAvatar size={40} className="text-gray-500" />
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/my-account">{userData?.fullName}</Link>
              </li>
              <li>
                <Link to="/notifications">
                  Alerts
                  <span className="badge">99+</span>
                </Link>
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