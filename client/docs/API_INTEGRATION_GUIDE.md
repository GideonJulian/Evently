# Evently - Backend API Integration Guide

## 📋 Overview

This guide explains how the Evently frontend is integrated with the backend API. The integration uses a clean, modular architecture with service layers, contexts, and custom hooks.

---

## 🏗️ Architecture

### Directory Structure

```
src/
├── config/
│   └── api.ts                 # API configuration and endpoints
├── services/
│   ├── authService.ts         # Authentication API calls
│   ├── eventService.ts        # Event API calls
│   └── ticketService.ts       # Ticket API calls
├── context/
│   └── AuthContext.tsx        # Global auth state management
├── hooks/
│   ├── useApi.ts              # Generic API hook
│   ├── useEvents.ts           # Events-specific hook
│   └── useTickets.ts          # Tickets-specific hook
├── utils/
│   ├── apiClient.ts           # HTTP client with auth
│   └── tokenManager.ts        # Token storage management
└── types/
    └── event.ts               # TypeScript interfaces
```

---

## 🔑 Key Components

### 1. API Configuration (`src/config/api.ts`)

Centralized API endpoint management. Update the base URL here if needed:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

// All endpoints are defined here
export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  EVENTS_LIST: `${API_BASE_URL}/events`,
  // ... more endpoints
};
```

### 2. Token Management (`src/utils/tokenManager.ts`)

Handles secure token storage and retrieval using AsyncStorage:

```typescript
import { tokenManager } from '@/src/utils/tokenManager';

// Save token after login
await tokenManager.saveToken(token);

// Retrieve token
const token = await tokenManager.getToken();

// Clear all auth data on logout
await tokenManager.clearAll();
```

### 3. API Client (`src/utils/apiClient.ts`)

Generic HTTP client that automatically attaches JWT tokens:

```typescript
import { apiCall } from '@/src/utils/apiClient';

const response = await apiCall<ResponseType>(
  endpoint,
  {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth: true,  // Automatically adds Bearer token
  }
);
```

### 4. Service Layers

#### Authentication Service

```typescript
import { authService } from '@/src/services/authService';

// Register
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
});

// Login
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123',
});

// Logout
await authService.logout();
```

#### Event Service

```typescript
import { eventService } from '@/src/services/eventService';

// Get all events
const response = await eventService.getAllEvents();

// Get single event
const response = await eventService.getEventById(eventId);

// Add to favourites
const response = await eventService.addToFavourites(eventId);

// Remove from favourites
const response = await eventService.removeFromFavourites(eventId);

// Get user's favourites
const response = await eventService.getFavourites();
```

#### Ticket Service

```typescript
import { ticketService } from '@/src/services/ticketService';

// Purchase ticket
const response = await ticketService.purchaseTicket({
  eventId: 'event123',
  quantity: 2,
});

// Get user's tickets
const response = await ticketService.getMyTickets();

// Get single ticket
const response = await ticketService.getTicketById(ticketId);
```

### 5. Auth Context (`src/context/AuthContext.tsx`)

Global authentication state management:

```typescript
import { useAuth } from '@/src/context/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainScreen user={user} />;
}
```

Available methods:
- `login(email, password)` - Login user
- `register(name, email, password)` - Register user
- `logout()` - Logout and clear auth state
- `refreshUser()` - Refresh user data from storage

### 6. Custom Hooks

#### Generic API Hook

```typescript
import { useApi } from '@/src/hooks/useApi';

const { data, loading, error, execute } = useApi<ResponseType>({
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.log('Error:', error),
});

// Use hook
await execute(endpoint, { method: 'GET' });
```

#### Events Hook

```typescript
import { useEvents } from '@/src/hooks/useEvents';

const {
  events,
  loading,
  error,
  fetchEvents,
  fetchEventById,
  toggleFavourite,
  fetchFavourites,
} = useEvents();

useEffect(() => {
  fetchEvents(); // Fetch all events
}, [fetchEvents]);
```

#### Tickets Hook

```typescript
import { useTickets } from '@/src/hooks/useTickets';

const {
  tickets,
  loading,
  error,
  fetchMyTickets,
  purchaseTicket,
  fetchTicketById,
} = useTickets();

// Purchase ticket
const newTicket = await purchaseTicket(eventId, quantity);
```

---

## 🔄 Complete Usage Examples

### Login Screen

```typescript
import { useAuth } from '@/src/context/AuthContext';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response.success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', response.error);
    }
  };

  return (
    // ... UI components
  );
}
```

### Home Screen - Fetch Events

```typescript
import { useEvents } from '@/src/hooks/useEvents';

export default function HomeScreen() {
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
    />
  );
}
```

### Favourites - Add/Remove

```typescript
import { useEvents } from '@/src/hooks/useEvents';

export default function EventScreen() {
  const { toggleFavourite } = useEvents();
  const [isFavourite, setIsFavourite] = useState(false);

  const handleToggleFavourite = async () => {
    const success = await toggleFavourite(eventId, isFavourite);
    if (success) {
      setIsFavourite(!isFavourite);
    }
  };

  return (
    <TouchableOpacity onPress={handleToggleFavourite}>
      <Icon name={isFavourite ? 'heart' : 'heart-outline'} />
    </TouchableOpacity>
  );
}
```

### Ticket Purchase

```typescript
import { useTickets } from '@/src/hooks/useTickets';
import { Alert } from 'react-native';

export default function BuyTicketsScreen() {
  const { purchaseTicket, loading } = useTickets();
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    const ticket = await purchaseTicket(eventId, quantity);
    if (ticket) {
      Alert.alert('Success', 'Ticket purchased successfully!');
    }
  };

  return (
    <TouchableOpacity onPress={handlePurchase} disabled={loading}>
      <Text>{loading ? 'Purchasing...' : 'Buy Tickets'}</Text>
    </TouchableOpacity>
  );
}
```

---

## 🔐 Error Handling

All API responses follow a consistent pattern:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Usage
const response = await eventService.getAllEvents();

if (response.success) {
  console.log('Data:', response.data);
} else {
  console.error('Error:', response.error);
}
```

---

## 📝 Response Types

### Event Response

```typescript
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  ticketPrice: number;
  totalTickets: number;
  availableTickets: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Ticket Response

```typescript
interface Ticket {
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
```

---

## 🚀 Best Practices

### 1. Always Handle Loading & Error States

```typescript
const { data, loading, error } = useEvents();

if (loading) return <LoadingComponent />;
if (error) return <ErrorComponent message={error} />;
return <DataComponent data={data} />;
```

### 2. Use Authentication Context

Always wrap your app with `AuthProvider` in the root layout:

```typescript
// app/_layout.tsx
import { AuthProvider } from '@/src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
```

### 3. Check Authentication Before Protected Routes

```typescript
const { isAuthenticated } = useAuth();

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/(auth)/login');
  }
}, [isAuthenticated]);
```

### 4. Keep API Config Centralized

All API endpoints are in `src/config/api.ts`. Update the base URL there if your backend URL changes.

### 5. Use Services Instead of Fetch

Instead of:
```typescript
// ❌ Don't do this
fetch('http://localhost:5000/api/events');
```

Do this:
```typescript
// ✅ Do this
import { eventService } from '@/src/services/eventService';
const response = await eventService.getAllEvents();
```

---

## 🔗 Backend Connection

### Backend Running On
```
http://localhost:5000/api
```

### Start Backend
```bash
cd server
npm run dev
```

### Update Backend URL
If your backend is running on a different URL, update it in:
```typescript
// src/config/api.ts
const API_BASE_URL = 'your-backend-url/api';
```

---

## 📦 Dependencies Used

- `@react-native-async-storage/async-storage` - Token persistence
- `expo-router` - Navigation
- `react` - UI framework
- No additional HTTP library needed (uses native `fetch`)

---

## ✅ Testing API Integration

### 1. Test Login
- Use: `useAuth()` hook
- Expected: Token saved in AsyncStorage

### 2. Test Event Fetching
- Use: `useEvents()` hook
- Expected: List of events from backend

### 3. Test Ticket Purchase
- Use: `useTickets()` hook
- Expected: New ticket created with reduced available tickets

### 4. Test Favourites
- Use: `useEvents()` hook with `toggleFavourite()`
- Expected: Event added/removed from user's favourites

---

## 🐛 Troubleshooting

### "Cannot reach backend"
- Check if backend is running: `npm run dev` in `/server`
- Check if API_BASE_URL is correct in `src/config/api.ts`
- Check firewall/network settings

### "Token not saving"
- Check if AsyncStorage is properly imported
- Ensure device has storage permission

### "API returns 401 (Unauthorized)"
- Token might be expired or invalid
- Try logging out and logging back in
- Check token is being sent in Authorization header

### "CORS errors"
- Backend should have CORS enabled (already configured)
- Check API_BASE_URL protocol (http/https)

---

## 📚 Additional Resources

- [Backend API Documentation](../../server/README.md)
- [React Native AsyncStorage Docs](https://react-native-async-storage.github.io/docs/)
- [Expo Router Documentation](https://expo.dev/routing)

---

**Last Updated:** 2026-08-17
**Version:** 1.0.0
