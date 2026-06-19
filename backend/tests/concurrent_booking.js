const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

const runTest = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_booking');
    console.log('Test database connected.');

    // 1. Clear previous test records
    await Event.deleteMany({ name: 'Concurrency Test Event' });
    await User.deleteMany({ email: { $in: ['user1@test.com', 'user2@test.com', 'user3@test.com'] } });
    await Booking.deleteMany({});

    // 2. Create test event with 5 available seats
    const event = await Event.create({
      name: 'Concurrency Test Event',
      description: 'Verifying concurrency safety',
      date: new Date(),
      time: '12:00 PM',
      venue: 'Virtual Arena',
      totalSeats: 5,
      availableSeats: 5,
    });

    // 3. Create three test users
    const user1 = await User.create({ name: 'User 1', email: 'user1@test.com', password: 'password123' });
    const user2 = await User.create({ name: 'User 2', email: 'user2@test.com', password: 'password123' });
    const user3 = await User.create({ name: 'User 3', email: 'user3@test.com', password: 'password123' });

    console.log(`Created test event with ${event.availableSeats} available seats.`);

    // Helper function to mock the controller booking logic
    const mockBookSeats = async (user, seatsToBook) => {
      try {
        // Atomic seat reservation query
        const updatedEvent = await Event.findOneAndUpdate(
          {
            _id: event._id,
            availableSeats: { $gte: seatsToBook },
          },
          {
            $inc: { availableSeats: -seatsToBook },
          },
          { returnDocument: 'after' }
        );

        if (!updatedEvent) {
          throw new Error('Not enough seats available');
        }

        await Booking.create({
          user: user._id,
          event: event._id,
          seatsBooked: seatsToBook,
        });

        return { userId: user._id, success: true };
      } catch (err) {
        return { userId: user._id, success: false, error: err.message };
      }
    };

    console.log('Firing 3 concurrent booking requests for 2 seats each (Total requested: 6, Available: 5)...');
    
    // Execute concurrent queries using Promise.all
    const results = await Promise.all([
      mockBookSeats(user1, 2),
      mockBookSeats(user2, 2),
      mockBookSeats(user3, 2),
    ]);

    console.log('\n--- Concurrent Booking Results ---');
    results.forEach((res, index) => {
      console.log(`Request ${index + 1} (User ${res.userId}): ${res.success ? 'SUCCESS (Reserved 2 seats)' : `FAILED (${res.error})`}`);
    });

    const finalEvent = await Event.findById(event._id);
    const finalBookings = await Booking.find({ event: event._id });

    console.log('\n--- Final Database Verification ---');
    console.log(`Total successful bookings: ${finalBookings.length}`);
    console.log(`Event available seats: ${finalEvent.availableSeats} (expected: 1)`);
    
    if (finalEvent.availableSeats === 1 && finalBookings.length === 2) {
      console.log('\n✅ TEST PASSED: Concurrency safety mechanism successfully prevented overbooking!');
    } else {
      console.log('\n❌ TEST FAILED: Seat availability compromised.');
    }

    // Clean up
    await Event.deleteMany({ name: 'Concurrency Test Event' });
    await User.deleteMany({ email: { $in: ['user1@test.com', 'user2@test.com', 'user3@test.com'] } });
    await Booking.deleteMany({});
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Test errored:', err);
    process.exit(1);
  }
};

runTest();
