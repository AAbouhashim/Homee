import React, { useEffect, useState } from "react";
import { getMe, logout } from "../api/api.js";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch User Details
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data);
      setError("");
    } catch (err) {
      console.error(err.message);
      setError("Failed to load user information.");
    }
    setLoading(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout Error:", err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-4">My Account</h2>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : error ? (
            <p className="text-center text-error">{error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 font-medium">Full Name</p>
                <p className="text-lg font-semibold">{user.fullName}</p>
              </div>

              <div>
                <p className="text-gray-500 font-medium">Username</p>
                <p className="text-lg font-semibold">{user.username}</p>
              </div>

              <div>
                <p className="text-gray-500 font-medium">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary"
                  onClick={fetchUserData}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;