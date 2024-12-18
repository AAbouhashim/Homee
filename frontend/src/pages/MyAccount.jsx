import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { getMe, getUserPosts, deletePost, logout, updateUser } from "../api/api.js";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState("");
  const [updatingImage, setUpdatingImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

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
    if (!user?.username) return;
    setLoadingPosts(true);
    try {
      const postsData = await getUserPosts(user.username);
      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching user posts:", err.message);
      setError("Failed to load user posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  // Handle Profile Image Selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cropped Area
  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Save Cropped Image
  const saveCroppedImage = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;

    image.onload = async () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      try {
        setUpdatingImage(true);
        await updateUser({ profileImg: croppedImage });
        await fetchUserData();
        setIsCropping(false);
        setImageSrc(null);
      } catch (err) {
        console.error("Error saving cropped image:", err.message);
        setError("Failed to update profile image.");
      } finally {
        setUpdatingImage(false);
      }
    };
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

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 space-y-8 pt-8">
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
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="avatar w-24 h-24 rounded-full bg-gray-200 mb-4">
                  {user.profileImg ? (
                    <img
                      src={user.profileImg}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                      alt="Default Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
                <label className="btn btn-sm btn-primary">
                  Update Profile Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>

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

      {/* Cropping Modal */}
      {isCropping && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ pointerEvents: "auto" }}
        >
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-center">Crop Your Image</h2>
            <div className="relative w-64 h-64 mx-auto">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setIsCropping(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveCroppedImage}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}


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
