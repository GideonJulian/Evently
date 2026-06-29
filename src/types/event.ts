// src/types/event.ts

export interface Event {
  id: string;

  // Basic Info
  title: string;
  description: string;
  category: string;
  tags: string[];

  // Images
  image_url: string;

  // Organizer
  organizer_id: string;
  organizer_name: string;
  organizer_avatar: string;

  // Location
  location: string;
  address: string;
  latitude: number;
  longitude: number;

  // Date & Time
  event_date: string;
  start_time: string;
  end_time: string;

  // Tickets
  ticket_price: number;
  total_tickets: number;
  tickets_remaining: number;

  // Status
  status: "draft" | "published" | "cancelled";

  // Extra
  is_featured: boolean;
  created_at: string;
  updated_at: string;

  distance?: string;
}
