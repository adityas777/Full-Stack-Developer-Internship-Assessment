import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export default function EventCard({ event, onViewDetails }) {
  const { name, description, date, venue, totalSeats, availableSeats } = event;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCityBadge = () => {
    const venueLower = venue.toLowerCase();
    let cityName = '';
    let color = '';
    let bg = '';
    
    if (venueLower.includes('mumbai')) {
      cityName = 'Mumbai';
      color = 'var(--neon-cyan)';
      bg = 'rgba(34, 211, 238, 0.08)';
    } else if (venueLower.includes('delhi')) {
      cityName = 'Delhi NCR';
      color = 'var(--neon-purple)';
      bg = 'rgba(192, 132, 252, 0.08)';
    } else if (venueLower.includes('kolkata')) {
      cityName = 'Kolkata';
      color = 'var(--neon-magenta)';
      bg = 'rgba(244, 114, 182, 0.08)';
    }
    
    if (!cityName) return null;
    
    return (
      <span
        style={{
          background: bg,
          color: color,
          border: `1px solid ${color}35`,
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}
      >
        {cityName}
      </span>
    );
  };

  const getAvailabilityBadge = () => {
    if (availableSeats === 0) {
      return (
        <span
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--accent-red)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Sold Out
        </span>
      );
    } else if (availableSeats <= 10) {
      return (
        <span
          style={{
            background: 'rgba(217, 70, 239, 0.1)',
            color: 'var(--accent-pink)',
            border: '1px solid rgba(217, 70, 239, 0.2)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Only {availableSeats} Left
        </span>
      );
    } else {
      return (
        <span
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-green)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {availableSeats} Available
        </span>
      );
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {getCityBadge()}
            {getAvailabilityBadge()}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-main)', marginTop: '4px' }}>
            {name}
          </h3>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Calendar size={15} color="var(--accent-purple)" />
            <span>{formatDate(date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <MapPin size={15} color="var(--accent-purple)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{venue}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Users size={15} color="var(--accent-purple)" />
            <span>{availableSeats} / {totalSeats} seats left</span>
          </div>
        </div>

        <button 
          onClick={onViewDetails}
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
        >
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
