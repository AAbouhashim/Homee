import { Link, Navigate } from "react-router-dom";
import Brick from "../assets/brick.jsx";
import ThemeController from "./ThemeController.jsx";
import ProfileNav from "./ProfileNav.jsx";

import { useState } from "react";
import { logout } from "../../api/api.js";

const Navbar = () => {
  const [theme, setTheme] = useState("light");


  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><Link to="/support-us">Support Us</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><ThemeController /></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl flex items-center">
          <Brick className="ml-2 h-8 w-auto" />
          Homee
        </Link>
      </div>
        <ProfileNav />
    </div>
  );
};

export default Navbar;
