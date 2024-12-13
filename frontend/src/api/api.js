import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Function for making API calls
const apiCall = async (method, url, data=null) => {
  try {
    let response;
    if(method === 'get') {
      response = await api.get(url);
    } else if(method === 'post') {
      response = await api.post(url, data);
    } else if(method === 'delete') {
      response = await api.delete(url);
    }
    return response.data;
  } catch (error) {
    console.error('API Error: ', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Auth API functions
export const getMe = async () => apiCall('POST', '/auth/me');
export const signup = async (email, password) => apiCall('POST', '/auth/signup', { email, password });
export const login = async (email, password) => apiCall('POST', '/auth/login', { email, password });
export const logout = async () => apiCall('POST', '/auth/logout');

// User API functions
export const getUser = async (userName) => apiCall('GET', `/users/${userName}`);
export const getSuggestedUsers = async () => apiCall('GET', '/users/suggested');
export const followUnfollowUser = async (userId) => apiCall('POST', `/users/follow/${userId}`);
export const updateUser = async (userData) => apiCall('POST', '/users/update', userData);

// Notification API functions
export const getNotifications = async () => apiCall('GET', '/notifications');
export const deleteNotifications = async () => apiCall('DELETE', '/notifications');
export const deleteNotification = async (notificationId) => apiCall('DELETE', `/notifications/${notificationId}`);

// Post API functions
export const getAllPosts = async () => apiCall('GET', '/posts/all');
export const getFollowingPosts = async () => apiCall('GET', '/posts/following');
export const getLikedPosts = async (userId) => apiCall('GET', `/posts/likes/${userId}`);
export const getUserPosts = async (userName) => apiCall('GET', `/posts/user/${userName}`);
export const createPost = async (postData) => apiCall('POST', '/posts/create', postData);
export const likeUnlikePost = async (postId) => apiCall('POST', `/posts/like/${postId}`);
export const commentOnPost = async (postId, comment) => apiCall('POST', `/posts/comment/${postId}`, { comment });
export const deletePost = async (postId) => apiCall('DELETE', `/posts/${postId}`);