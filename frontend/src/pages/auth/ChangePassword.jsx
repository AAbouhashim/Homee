import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../api/api.js";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // React Router navigation

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword ) {
      setError("New password and confirm password do not match.");
      setSuccess(""); // Clear success message
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password cannot be the same as the old password.");
      setSuccess("");
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      // Use updateUser to send password update data
      await updateUser({ currentPassword, newPassword });
      setSuccess("Password changed successfully.");
      setError(""); // Clear error message

      setTimeout(() => {
        navigate("/my-account"); // Redirect after 1 second
      }, 1000);
    } catch (err) {
      console.error("Error updating password:", err.message);

      // Handle server error response
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || "Failed to change password.";
      setError(errorMessage); // Display the server error message
      setSuccess(""); // Clear success message
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Change Password</h2>

          {/* Error and Success Messages */}
          {error && <p className="text-error">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}

          {/* Form */}
          {!loading && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="currentPassword">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="input input-bordered w-full"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="newPassword">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="input input-bordered w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary w-full">
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;