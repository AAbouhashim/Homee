import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../../api/api.js";
import Brick from "../../components/assets/brick.jsx";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.username
      );
      if (response) {
        navigate("/");
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Logo Section */}
        <div className="hidden lg:flex items-center justify-center lg:w-1/2">
          <Brick className="lg:w-2/3 fill-primary" />
        </div>

        {/* Form Section */}
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-primary text-center mb-6">
              Join Today
            </h1>

            {/* Email Field */}
            <label className="input input-bordered flex items-center gap-2">
              <MdOutlineMail className="text-lg" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="grow"
              />
            </label>

            {/* Username & Full Name */}
            <div className="flex gap-4 flex-wrap">
              <label className="input input-bordered flex items-center gap-2 flex-1">
                <FaUser className="text-lg" />
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 flex-1">
                <MdDriveFileRenameOutline className="text-lg" />
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="grow"
                />
              </label>
            </div>

            {/* Password Field */}
            <label className="input input-bordered flex items-center gap-2">
              <MdPassword className="text-lg" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="grow"
              />
            </label>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {isError && (
              <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
            )}
            {/* Login Link */}
            <div className="form-control mt-4">
              <p className="text-gray-600 text-center">Already have an account?</p>
              <Link to="/login" className="btn btn-secondary btn-primary mt-2">
                Sign In
              </Link>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
};

export default SignUpPage;