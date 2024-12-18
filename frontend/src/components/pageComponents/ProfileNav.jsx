import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getMe, logout, getNotifications } from "../../api/api.js";

const ProfileNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data
  const [notificationCount, setNotificationCount] = useState(0); // Store notification count
  const [highlightAlert, setHighlightAlert] = useState(false); // Highlight the alert section
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

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
        const newCount = notifications.length;

        // Trigger alert only if new count is greater than zero and changes
        if (newCount > 0 && newCount !== notificationCount) {
          setHighlightAlert(true);
          setDropdownOpen(true);

          // Auto-close the dropdown after 1 second
          setTimeout(() => {
            setDropdownOpen(false);
            setHighlightAlert(false);
          }, 1000);
        }

        setNotificationCount(newCount);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
        setNotificationCount(0);
      }
    };

    // Initial login check
    checkLogin();

    // Polling for notifications every 10 seconds
    let intervalId;
    if (isLoggedIn) {
      fetchNotifications(); // Initial fetch
      intervalId = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [isLoggedIn, notificationCount]);

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
          <div
            className={`dropdown dropdown-end ${dropdownOpen ? "dropdown-open" : ""}`}
            ref={dropdownRef}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
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
                <Link
                  to="/notifications"
                  className={`flex justify-between ${
                    highlightAlert ? "bg-red-100 text-red-600" : ""
                  }`}
                >
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