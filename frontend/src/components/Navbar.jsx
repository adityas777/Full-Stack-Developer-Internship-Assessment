import React, { useState } from 'react';
import { Ticket, LogOut, Calendar, Menu, X, BookmarkCheck } from 'lucide-react';

export default function Navbar({ activePage, navigateTo, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (page) => {
    navigateTo(page);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand logo */}
        <div className="nav-brand" onClick={() => handleNavClick('dashboard')}>
          <Ticket size={24} color="var(--accent-pink)" style={{ transform: 'rotate(-15deg)' }} />
          <span>BookIt</span>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links & user controls */}
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <a
            className={`nav-link ${activePage === 'dashboard' || activePage === 'event-details' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <Calendar size={16} />
            Events
          </a>

          {user ? (
            <>
              <a
                className={`nav-link ${activePage === 'bookings' ? 'active' : ''}`}
                onClick={() => handleNavClick('bookings')}
              >
                <BookmarkCheck size={16} />
                My Bookings
              </a>

              <div className="nav-user" style={{ marginLeft: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '24px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Hello, <strong style={{ color: 'var(--text-main)' }}>{user.name.split(' ')[0]}</strong>
                </span>
                
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleNavClick('login')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleNavClick('register')}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
