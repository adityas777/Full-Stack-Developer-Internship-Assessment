const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('event_booking_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || 'Something went wrong, please try again.';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  auth: {
    register: async (name, email, password) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      const data = await handleResponse(response);
      if (data.token) {
        localStorage.setItem('event_booking_token', data.token);
      }
      return data;
    },

    login: async (email, password) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(response);
      if (data.token) {
        localStorage.setItem('event_booking_token', data.token);
      }
      return data;
    },

    logout: () => {
      localStorage.removeItem('event_booking_token');
    },

    getMe: async () => {
      const token = localStorage.getItem('event_booking_token');
      if (!token) return null;
      
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    },
  },

  events: {
    getAll: async () => {
      const response = await fetch(`${BASE_URL}/events`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    },

    getDetails: async (id) => {
      const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    },
  },

  bookings: {
    create: async (eventId, seatsBooked) => {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ eventId, seatsBooked }),
      });
      return await handleResponse(response);
    },

    getUserBookings: async () => {
      const response = await fetch(`${BASE_URL}/bookings/user`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    },

    cancel: async (bookingId) => {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    },
  },
};
