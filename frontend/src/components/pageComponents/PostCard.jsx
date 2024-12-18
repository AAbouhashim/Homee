import React, { useState, useEffect } from "react";
import { FaHeart, FaComment, FaStar } from "react-icons/fa";

const PostCard = ({
  post,
  currentUserId,
  handleLike,
  handleCommentChange,
  handleCommentSubmit,
  followUnfollowUser,
  comments,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if the current user is in the author's followers array
  useEffect(() => {
    const isUserFollowing = post.user.followers.includes(currentUserId);
    setIsFollowing(isUserFollowing);
  }, [post.user.followers, currentUserId]);

  // Handle follow/unfollow action
  const handleFollow = async () => {
    try {
      await followUnfollowUser(post.user._id); // Call the API
      setIsFollowing((prev) => !prev); // Toggle follow state
    } catch (error) {
      console.error("Error following/unfollowing user:", error.message);
    }
  };

  // Render stars for difficulty
  const renderStars = (difficulty) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, i) => (
      <FaStar
        key={i}
        className={`inline-block ${
          i < difficulty ? "text-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="post-card card bg-base-100 shadow-lg rounded-lg overflow-hidden">
      {/* Post Image */}
      {post.image && (
        <figure className="h-48 overflow-hidden">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      {/* Post Content */}
      <div className="card-body p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-2">
          <div className="avatar">
            <div className="w-10 rounded-full">
              {post.user.profileImg ? (
                <img
                  src={post.user.profileImg}
                  alt={`${post.user.username}'s profile`}
                  className="rounded-full"
                />
              ) : (
                <img
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.user.username}`}
                  alt={`${post.user.username}'s default avatar`}
                  className="rounded-full"
                />
              )}
            </div>
          </div>
          <h3 className="font-bold text-lg flex-1">{post.user.username}</h3>
          {/* Follow Button */}
          {post.user._id !== currentUserId && (
            <button
              onClick={handleFollow}
              className={`btn btn-sm ${isFollowing ? "btn-secondary" : "btn-primary"}`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Title */}
        <h2 className="card-title text-xl mb-1">{post.title}</h2>
        {/* Description */}
        <p className="text-gray-600 text-sm">{post.description}</p>

        {/* Difficulty */}
        <div className="mt-2">
          <span className="font-medium">Difficulty: </span>
          {renderStars(post.difficulty)}
        </div>

        {/* Post Actions */}
        <div className="flex justify-between items-center mt-4 text-gray-500">
          {/* Like Button */}
          <button
            onClick={() => handleLike(post._id)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaHeart
              className={`text-xl ${
                post.likes.includes(currentUserId)
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
            <span>{post.likes.length || 0}</span>
          </button>

          {/* Comments */}
          <div className="flex items-center gap-2">
            <FaComment className="text-blue-500" />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>

        <div className="mt-4">
          {/* Display Comments */}
          <div className="comments-section mb-4">
            <h3 className="text-lg font-semibold mb-2">Comments:</h3>
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2">
                {post.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-100 p-2 rounded-md"
                  >
                    <div className="avatar w-8 h-8 rounded-full">
                      {comment.user.profileImg ? (
                        <img
                          src={comment.user.profileImg}
                          alt={`${comment.user.username}'s profile`}
                          className="rounded-full"
                        />
                      ) : (
                        <img
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.user.username}`}
                          alt={`${comment.user.username}'s default avatar`}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <span className="font-bold">{comment.user.username}</span>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Comment Input */}
          <div>
            <input
              type="text"
              placeholder="Write a comment..."
              value={comments[post._id] || ""}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
              className="input input-bordered w-full"
            />
            <button
              onClick={() => handleCommentSubmit(post._id)}
              className="btn btn-primary mt-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;