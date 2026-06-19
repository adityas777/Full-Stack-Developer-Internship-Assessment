const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const runTest = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_booking');
    console.log('Connected to DB for flow testing...');

    // 1. Setup mock user & event
    const email = `test-persist-${Date.now()}@test.com`;
    const user = await User.create({
      name: 'Persist Tester',
      email: email,
      password: 'password123',
    });
    console.log(`Created user: ${email}`);

    const event = await Event.create({
      name: 'Flow Test Event',
      description: 'Verifying booking persistence across login-logout simulation',
      date: new Date(),
      time: '04:00 PM',
      venue: 'Mumbai Arena',
      totalSeats: 10,
      availableSeats: 10,
    });
    console.log(`Created event: ${event.name}`);

    // 2. Create booking for this user
    const booking = await Booking.create({
      user: user._id,
      event: event._id,
      seatsBooked: 2,
    });
    console.log(`Created booking: ${booking._id} for user ${user._id} (2 seats)`);

    // 3. Simulating logout: we clear local references (no DB changes)
    console.log('Simulating Logout: user token cleared locally...');

    // 4. Simulating login: we fetch user by email, verify password, and query bookings
    console.log(`Simulating Login: fetching user by email ${email}...`);
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser) {
      throw new Error('User not found during login');
    }

    const isMatch = await loggedInUser.matchPassword('password123');
    if (!isMatch) {
      throw new Error('Password mismatch');
    }
    console.log('User password matches. Login successful!');

    // Retrieve bookings for the logged-in user
    console.log(`Retrieving bookings for logged-in user ${loggedInUser._id}...`);
    const bookings = await Booking.find({ user: loggedInUser._id }).populate('event');

    console.log(`Found ${bookings.length} booking(s).`);
    if (bookings.length === 1 && bookings[0]._id.toString() === booking._id.toString()) {
      console.log('✅ FLOW TEST PASSED: Bookings are fully persistent and retrieved correctly after logging back in!');
    } else {
      console.log('❌ FLOW TEST FAILED: Booking was not retrieved.');
    }

    // Cleanup
    await User.deleteOne({ _id: user._id });
    await Event.deleteOne({ _id: event._id });
    await Booking.deleteOne({ _id: booking._id });

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Flow test error:', err);
    process.exit(1);
  }
};

runTest();
