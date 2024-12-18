import axios from 'axios';
import { set } from 'mongoose';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Set the Authorization header with the token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("Authorization Token Set:", api.defaults.headers.common['Authorization']);
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log("Authorization Token Removed");
  }
};

// Automatically set token from localStorage on app load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Function for making API calls
const apiCall = async (method, url, data = null) => {
  try {
    let response;
    if (method === 'GET') {
      response = await api.get(url);
    } else if (method === 'POST') {
      response = await api.post(url, data);
    } else if (method === 'DELETE') {
      response = await api.delete(url);
    }
    // console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error Details:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }
    throw new Error(
      error.response?.data?.error || "An error occurred while making the API call"
    );
  }
};

// Auth API functions
export const getMe = async () => apiCall('POST', '/auth/me', {setAuthToken});
export const signup = async (email, password, fullName, username) => apiCall('POST', '/auth/signup', { email, password, fullName, username });
export const login = async (username, password) => apiCall('POST', '/auth/login', { username, password });
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data; // The success message from the backend
  } catch (error) {
    console.error("Logout failed:", error.response ? error.response.data : error.message);
    throw new Error(error.response || 'Failed to logout');
  }
};

// User API functions
export const getUser = async (userId) => apiCall('GET', `/users/${userId}`);
export const getSuggestedUsers = async () => apiCall('GET', '/users/suggested');
export const followUnfollowUser = async (userId) => apiCall('POST', `/users/follow/${userId}`, {setAuthToken});
export const updateUser = async (userData) => apiCall('POST', '/users/update', userData, {setAuthToken});

// Notification API functions
export const getNotifications = async () => apiCall('GET', '/notifications', {setAuthToken});
export const deleteNotifications = async () => apiCall('DELETE', '/notifications', {setAuthToken});
export const deleteNotification = async (notificationId) => apiCall('DELETE', `/notifications/${notificationId}`);

// Post API functions
export const createPost = async (postData) => apiCall('POST', '/posts/create', postData);
export const getAllPosts = async () => apiCall('GET', '/posts/all');
export const getFollowingPosts = async () => apiCall('GET', '/posts/following');
export const getLikedPosts = async (userId) => apiCall('GET', `/posts/likes/${userId}`);
export const getUserPosts = async (userName) => apiCall('GET', `/posts/user/${userName}`);
export const likeUnlikePost = async (postId) => apiCall('POST', `/posts/like/${postId}`, { userId: 'currentUserId' });
export const commentOnPost = async (postId, text) => apiCall('POST', `/posts/comment/${postId}`, text);
export const deletePost = async (postId) => apiCall('DELETE', `/posts/${postId}`);