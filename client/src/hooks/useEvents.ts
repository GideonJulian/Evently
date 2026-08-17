import { useState, useCallback } from 'react';
import { eventService, Event } from '../services/eventService';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getAllEvents();
      if (response.success && response.data) {
        setEvents(response.data);
        return response.data;
      } else {
        const err = response.error || 'Failed to fetch events';
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

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getEventById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        const err = response.error || 'Failed to fetch event';
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

  const toggleFavourite = useCallback(
    async (eventId: string, isFavourite: boolean) => {
      try {
        if (isFavourite) {
          const response = await eventService.removeFromFavourites(eventId);
          return response.success;
        } else {
          const response = await eventService.addToFavourites(eventId);
          return response.success;
        }
      } catch (err) {
        console.error('Error toggling favourite:', err);
        return false;
      }
    },
    []
  );

  const fetchFavourites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getFavourites();
      if (response.success && response.data) {
        return response.data;
      } else {
        const err = response.error || 'Failed to fetch favourites';
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
    events,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    toggleFavourite,
    fetchFavourites,
  };
}
