import { API_ENDPOINTS } from '../config/api';
import { apiCall } from '../utils/apiClient';

export interface EventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  ticketPrice: number;
  totalTickets: number;
}

export interface Event extends EventPayload {
  _id: string;
  availableTickets: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const eventService = {
  async getAllEvents(): Promise<{ success: boolean; data?: Event[]; error?: string }> {
    return await apiCall<Event[]>(
      API_ENDPOINTS.EVENTS_LIST,
      { method: 'GET' }
    );
  },

  async getEventById(id: string): Promise<{ success: boolean; data?: Event; error?: string }> {
    return await apiCall<Event>(
      API_ENDPOINTS.EVENTS_GET(id),
      { method: 'GET' }
    );
  },

  async createEvent(event: EventPayload): Promise<{ success: boolean; data?: Event; error?: string }> {
    return await apiCall<Event>(
      API_ENDPOINTS.EVENTS_CREATE,
      {
        method: 'POST',
        body: JSON.stringify(event),
        requiresAuth: true,
      }
    );
  },

  async updateEvent(id: string, event: Partial<EventPayload>): Promise<{ success: boolean; data?: Event; error?: string }> {
    return await apiCall<Event>(
      API_ENDPOINTS.EVENTS_UPDATE(id),
      {
        method: 'PUT',
        body: JSON.stringify(event),
        requiresAuth: true,
      }
    );
  },

  async deleteEvent(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return await apiCall(
      API_ENDPOINTS.EVENTS_DELETE(id),
      {
        method: 'DELETE',
        requiresAuth: true,
      }
    );
  },

  async addToFavourites(eventId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return await apiCall(
      API_ENDPOINTS.FAVOURITES_ADD(eventId),
      {
        method: 'POST',
        requiresAuth: true,
      }
    );
  },

  async removeFromFavourites(eventId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return await apiCall(
      API_ENDPOINTS.FAVOURITES_REMOVE(eventId),
      {
        method: 'DELETE',
        requiresAuth: true,
      }
    );
  },

  async getFavourites(): Promise<{ success: boolean; data?: Event[]; error?: string }> {
    return await apiCall<Event[]>(
      API_ENDPOINTS.FAVOURITES_LIST,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );
  },
};
