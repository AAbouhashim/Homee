import React, { useState, useEffect } from "react";
import { getNotifications, deleteNotifications, deleteNotification } from "../api/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      console.log("Notifications:", data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on page load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Delete all notifications and reload
  const handleDeleteAll = async () => {
    try {
      await deleteNotifications();
      await fetchNotifications(); // Reload notifications after deletion
    } catch (error) {
      console.error("Error deleting all notifications:", error.message);
    }
  };

  // Delete a single notification and reload
  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      await fetchNotifications(); // Reload notifications after deletion
    } catch (error) {
      console.error("Error deleting notification:", error.message);
    }
  };

  // Render message based on notification type
  const renderNotificationMessage = (notification) => {
    switch (notification.type) {
      case "like":
        return `Someone liked your post.`;
      case "follow":
        return `Someone started following you.`;
      case "comment":
        return `Someone commented on your post.`;
      default:
        return `You have a new notification.`;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={handleDeleteAll}
          className="btn btn-secondary"
          disabled={notifications.length === 0 || loading}
        >
          Clear All
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">You have no notifications.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification) => (
            <div
              key={notification._id} // Use `_id` as the unique key
              className="card bg-base-100 shadow-lg rounded-lg overflow-hidden"
            >
              <div className="card-body p-4">
                <h2 className="card-title text-xl capitalize">{notification.type}</h2>
                <p className="text-gray-600">{renderNotificationMessage(notification)}</p>
                <p className="text-sm text-gray-500">
                  Created at: {new Date(notification.createdAt).toLocaleString()}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(notification._id)} // Pass `_id` to delete handler
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;