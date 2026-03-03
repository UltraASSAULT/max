// /src/components/Navbar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/Navbar.css';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Search', to: '/search' },
    { label: 'Destinations', to: '#destinations' },
    { label: 'Weather', to: '/weather' },
    { label: 'About Us', to: '#about' },
    { label: 'Contact', to: '#contact' },
  ];

  return (
    <>
      <nav className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 4C15 4 10 8 8 14C6 20 8 28 14 32C12 28 12 22 14 18C16 14 20 12 24 12C22 16 22 22 24 26C26 22 26 16 24 12C28 14 30 18 30 24C30 28 28 32 24 34C30 32 34 26 34 20C34 12 28 4 20 4Z"
              fill="white"
            />
          </svg>
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.to.startsWith('#') ? (
                <a href={link.to} className="navbar-link">
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'navbar-link-active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <NavLink to="/search" className="navbar-search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </NavLink>
          <button
            className="navbar-menu-btn"
            aria-label="Menu"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMobileOpen ? 'navbar-mobile-open' : ''}`}>
        <ul className="navbar-mobile-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.to.startsWith('#') ? (
                <a
                  href={link.to}
                  className="navbar-mobile-link"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `navbar-mobile-link ${isActive ? 'navbar-link-active' : ''}`
                  }
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;