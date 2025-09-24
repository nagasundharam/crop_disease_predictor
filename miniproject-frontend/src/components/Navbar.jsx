import { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";


const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
   

  return (
    <nav className="navbar">
      <div className="logo">MyLogo</div>

      {/* Desktop Menu */}
    
        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
      
        <Link to="/">Home</Link>
      
        <NavLink to="./crop-disease">Crop disease</NavLink>
        <NavLink to ="./weather">Weather</NavLink>
        <NavLink to ="./mandi-price">mandi</NavLink>
      </nav>

      {/* Hamburger Button */}
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
}
 
export default Navbar;