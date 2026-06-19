import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import ConfirmationModal from '../components/ConfirmationModal';
import { Ticket, Calendar, MapPin, Trash2, ArrowRight } from 'lucide-react';

export default function MyBookings({ addToast, navigateTo }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await api.bookings.getUserBookings();
      setBookings(data);
    } catch (err) {
      addToast(err.message || 'Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [addToast]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    
    try {
      await api.bookings.cancel(selectedBooking._id);
      addToast('Booking cancelled successfully and seats released.', 'success');
      // Refresh list
      fetchBookings();
    } catch (err) {
      addToast(err.message || 'Cancellation failed', 'error');
    } finally {
      setCancelModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          padding: '10px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ticket size={24} color="var(--accent-purple)" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Reserved Bookings</h1>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SkeletonLoader type="list" count={2} />
        </div>
      ) : bookings.length === 0 ? (
        <div 
          className="glass-card" 
          style={{
            textAlign: 'center',
            padding: '64px 32px',
            color: 'var(--text-secondary)',
          }}
        >
          <Ticket size={48} color="var(--text-muted)" style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            No bookings found
          </h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '24px' }}>
            You haven't reserved seats for any events yet.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigateTo('dashboard')}
            style={{ display: 'inline-flex', gap: '8px' }}
          >
            Explore Events
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="glass-card" 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 28px',
                gap: '20px',
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                  {booking.event ? booking.event.name : 'Unknown Event'}
                </h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--accent-purple)" />
                    <span>{booking.event ? formatDate(booking.event.date) : 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--accent-purple)" />
                    <span>{booking.event ? booking.event.venue : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>SEATS RESERVED</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-pink)' }}>
                    {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => handleCancelClick(booking)}
                  style={{
                    padding: '10px 16px',
                    color: 'var(--accent-red)',
                    borderColor: 'rgba(244, 63, 94, 0.2)',
                    background: 'rgba(244, 63, 94, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.2)';
                  }}
                >
                  <Trash2 size={15} />
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Cancellation Dialog */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Booking?"
        message={`Are you sure you want to cancel your booking of ${selectedBooking?.seatsBooked} seat(s) for "${selectedBooking?.event?.name}"? Released seats will go back to the public pool.`}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Reservation"
        isDanger={true}
      />
    </div>
  );
}
