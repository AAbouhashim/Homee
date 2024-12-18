import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/pageComponents/PostCard.jsx";
import {
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  likeUnlikePost,
  getMe,
  commentOnPost,
  followUnfollowUser
} from "../api/api.js";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const res = await getMe();
        setCurrentUserId(res._id);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let fetchedPosts;
        if (activeTab === "all") fetchedPosts = await getAllPosts();
        else if (activeTab === "following") fetchedPosts = await getFollowingPosts();
        else if (activeTab === "liked") fetchedPosts = await getLikedPosts(currentUserId);
        setPosts(fetchedPosts || []);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  // Comments
  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = comments[postId];
    if (!text.trim()) return;

    try {
      const updatedPost = await commentOnPost(postId, { text });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: updatedPost.comments }
            : post
        )
      );
      setComments((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    }
  };

  // Handle like
  const handleLike = async (postId) => {
    try {
      const response = await likeUnlikePost(postId);
      const postIndex = posts.findIndex((post) => post._id === postId);
      const post = posts[postIndex];
      const userHasLiked = post.likes.includes(currentUserId);
      const updatedLikes = userHasLiked
        ? post.likes.filter((id) => id !== currentUserId)
        : [...post.likes, currentUserId];
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = { ...post, likes: updatedLikes };
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking/unliking post:", error.message);
    }
  };

  // Handle follow/unfollow
  const handleFollowUnfollow = async (userId) => {
    try {
      await followUnfollowUser(userId); // Call the API to follow/unfollow
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.user._id === userId
            ? { ...post, isFollowing: !post.isFollowing } // Toggle follow state
            : post
        )
      );
    } catch (error) {
      console.error("Error following/unfollowing user:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tabs */}
      <div className="tabs tabs-lifted w-full mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`tab flex-1 text-center ${
            activeTab === "all" ? "tab-active text-primary" : ""
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`tab flex-1 text-center ${
            activeTab === "following" ? "tab-active text-primary" : ""
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={`tab flex-1 text-center ${
            activeTab === "liked" ? "tab-active text-primary" : ""
          }`}
        >
          Liked
        </button>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="card w-full max-w-lg mx-auto bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold text-center mb-4">
            No posts available
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Be the first to create a post and share it with the community.
          </p>
          <button
            onClick={() => navigate("/newPost")}
            className="btn btn-primary w-full"
          >
            Create New Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              handleLike={handleLike}
              handleCommentChange={handleCommentChange}
              handleCommentSubmit={handleCommentSubmit}
              followUnfollowUser={handleFollowUnfollow}
              comments={comments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;