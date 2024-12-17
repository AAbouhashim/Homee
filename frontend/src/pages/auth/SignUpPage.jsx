import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../../api/api.js";
import Brick from "../../components/assets/brick.jsx";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
  const navigate = useNavigate(); // To redirect after successful sign-up
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to the backend to create a new user
      const response = await signup(formData.email, formData.password, formData.fullName, formData.username);
      if (response) {
        // Success: Redirect to login page (or wherever you'd like)
        navigate("/");
      }
    } catch (error) {
      // Error handling
      setIsError(true);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <Brick className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          
          {/* Email Field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
            />
          </label>

          {/* Username & Full Name */}
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </label>
          </div>

          {/* Password Field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>

          {/* Submit Button */}
          <button className="btn rounded-full btn-primary text-white">Sign up</button>
          
          {/* Error Message */}
          {isError && <p className="text-red-500">{errorMessage}</p>}
        </form>

        {/* Login Link */}
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;