import React from "react";
import { Link } from "react-router-dom";
import constructionImage from "../components/assets/constructionImage.webp";
import Brick from "../components/assets/brick";

const UnderConstructionPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      {/* Logo */}
      <Brick alt="App Logo" className="w-32 h-32 mb-6 mx-auto" />

      {/* Construction Image */}
      <img
        src={constructionImage}
        alt="Under Construction"
        className="w-64 h-64 mb-6 border-4 border-gray-300 rounded-lg shadow-md"
      />

      {/* Message */}
      <h1 className="text-4xl font-bold text-primary mb-4">Coming Soon</h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        We're hard at work building something amazing for you. Please check back
        later!
      </p>

      {/* Navigation Option */}
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default UnderConstructionPage;
