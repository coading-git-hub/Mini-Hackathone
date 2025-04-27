
import React from "react";
import { Link } from "react-router-dom";
import AuthDetails from "../../Componant/Auth/AuthDetail";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/Home">Task Tracker</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div className="navbar-auth">
        <AuthDetails />
      </div>
    </nav>
  );
};

export default Navbar;