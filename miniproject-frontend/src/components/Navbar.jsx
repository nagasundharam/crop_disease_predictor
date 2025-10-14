
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">🌱 MyFarm</div>

      {/* Links */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <NavLink to="./chatbot">Chatbot</NavLink>
        <NavLink to="./weather">Weather</NavLink>
        <NavLink to="./mandi-price">Mandi</NavLink>
      </div>

      {/* Hamburger */}
      <div
        className={`hamburger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
