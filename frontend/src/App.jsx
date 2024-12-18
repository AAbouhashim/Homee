import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import Navbar from "./components/pageComponents/Navbar.jsx";
import Home from "./pages/HomePage.jsx";
import LogInPage from "./pages/auth/LogInPage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import About from "./pages/About.jsx";
import SupportUs from "./pages/SupportUs.jsx";
import Notifications from "./pages/Notifications.jsx";
import NewPost from "./pages/NewPost.jsx";
import ChangePassword from "./pages/auth/ChangePassword.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import UnderConstructionPage from "./pages/UnderConstruction.jsx";

function App() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Routes>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/support-us" element={<UnderConstructionPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newPost"
          element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/changePassword"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;