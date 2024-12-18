import React from "react";
import { Link } from "react-router-dom";
import Brick from "../components/assets/brick";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <div className="text-center">
        {/* Logo */}
        <Brick alt="App Logo" className="w-32 h-32 mb-6 mx-auto" />

        {/* 404 Message */}
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Navigation Options */}
        <Link to="/" className="btn btn-primary mr-4">
          Go to Home
        </Link>
        <Link to="/about" className="btn btn-secondary">
          Learn More About Us
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
