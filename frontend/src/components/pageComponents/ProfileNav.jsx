import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getMe, logout, getNotifications } from "../../api/api.js";

const ProfileNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data
  const [notificationCount, setNotificationCount] = useState(0); // Store notification count
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

    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setNotificationCount(notifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
        setNotificationCount(0);
      }
    };

    // Initial login check
    checkLogin();

    // Polling for notifications every 30 seconds
    let intervalId;
    if (isLoggedIn) {
      fetchNotifications(); // Initial fetch
      intervalId = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserData(null); // Clear user data
      setNotificationCount(0); // Clear notification count
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
                  <img
                    alt="User Avatar"
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData.username}`}
                  />
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
                  <span className="badge">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
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