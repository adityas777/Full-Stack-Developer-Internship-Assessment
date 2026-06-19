# Event Booking System

A full-stack Event Booking System allowing users to register, log in, browse live events with real-time seat capacities, reserve multiple seats with concurrency protection, and manage/cancel reservations.

Built with **Node.js, Express, MongoDB (Mongoose)** on the backend, and **Vite + React** styled with **Premium Glassmorphic Vanilla CSS** on the frontend.

---
# Deployed link: https://bookit-frontend-8zlz.onrender.com/

---

## Features

-  **Secure User Auth**: Password hashing using `bcryptjs` and session persistence with JSON Web Tokens (JWT).
-  **Concurrency-Safe Checkout**: MongoDB atomic filters prevent over-booking seats during simultaneous checkouts (race conditions).
-  **Premium Visuals**: Sleek space-dark layout using glassmorphism styling, micro-animations, skeleton loaders, and responsive layouts.
-  **Visual Seat Map**: Visual preview grids displaying available and reserved seats for each event.
-  **Interactive Alerting**: Floating Toast system providing confirmation alerts on bookings and cancellations.

---

## Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS, Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose Object Modeling)

---

## Project Structure

```
Assign/
├── backend/
│   ├── config/db.js          # Mongoose DB connection helper
│   ├── middleware/auth.js    # JWT authorization middleware
│   ├── models/               # User, Event, Booking models
│   ├── routes/               # API endpoint routing
│   ├── tests/                # Concurrency validation tests
│   └── utils/seed.js         # Event seeding script
└── frontend/
    ├── src/
    │   ├── components/       # Toast, Card, Skeleton, Navbar, Modal
    │   ├── pages/            # Login, Register, Dashboard, Details, Bookings
    │   ├── utils/api.js      # Fetch API layer with automatic token attachments
    │   ├── App.jsx           # Global state router
    │   └── index.css         # Global design system
```

---

## Setup & Running Locally

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB running locally on default port `27017`

### 1. Backend Setup & Run
Open a terminal in the root workspace directory and run:
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Pre-populate database with sample events
npm run seed

# Start the server (runs on port 5000 by default)
npm run dev
```

### 2. Frontend Setup & Run
Open another terminal in the root workspace directory and run:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 5173 by default)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_booking
JWT_SECRET=super_secret_event_booking_key_2026_xyz
```

---

## API Documentation

All request and response payloads are in `application/json` format. Protected routes require a header: `Authorization: Bearer <your_token>`.

### Authentication

#### Register User
- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Tester",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "_id": "603dcf...8e92",
    "name": "Jane Tester",
    "email": "jane@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Login User
- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "603dcf...8e92",
    "name": "Jane Tester",
    "email": "jane@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Get Current User Profile
- **Route**: `GET /api/auth/me`
- **Access**: Private (Requires token)
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "603dcf...8e92",
    "name": "Jane Tester",
    "email": "jane@example.com"
  }
  ```

---

### Events

#### Get All Events
- **Route**: `GET /api/events`
- **Access**: Public
- **Success Response (200 OK)**:
  ```json
  [
    {
      "_id": "603dd0...9d10",
      "name": "Quantum Leap Tech Summit 2026",
      "description": "Dive into the next frontier of quantum computing...",
      "date": "2026-07-15T09:00:00.000Z",
      "time": "09:00 AM - 05:00 PM",
      "venue": "Silicon Valley Convention Center, CA",
      "totalSeats": 150,
      "availableSeats": 150,
      "createdAt": "2026-06-19T01:38:00.000Z"
    }
  ]
  ```

#### Get Single Event Details
- **Route**: `GET /api/events/:id`
- **Access**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "603dd0...9d10",
    "name": "Quantum Leap Tech Summit 2026",
    "description": "Dive into the next frontier of quantum computing...",
    "date": "2026-07-15T09:00:00.000Z",
    "time": "09:00 AM - 05:00 PM",
    "venue": "Silicon Valley Convention Center, CA",
    "totalSeats": 150,
    "availableSeats": 150
  }
  ```

---

### Bookings

#### Create Booking
- **Route**: `POST /api/bookings`
- **Access**: Private (Requires token)
- **Request Body**:
  ```json
  {
    "eventId": "603dd0...9d10",
    "seatsBooked": 3
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "_id": "603dd2...04f2",
    "user": "603dcf...8e92",
    "event": {
      "_id": "603dd0...9d10",
      "name": "Quantum Leap Tech Summit 2026",
      "date": "2026-07-15T09:00:00.000Z",
      "venue": "Silicon Valley Convention Center, CA"
    },
    "seatsBooked": 3,
    "createdAt": "2026-06-19T01:40:00.000Z"
  }
  ```

#### Get Logged-In User Bookings
- **Route**: `GET /api/bookings/user`
- **Access**: Private (Requires token)
- **Success Response (200 OK)**:
  ```json
  [
    {
      "_id": "603dd2...04f2",
      "user": "603dcf...8e92",
      "event": {
        "_id": "603dd0...9d10",
        "name": "Quantum Leap Tech Summit 2026",
        "date": "2026-07-15T09:00:00.000Z",
        "venue": "Silicon Valley Convention Center, CA"
      },
      "seatsBooked": 3,
      "createdAt": "2026-06-19T01:40:00.000Z"
    }
  ]
  ```

#### Cancel Booking
- **Route**: `DELETE /api/bookings/:id`
- **Access**: Private (Requires token)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Booking cancelled successfully, seats released"
  }
  ```

---

## Assumptions & Design Decisions

1. **State routing system**: We implemented a customized virtual route system (`dashboard`, `event-details`, `bookings`, `login`, `register` views) inside `App.jsx`. This eliminates the router bundle footprint, enables animations between route layers, and guarantees a smooth, single-page experience.
2. **Concurrency Safety without Database Locks**: To solve double booking under high loads, the system avoids heavy transaction locks (which fail or require complex cluster set-ups on standard local MongoDB setups). Instead, it uses MongoDB's atomic document filter matching:
   ```javascript
   Event.findOneAndUpdate(
     { _id: eventId, availableSeats: { $gte: seatsBooked } },
     { $inc: { availableSeats: -seatsBooked } },
     { returnDocument: 'after' }
   )
   ```
   If multiple checkout operations arrive concurrently, Mongoose runs this check atomically. Any checkout execution arriving when available seats are insufficient will get `null` and return a clean "not enough seats" response, preventing negative seat capacities.
3. **Automatic Ticket Release**: Cancelling a booking triggers an atomic `$inc` update that immediately adds the reserved seats count back to the event inventory.
4. **Visual Seat Maps**: Since seats are unnumbered, we mock a visual representation matching the event size (capped at 60 seats for grid readability), color coding available seats and occupied seats, giving a theater feel.

