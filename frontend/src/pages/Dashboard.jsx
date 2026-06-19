import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import EventCard from '../components/EventCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Dashboard({ user, onSelectEvent, addToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.events.getAll();
        setEvents(data);
      } catch (err) {
        addToast(err.message || 'Failed to load events', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [addToast]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAvailability = hideSoldOut ? event.availableSeats > 0 : true;

    const matchesCity = 
      selectedCity === 'All' || 
      event.venue.toLowerCase().includes(selectedCity.toLowerCase()) ||
      (selectedCity === 'Delhi' && event.venue.toLowerCase().includes('new delhi'));

    return matchesSearch && matchesAvailability && matchesCity;
  });

  return (
    <div>
      {/* Header Welcome banner */}
      <div 
        className="glass-card" 
        style={{
          padding: '32px 40px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(22, 17, 39, 0.7), rgba(40, 24, 69, 0.4))',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: 'var(--accent-purple)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          opacity: 0.3,
        }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-pink)', fontWeight: 600, fontSize: '0.95rem' }}>
          <Sparkles size={16} />
          <span>LIVE EXPERIENCES</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Welcome back, {user ? user.name : 'Explorer'}!
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Discover and reserve tickets for the most exclusive tech meetups, culinary experiences, concerts, and modern art exhibitions.
        </p>
      </div>

      {/* Filters & Search */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '480px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search events, cities, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px', height: '46px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SlidersHorizontal size={18} color="var(--text-secondary)" />
          <label 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}
          >
            <input
              type="checkbox"
              checked={hideSoldOut}
              onChange={(e) => setHideSoldOut(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--accent-purple)',
                cursor: 'pointer',
              }}
            />
          </label>
        </div>
      </div>

      {/* City Filter Badges */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '36px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          scrollbarWidth: 'none', /* Firefox */
        }}
      >
        {['All', 'Mumbai', 'Delhi', 'Kolkata'].map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className="btn"
            style={{
              padding: '10px 24px',
              fontSize: '0.85rem',
              borderRadius: '30px',
              background: selectedCity === city 
                ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-magenta))'
                : 'rgba(255, 255, 255, 0.02)',
              border: selectedCity === city 
                ? '1px solid transparent'
                : '1px solid rgba(255, 255, 255, 0.08)',
              color: selectedCity === city ? '#fff' : 'var(--text-secondary)',
              boxShadow: selectedCity === city 
                ? '0 6px 20px rgba(168, 85, 247, 0.4)' 
                : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'none',
              letterSpacing: '0.5px',
              fontWeight: 600,
            }}
          >
            {city === 'All' ? 'All Cities' : city}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          <SkeletonLoader type="card" count={3} />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div 
          className="glass-card" 
          style={{
            textAlign: 'center',
            padding: '64px 32px',
            color: 'var(--text-secondary)',
          }}
        >
          <SlidersHorizontal size={48} color="var(--text-muted)" style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            No events found
          </h3>
          <p style={{ fontSize: '0.95rem' }}>
            Try broadening your search query or enabling sold-out events.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredEvents.map((event) => (
            <div key={event._id} style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <EventCard
                event={event}
                onViewDetails={() => onSelectEvent(event._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
