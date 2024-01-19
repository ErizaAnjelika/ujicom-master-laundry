import React from "react";

const Navbar = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
         
        </ul>
        {/* Right navbar links */}
        
      </nav>
      {/* /.navbar */}
    </>
  );
};

export default Navbar;
