// src/services/event.service.ts
import { featuredEvents, upcomingEvents, nearby } from "../data/events";
export const EventService = {
  async getEvent(id: string) {
    // Supabase API later

    return null;
  },

  async getEvents() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return [...featuredEvents, ...upcomingEvents, ...nearby];
  },
};
