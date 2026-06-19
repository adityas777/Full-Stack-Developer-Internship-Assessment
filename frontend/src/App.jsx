import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Toast from './components/Toast';
import { api } from './utils/api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [initializing, setInitializing] = useState(true);

  // Load user session on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('event_booking_token');
        if (token) {
          const profile = await api.auth.getMe();
          if (profile) {
            setUser(profile);
          }
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        // Clear stale token
        localStorage.removeItem('event_booking_token');
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (userData) => {
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    });
    addToast(`Welcome back, ${userData.name}!`, 'success');
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    addToast('Logged out successfully.', 'info');
    setActivePage('dashboard');
  };

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setActivePage('event-details');
  };

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (initializing) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            onSelectEvent={handleSelectEvent}
            addToast={addToast}
          />
        );
      case 'event-details':
        return (
          <EventDetails
            eventId={selectedEventId}
            onBack={() => navigateTo('dashboard')}
            user={user}
            navigateTo={navigateTo}
            addToast={addToast}
          />
        );
      case 'bookings':
        return <MyBookings addToast={addToast} navigateTo={navigateTo} />;
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />;
      case 'register':
        return <Register onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <h2>Page Not Found</h2>
            <button className="btn btn-primary" onClick={() => navigateTo('dashboard')} style={{ marginTop: '16px' }}>
              Back to Events
            </button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        navigateTo={navigateTo}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
