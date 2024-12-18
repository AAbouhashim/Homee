import React, { useEffect, useState } from "react";
import { getMe, getUserPosts, deletePost, logout } from "../api/api.js";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch User Posts
  const fetchUserPosts = async () => {
    if (!user?.username) return; // Ensure user is loaded before fetching posts
    setLoadingPosts(true);
    try {
      const postsData = await getUserPosts(user.username);
      console.log("User Posts:", postsData);
      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching user posts:", err.message);
      setError("Failed to load user posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  // Handle Post Delete
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err.message);
    }
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

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch posts when user data is available
  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 space-y-8">
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
                <button className="btn btn-primary" onClick={fetchUserData}>
                  Refresh
                </button>
                <button className="btn btn-error" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Posts Section */}
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-4">My Posts</h2>

          {loadingPosts ? (
            <div className="flex items-center justify-center py-6">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">You have no posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="border p-4 rounded-md">
                  {/* Post Image */}
                  {post.image && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={post.image}
                        alt="Post"
                        className="max-w-full max-h-64 object-contain rounded-md"
                      />
                    </div>
                  )}

                  {/* Post Details */}
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-gray-600">{post.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Likes:</strong> {post.likes.length}
                  </p>

                  {/* Comments Section */}
                  <div className="mt-4">
                    <h4 className="font-semibold">Comments:</h4>
                    {post.comments && post.comments.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {post.comments.map((comment, index) => (
                          <li key={index} className="text-gray-700">
                            <strong>{comment.user.username}: </strong>
                            {comment.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end items-center mt-4">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
