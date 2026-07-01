import { Event } from "@/src/types/event";

export const featuredEvents: Event[] = [
  {
    id: "1",
    title: "Summer Soundwave 2024",
    description:
      "Experience an unforgettable night of live music featuring top artists from around the world.",
    category: "Music",
    tags: ["Music", "Festival", "Live"],

    image_url: require("../../assets/images/event2.jpg"),

    organizer_id: "org_1",
    organizer_name: "Soundwave Events",
    organizer_avatar: "../../assets/images/avatar1.jpg",

    location: "Los Angeles, CA",
    address: "Hollywood Bowl, Los Angeles, CA",
    latitude: 34.1122,
    longitude: -118.3391,

    event_date: "2026-06-12",
    start_time: "18:00",
    end_time: "23:00",

    ticket_price: 50,
    total_tickets: 1000,
    tickets_remaining: 428,

    status: "published",
    is_featured: true,

    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
    distance: "1.2 km away",
  },
  {
    id: "2",
    title: "Modernism Reimagined",
    description:
      "Explore modern art from renowned artists in a premium gallery experience.",
    category: "Art",
    tags: ["Art", "Exhibition"],

    image_url: require("../../assets/images/event1.jpg"),

    organizer_id: "org_2",
    organizer_name: "Art House",
    organizer_avatar: "../../assets/images/avatar2.jpg",

    location: "San Francisco, CA",
    address: "Modern Arts Museum, San Francisco",
    latitude: 37.7749,
    longitude: -122.4194,

    event_date: "2026-06-15",
    start_time: "09:00",
    end_time: "17:00",

    ticket_price: 35,
    total_tickets: 300,
    tickets_remaining: 95,

    status: "published",
    is_featured: true,

    created_at: "2026-05-03T10:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
    distance: "1.2 km away",
  },
];

export const upcomingEvents: Event[] = [
  {
    id: "3",
    title: "Neon Nights: Tech House",
    description:
      "Dance all night with international DJs and immersive lighting.",
    category: "Music",
    tags: ["Nightlife", "DJ"],

    image_url: require("../../assets/images/event1.jpg"),

    organizer_id: "org_3",
    organizer_name: "Neon Events",
    organizer_avatar: "../../assets/images/avatar3.jpg",

    location: "The Warehouse, LA",
    address: "Downtown LA",
    latitude: 34.0522,
    longitude: -118.2437,

    event_date: "2026-06-18",
    start_time: "20:00",
    end_time: "02:00",

    ticket_price: 40,
    total_tickets: 600,
    tickets_remaining: 180,

    status: "published",
    is_featured: false,

    created_at: "2026-05-06T10:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
    distance: "1.2 km away",
  },
  {
    id: "4",
    title: "Global Tech Summit 2026",
    description:
      "Meet founders, developers and investors shaping the future of technology.",
    category: "Tech",
    tags: ["Technology", "Conference"],

    image_url: require("../../assets/images/event3.jpg"),

    organizer_id: "org_4",
    organizer_name: "Tech World",
    organizer_avatar: "../../assets/images/avatar4.jpg",

    location: "Convention Center",
    address: "San Jose Convention Center",
    latitude: 37.3382,
    longitude: -121.8863,

    event_date: "2026-06-20",
    start_time: "10:00",
    end_time: "18:00",

    ticket_price: 120,
    total_tickets: 2000,
    tickets_remaining: 720,

    status: "published",
    is_featured: false,

    created_at: "2026-05-08T10:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
    distance: "1.2 km away",
  },
];

export const nearby: Event[] = [
  {
    id: "5",
    title: "Gourmet Street Food",
    description: "Taste delicious cuisines from the city's best food vendors.",
    category: "Food",
    tags: ["Food", "Outdoor"],

    image_url: require("../../assets/images/event4.jpg"),

    organizer_id: "org_5",
    organizer_name: "Food Fest",
    organizer_avatar: "../../assets/images/avatar5.jpg",

    location: "City Square",
    address: "Downtown",
    latitude: 6.5244,
    longitude: 3.3792,

    event_date: "2026-06-25",
    start_time: "12:00",
    end_time: "22:00",

    ticket_price: 15,
    total_tickets: 500,
    tickets_remaining: 200,

    status: "published",
    is_featured: false,

    created_at: "2026-05-10T10:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
    distance: "1.2 km away",
  },
  {
    id: "6",
    title: "Jazz in the Park",
    description:
      "An evening of smooth jazz under the stars with live performances.",
    category: "Music",
    tags: ["Jazz", "Outdoor"],

    image_url: require("../../assets/images/event5.jpg"),

    organizer_id: "org_6",
    organizer_name: "City Music",
    organizer_avatar: "../../assets/images/avatar6.jpg",

    location: "Central Park",
    address: "Central Park, New York",
    latitude: 40.7851,
    longitude: -73.9683,

    event_date: "2026-06-27",
    start_time: "19:00",
    end_time: "22:00",

    ticket_price: 25,
    total_tickets: 800,
    tickets_remaining: 500,

    status: "published",
    is_featured: false,

    created_at: "2026-05-11T10:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
    distance: "1.2 km away",
  },
];
