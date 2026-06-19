const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, seatsBooked } = req.body;

    // Validate inputs
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    if (!seatsBooked || seatsBooked < 1) {
      return res.status(400).json({ message: 'Must book at least 1 seat' });
    }

    // Step 1: Atomically check seat availability and decrement
    // This atomic query avoids race conditions (double bookings) on standalone MongoDB
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableSeats: { $gte: seatsBooked },
      },
      {
        $inc: { availableSeats: -seatsBooked },
      },
      { returnDocument: 'after' }
    );

    if (!updatedEvent) {
      // Check if event exists at all
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(400).json({
        message: `Only ${eventExists.availableSeats} seats available. Cannot book ${seatsBooked} seats.`,
      });
    }

    // Step 2: Create the booking record
    try {
      const booking = await Booking.create({
        user: req.user._id,
        event: eventId,
        seatsBooked,
      });

      // Populate event information for response
      const populatedBooking = await booking.populate('event');
      res.status(201).json(populatedBooking);
    } catch (bookingError) {
      // Rollback the seats decrement if booking creation fails
      await Event.findByIdAndUpdate(eventId, {
        $inc: { availableSeats: seatsBooked },
      });
      throw bookingError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get bookings of the logged-in user
// @route   GET /api/bookings/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: 'confirmed' })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify booking owner
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Increment available seats in the event
    await Event.findByIdAndUpdate(booking.event, {
      $inc: { availableSeats: booking.seatsBooked },
    });

    // Update booking status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully, seats released' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
