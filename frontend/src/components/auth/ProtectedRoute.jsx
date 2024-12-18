import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../../api/api"; // API call to fetch user data

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state

  useEffect(() => {
    const verifySession = async () => {
      try {
        await getMe(); // API call to check session validity
        setIsAuthenticated(true);
      } catch (error) {
        console.error("User not authenticated:", error.message);
        setIsAuthenticated(false);
      }
    };

    verifySession();
  }, []);

  if (isAuthenticated === null) {
    // Show a loading screen while checking authentication
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;