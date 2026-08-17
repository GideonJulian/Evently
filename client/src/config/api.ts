// `localhost` on a physical device refers to the device, not this computer.
// Override this value with EXPO_PUBLIC_API_URL when the server address changes.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.3:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,

  // Events
  EVENTS_LIST: `${API_BASE_URL}/events`,
  EVENTS_GET: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_CREATE: `${API_BASE_URL}/events`,
  EVENTS_UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,

  // Favourites
  FAVOURITES_ADD: (id: string) => `${API_BASE_URL}/events/${id}/favourite`,
  FAVOURITES_REMOVE: (id: string) => `${API_BASE_URL}/events/${id}/favourite`,
  FAVOURITES_LIST: `${API_BASE_URL}/events/favourites`,

  // Tickets
  TICKETS_PURCHASE: `${API_BASE_URL}/tickets/purchase`,
  TICKETS_MY_TICKETS: `${API_BASE_URL}/tickets/my-tickets`,
  TICKETS_GET: (id: string) => `${API_BASE_URL}/tickets/${id}`,
  TICKETS_ALL: `${API_BASE_URL}/tickets`, // Admin only
};

export default API_BASE_URL;
