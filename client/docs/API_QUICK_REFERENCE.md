# API Integration - Quick Reference

## 🚀 Quick Start

### 1. Setup
```typescript
// Wrap app with AuthProvider (already done in app/_layout.tsx)
import { AuthProvider } from '@/src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
```

### 2. Use in Components
```typescript
import { useAuth } from '@/src/context/AuthContext';
import { useEvents } from '@/src/hooks/useEvents';

export default function MyComponent() {
  const { user, login, logout } = useAuth();
  const { events, fetchEvents, toggleFavourite } = useEvents();
  
  // Use hooks...
}
```

---

## 📍 Common API Calls

### Authentication

#### Login
```typescript
import { useAuth } from '@/src/context/AuthContext';

const { login } = useAuth();
const response = await login('email@example.com', 'password');

if (response.success) {
  console.log('Login successful');
} else {
  console.log('Error:', response.error);
}
```

#### Register
```typescript
const { register } = useAuth();
const response = await register('John Doe', 'email@example.com', 'password');

if (response.success) {
  console.log('Registration successful');
}
```

#### Logout
```typescript
const { logout } = useAuth();
await logout();
```

#### Check Authentication Status
```typescript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('User:', user.name);
}
```

---

### Events

#### Fetch All Events
```typescript
import { useEvents } from '@/src/hooks/useEvents';

const { events, loading, error, fetchEvents } = useEvents();

useEffect(() => {
  fetchEvents();
}, []);

if (loading) return <LoadingScreen />;
if (error) return <Text>{error}</Text>;

return (
  <FlatList
    data={events}
    renderItem={({ item }) => <EventCard event={item} />}
  />
);
```

#### Get Single Event
```typescript
const { fetchEventById } = useEvents();

useEffect(() => {
  const getEvent = async () => {
    const event = await fetchEventById(eventId);
    console.log('Event:', event);
  };
  
  getEvent();
}, [eventId]);
```

#### Add to Favourites
```typescript
const { toggleFavourite } = useEvents();

const handleAddFavourite = async () => {
  const success = await toggleFavourite(eventId, false);
  if (success) {
    console.log('Added to favourites');
  }
};
```

#### Remove from Favourites
```typescript
const success = await toggleFavourite(eventId, true);
if (success) {
  console.log('Removed from favourites');
}
```

#### Get User's Favourites
```typescript
const { fetchFavourites } = useEvents();

const favourites = await fetchFavourites();
```

---

### Tickets

#### Purchase Ticket
```typescript
import { useTickets } from '@/src/hooks/useTickets';

const { purchaseTicket, loading } = useTickets();

const handlePurchase = async () => {
  const ticket = await purchaseTicket(eventId, quantity);
  
  if (ticket) {
    console.log('Ticket purchased:', ticket);
  }
};
```

#### Get My Tickets
```typescript
const { tickets, fetchMyTickets } = useTickets();

useEffect(() => {
  fetchMyTickets();
}, []);

return (
  <FlatList
    data={tickets}
    renderItem={({ item }) => <TicketCard ticket={item} />}
  />
);
```

#### Get Single Ticket
```typescript
const { fetchTicketById } = useTickets();

const ticket = await fetchTicketById(ticketId);
```

---

## 🎯 Component Examples

### Login Page
```typescript
import { useAuth } from '@/src/context/AuthContext';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response.success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', response.error);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Events List
```typescript
import { useEvents } from '@/src/hooks/useEvents';

export default function EventsScreen() {
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/event/${item._id}`)}>
          <Text>{item.title}</Text>
          <Text>${item.ticketPrice}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id}
    />
  );
}
```

### Event Details with Purchase
```typescript
import { useEvents } from '@/src/hooks/useEvents';
import { useTickets } from '@/src/hooks/useTickets';

export default function EventDetailScreen({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const { fetchEventById } = useEvents();
  const { purchaseTicket, loading } = useTickets();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const getEvent = async () => {
      const data = await fetchEventById(id);
      setEvent(data);
    };
    getEvent();
  }, [id]);

  const handlePurchase = async () => {
    const ticket = await purchaseTicket(id, quantity);
    if (ticket) {
      Alert.alert('Success', 'Ticket purchased!');
    }
  };

  if (!event) return <Loader />;

  return (
    <View>
      <Text>{event.title}</Text>
      <Text>${event.ticketPrice}</Text>
      <TextInput
        value={String(quantity)}
        onChangeText={(q) => setQuantity(parseInt(q))}
      />
      <TouchableOpacity onPress={handlePurchase} disabled={loading}>
        <Text>{loading ? 'Purchasing...' : 'Buy Tickets'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Favourites Screen
```typescript
import { useEvents } from '@/src/hooks/useEvents';

export default function FavouritesScreen() {
  const { fetchFavourites } = useEvents();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFavourites = async () => {
      setLoading(true);
      const data = await fetchFavourites();
      if (data) setFavourites(data);
      setLoading(false);
    };
    getFavourites();
  }, []);

  if (loading) return <Loader />;

  return (
    <FlatList
      data={favourites}
      renderItem={({ item }) => (
        <EventCard event={item} />
      )}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No favourites yet</Text>}
    />
  );
}
```

### My Tickets Screen
```typescript
import { useTickets } from '@/src/hooks/useTickets';

export default function TicketsScreen() {
  const { tickets, loading, error, fetchMyTickets } = useTickets();

  useFocusEffect(
    useCallback(() => {
      fetchMyTickets();
    }, [fetchMyTickets])
  );

  if (loading) return <Loader />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={tickets}
      renderItem={({ item }) => (
        <View>
          <Text>{item.event.title}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Total: ${item.totalAmount}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No tickets purchased</Text>}
    />
  );
}
```

---

## 🔧 Error Handling

### Consistent Error Pattern
```typescript
const response = await someService.someMethod();

if (response.success) {
  // Handle success
  console.log(response.data);
} else {
  // Handle error
  Alert.alert('Error', response.error);
}
```

### Error in Hooks
```typescript
const { data, loading, error } = useApi();

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text>{error}</Text>
      <TouchableOpacity onPress={() => refetch()}>
        <Text>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 📦 Data Types

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
```

### Event
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
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
```

### Ticket
```typescript
interface Ticket {
  _id: string;
  user: User;
  event: Event;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔄 Navigation with Data

### Navigate with ID
```typescript
router.push({
  pathname: '/event/[id]',
  params: { id: event._id },
});
```

### Redirect After Action
```typescript
const response = await purchaseTicket(eventId, quantity);
if (response.success) {
  router.push('/tickets'); // Navigate to tickets
}
```

### Conditional Navigation
```typescript
const { isAuthenticated } = useAuth();

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/(auth)/login');
  }
}, [isAuthenticated]);
```

---

## ⚡ Performance Tips

### Memoize Callbacks
```typescript
const handleFavourite = useCallback(
  async (eventId) => {
    await toggleFavourite(eventId, isFavourite);
  },
  [isFavourite, toggleFavourite]
);
```

### Cache Events
```typescript
const { events, fetchEvents } = useEvents();

useEffect(() => {
  if (events.length === 0) {
    fetchEvents();
  }
}, []);
```

### Use FlatList for Large Lists
```typescript
<FlatList
  data={events}
  renderItem={({ item }) => <EventCard event={item} />}
  keyExtractor={(item) => item._id}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
/>
```

---

## 🐛 Debugging

### Log API Calls
```typescript
const response = await eventService.getAllEvents();
console.log('API Response:', response);
```

### Check Token
```typescript
const token = await tokenManager.getToken();
console.log('Token:', token);
```

### Monitor State
```typescript
console.log('Auth State:', { user, isAuthenticated, isLoading });
```

### Network Debugging
- Use React Native Debugger
- Check network tab for API calls
- Verify request/response format

---

## 🔗 Useful Links

- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Backend API Documentation](../../server/README.md)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Docs](https://expo.dev/routing)

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-17
