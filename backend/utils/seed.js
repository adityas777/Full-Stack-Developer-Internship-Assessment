const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

dotenv.config();

const sampleEvents = [
  {
    name: 'Quantum Leap Tech Summit 2026',
    description: 'Dive into the next frontier of quantum computing, agentic AI frameworks, and decentralized infrastructures. Featuring keynote speeches from world-class researchers and hands-on coding labs.',
    date: new Date('2026-07-15T09:00:00Z'),
    time: '09:00 AM - 05:00 PM',
    venue: 'Nesco Exhibition Center, Mumbai',
    totalSeats: 150,
    availableSeats: 150,
  },
  {
    name: 'Neon Beats: Electro-Fest 2026',
    description: 'An immersive audio-visual music experience. Let the bass drop with world-renowned EDM artists, holographic light shows, and an electric crowd under the virtual sky.',
    date: new Date('2026-08-20T19:00:00Z'),
    time: '07:00 PM - 02:00 AM',
    venue: 'Jawaharlal Nehru Stadium, New Delhi',
    totalSeats: 300,
    availableSeats: 300,
  },
  {
    name: 'Global Culinary Masters Workshop',
    description: 'Join a private, hands-on masterclass led by Michelin-starred chefs. Learn specialized techniques for plating, molecular gastronomy, and flavor pairings, followed by a 5-course tasting dinner.',
    date: new Date('2026-09-05T14:30:00Z'),
    time: '02:30 PM - 08:30 PM',
    venue: 'ITC Royal Bengal Hotel, Kolkata',
    totalSeats: 45,
    availableSeats: 45,
  },
  {
    name: 'Echoes of Modern Art Exhibition',
    description: 'Step into a curated gallery exploring the intersection of human emotion and generative media. Features responsive glassmorphic interfaces, interactive VR sculptures, and digital canvas displays.',
    date: new Date('2026-10-10T10:00:00Z'),
    time: '10:00 AM - 06:00 PM',
    venue: 'National Gallery of Modern Art, Mumbai',
    totalSeats: 80,
    availableSeats: 80,
  },
  {
    name: 'Mindfulness & Zen Retreat',
    description: 'Unplug and reconnect. A full-day guided sanctuary session covering sound bath meditation, restorative yoga flow, and mindfulness exercises surrounded by acoustic ambient forest music.',
    date: new Date('2026-11-12T08:00:00Z'),
    time: '08:00 AM - 04:00 PM',
    venue: 'Lodhi Art District Garden, New Delhi',
    totalSeats: 50,
    availableSeats: 50,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_booking');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections to keep database clean
    await Event.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing events and bookings.');

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`Successfully seeded ${createdEvents.length} events!`);

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
