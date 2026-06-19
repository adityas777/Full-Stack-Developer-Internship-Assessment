import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { ChevronLeft, Calendar, MapPin, Users, Ticket, Loader2 } from 'lucide-react';

export default function EventDetails({ eventId, onBack, user, navigateTo, addToast }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const data = await api.events.getDetails(eventId);
      setEvent(data);
    } catch (err) {
      addToast(err.message || 'Failed to load event details', 'error');
      onBack();
    } finally {
      setLoading(false);
    }
  }, [eventId, onBack, addToast]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleBook = async () => {
    if (!user) {
      addToast('Please login to book seats', 'info');
      navigateTo('login');
      return;
    }

    if (seatsToBook < 1 || seatsToBook > event.availableSeats) {
      addToast('Invalid number of seats', 'error');
      return;
    }

    setBookingLoading(true);
    try {
      await api.bookings.create(event._id, seatsToBook);
      addToast(`Successfully booked ${seatsToBook} seat(s) for ${event.name}!`, 'success');
      // Redirect to bookings
      navigateTo('bookings');
    } catch (err) {
      addToast(err.message || 'Booking failed', 'error');
      // Refresh event details to get updated seat counts
      fetchEventDetails();
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px 0' }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '24px' }}>
          <ChevronLeft size={16} /> Back to Events
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div className="glass-card" style={{ height: '360px' }}>
            <div className="skeleton" style={{ height: '32px', width: '50%', marginBottom: '24px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '12px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '12px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '95%', marginBottom: '32px' }}></div>
            <div className="skeleton" style={{ height: '48px', width: '200px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Mock seat layout representation based on event seats
  const renderSeatLayout = () => {
    const total = Math.min(event.totalSeats, 60); // caps grid size at 60 dots for visual cleanliness
    const booked = Math.max(0, total - Math.round((event.availableSeats / event.totalSeats) * total));
    
    const dots = [];
    for (let i = 0; i < total; i++) {
      const isBooked = i < booked;
      dots.push(
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: isBooked ? 'rgba(255, 255, 255, 0.15)' : 'var(--accent-purple)',
            border: isBooked ? 'none' : '1px solid var(--accent-purple-glow)',
            boxShadow: isBooked ? 'none' : '0 0 6px var(--accent-purple-glow)',
            transition: 'all 0.2s',
          }}
          title={isBooked ? 'Reserved' : 'Available'}
        />
      );
    }

    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>
          SEAT MAP PREVIEW
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          borderRadius: '8px',
          width: 'fit-content',
        }}>
          {dots}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-purple)' }}></div>
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
            <span>Reserved</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <button 
        className="btn btn-secondary" 
        onClick={onBack} 
        style={{ marginBottom: '24px', padding: '10px 16px', height: '42px' }}
      >
        <ChevronLeft size={16} /> Back to Events
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        alignItems: 'start',
      }}
      className="details-grid"
      >
        {/* Left Column: Details */}
        <div className="glass-card" style={{ padding: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
            {event.name}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '10px' }}>
                <Calendar size={20} color="var(--accent-purple)" />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATE & TIME</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{formatDate(event.date)}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{event.time}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '10px' }}>
                <MapPin size={20} color="var(--accent-purple)" />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>VENUE</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{event.venue}</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
              About the Event
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {event.description}
            </p>
          </div>

          {renderSeatLayout()}
        </div>

        {/* Right Column: Checkout Ticket Panel */}
        <div className="glass-card" style={{ padding: '32px', background: 'rgba(17, 12, 33, 0.85)', position: 'sticky', top: '100px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', items: 'center', gap: '8px', color: 'var(--accent-pink)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase' }}>
              <Ticket size={14} />
              <span>Seat Reservation</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Ticket Checkout</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Availability</span>
            <span style={{
              fontWeight: 600,
              color: event.availableSeats === 0 ? 'var(--accent-red)' : event.availableSeats <= 10 ? 'var(--accent-pink)' : 'var(--accent-green)',
            }}>
              {event.availableSeats === 0 ? 'Sold Out' : `${event.availableSeats} seats left`}
            </span>
          </div>

          {event.availableSeats > 0 ? (
            <>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label">Select Number of Seats</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSeatsToBook((prev) => Math.max(1, prev - 1))}
                    style={{ flex: 1, padding: '10px 0', fontSize: '1.2rem', fontWeight: 800 }}
                    disabled={seatsToBook <= 1}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, width: '40px', textAlign: 'center' }}>
                    {seatsToBook}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSeatsToBook((prev) => Math.min(event.availableSeats, prev + 1))}
                    style={{ flex: 1, padding: '10px 0', fontSize: '1.2rem', fontWeight: 800 }}
                    disabled={seatsToBook >= event.availableSeats}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '28px',
                border: '1px solid rgba(255, 255, 255, 0.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>Total Seats Selection</span>
                  <span>{seatsToBook} Ticket(s)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px' }}>
                  <span>Price</span>
                  <span style={{ color: 'var(--accent-pink)' }}>Free Entry</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleBook}
                style={{ width: '100%', padding: '14px', height: '48px' }}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 size={18} className="skeleton" style={{ animation: 'loading-pulse 1s infinite' }} />
                    Confirming...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled
            >
              Sold Out
            </button>
          )}

          {!user && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '16px', lineHeight: 1.4 }}>
              * You will be redirected to Login to confirm registration.
            </p>
          )}
        </div>
      </div>
      
      {/* Media query styling in JS style for quick responsive adaptation */}
      <style>{`
        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          .details-grid > div:last-child {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
