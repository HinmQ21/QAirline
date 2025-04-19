import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="fixed-header">
      <div className="content">
        <nav className="navbar">
          {/* Logo */}
          <p className="logo">
            Qairline
          </p>

          {/* Navigation Links */}
          <ul id="pc-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">My Flights</Link>
            </li>
            <li>
              <Link to="/">News</Link>
            </li>
            <li>
              <Link to="/">Destinations</Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="actions">
            <button className="signup-btn">
              Sign up
            </button>
            <button className="signin-btn">
              Sign in
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;