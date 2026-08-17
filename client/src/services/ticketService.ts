import { API_ENDPOINTS } from '../config/api';
import { apiCall } from '../utils/apiClient';
import { Event } from './eventService';

export interface TicketPayload {
  eventId: string;
  quantity: number;
}

export interface Ticket {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  event: Event;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const ticketService = {
  async purchaseTicket(payload: TicketPayload): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    return await apiCall<Ticket>(
      API_ENDPOINTS.TICKETS_PURCHASE,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        requiresAuth: true,
      }
    );
  },

  async getMyTickets(): Promise<{ success: boolean; data?: Ticket[]; error?: string }> {
    return await apiCall<Ticket[]>(
      API_ENDPOINTS.TICKETS_MY_TICKETS,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );
  },

  async getTicketById(id: string): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    return await apiCall<Ticket>(
      API_ENDPOINTS.TICKETS_GET(id),
      {
        method: 'GET',
        requiresAuth: true,
      }
    );
  },

  async getAllTickets(): Promise<{ success: boolean; data?: Ticket[]; error?: string }> {
    return await apiCall<Ticket[]>(
      API_ENDPOINTS.TICKETS_ALL,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );
  },
};
