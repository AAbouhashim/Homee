import React, { useState, useEffect } from 'react';
import { getAllPosts, getFollowingPosts } from '../api/api.js';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      let fetchedPosts;
      if (activeTab === 'all') {
        fetchedPosts = await getAllPosts(); // Fetch all posts
      } else if (activeTab === 'following') {
        fetchedPosts = await getFollowingPosts(); // Fetch posts from followed users
      }
      setPosts(fetchedPosts); // Set posts based on the active tab
    };

    fetchPosts();
  }, [activeTab]);

  return (
    <div className="container mx-auto p-4">
      {/* Tabs */}
      <div className="tabs mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`tab tab-lifted ${activeTab === 'all' ? 'tab-active' : ''}`}
        >
          All Posts
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`tab tab-lifted ${activeTab === 'following' ? 'tab-active' : ''}`}
        >
          Following
        </button>
      </div>

      {/* Posts Section */}
      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card mb-4 p-4 border rounded-lg shadow-md bg-white">
              <h3 className="font-bold text-xl">{post.userName}</h3>
              <p className="text-gray-700">{post.content}</p>
              {/* Add more post details here (e.g., date, likes, etc.) */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;