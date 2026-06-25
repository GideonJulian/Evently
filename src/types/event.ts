// src/types/event.ts

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  organizer_name: string;
  organizer_avatar: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  event_date: string;
  ticket_price: number;
  category: string;
  tags: string[];
}