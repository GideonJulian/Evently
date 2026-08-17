import { useState, useCallback } from 'react';
import { ticketService, Ticket } from '../services/ticketService';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getMyTickets();
      if (response.success && response.data) {
        setTickets(response.data);
        return response.data;
      } else {
        const err = response.error || 'Failed to fetch tickets';
        setError(err);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseTicket = useCallback(
    async (eventId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await ticketService.purchaseTicket({
          eventId,
          quantity,
        });
        if (response.success && response.data) {
          // Add new ticket to list
          setTickets((prev) => [...prev, response.data!]);
          return response.data;
        } else {
          const err = response.error || 'Failed to purchase ticket';
          setError(err);
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTicketById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getTicketById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        const err = response.error || 'Failed to fetch ticket';
        setError(err);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tickets,
    loading,
    error,
    fetchMyTickets,
    purchaseTicket,
    fetchTicketById,
  };
}
