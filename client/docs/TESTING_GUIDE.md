# Backend Integration - Testing & Verification Guide

## ✅ Pre-Integration Checklist

Before testing, ensure:

- [ ] Backend is running on `http://localhost:5000`
  ```bash
  cd server
  npm run dev
  ```

- [ ] MongoDB is accessible (check backend logs for connection message)

- [ ] Frontend dependencies are installed
  ```bash
  cd client
  npm install  # or npx expo install
  ```

- [ ] No syntax errors
  ```bash
  npm run lint  # if configured
  ```

---

## 🧪 Integration Testing Steps

### Phase 1: Authentication Flow

#### Step 1.1: Test User Registration
1. Start frontend: `npm start` or `npx expo start`
2. Go to Register screen
3. Fill in details:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Sign Up"

**Expected Results:**
- ✅ Account created successfully
- ✅ User automatically logged in
- ✅ Redirected to Home screen
- ✅ See "Hello, John Doe! 👋" greeting
- ✅ Token saved in AsyncStorage

**Verify in DevTools:**
```javascript
// In DevTools console
AsyncStorage.getItem('auth_token').then(token => console.log('Token:', token));
AsyncStorage.getItem('auth_user').then(user => console.log('User:', user));
```

#### Step 1.2: Test User Login
1. Go to Login screen (if redirected, click Sign Up link then Log In)
2. Enter credentials:
   - Email: "john@example.com"
   - Password: "password123"
3. Click "Login"

**Expected Results:**
- ✅ Successful login
- ✅ Redirected to Home screen
- ✅ User greeting shows correct name
- ✅ Token is saved

#### Step 1.3: Test Logout
1. Go to Profile screen
2. Click Logout button (if implemented)

**Expected Results:**
- ✅ Token and user data cleared from AsyncStorage
- ✅ Redirected to Login screen
- ✅ Cannot access protected screens

#### Step 1.4: Test Persistent Login
1. Login successfully
2. Close and reopen the app
3. You should still be logged in

**Expected Results:**
- ✅ User data is preserved
- ✅ No need to login again
- ✅ Home screen loads immediately

### Phase 2: Event Management

#### Step 2.1: Test Event Listing
1. Make sure you're logged in
2. Go to Home screen
3. Wait for events to load

**Expected Results:**
- ✅ Shows loading skeleton briefly
- ✅ Events list appears
- ✅ Shows event title, location, price
- ✅ Multiple sections (Featured, Upcoming, All)

**Verify Backend Response:**
```javascript
// Check network tab in DevTools
// URL: http://localhost:5000/api/events
// Status: 200
// Response contains event array
```

#### Step 2.2: Test Event Details
1. Click on any event card
2. Navigate to Event Details screen

**Expected Results:**
- ✅ Event details load correctly
- ✅ Shows all event information
- ✅ Available tickets displayed
- ✅ Price shown clearly

#### Step 2.3: Test Add to Favourites
1. On Event Details screen
2. Click Heart icon (add to favourites)
3. Icon changes/style updates

**Expected Results:**
- ✅ Event added to favourites
- ✅ Heart icon shows as filled
- ✅ No error message
- ✅ Can add multiple favourites

**Verify in Console:**
```javascript
// Check if API call was made
// POST http://localhost:5000/api/events/{eventId}/favourite
// Status: 200
```

#### Step 2.4: Test Remove from Favourites
1. Click filled Heart icon again
2. Icon changes back to outline

**Expected Results:**
- ✅ Event removed from favourites
- ✅ Heart icon shows as outline
- ✅ No error message

#### Step 2.5: Test Favourites Screen
1. Go to Favourites tab
2. Should show all favourited events

**Expected Results:**
- ✅ Lists all favourited events
- ✅ Only shows events marked as favourite
- ✅ Can still click to view details
- ✅ Shows "No favourites" if empty

### Phase 3: Ticket Management

#### Step 3.1: Test Ticket Purchase
1. Go to Event Details screen
2. Select quantity (e.g., 2 tickets)
3. Click "Buy Tickets" button

**Expected Results:**
- ✅ Loading state shown ("Purchasing...")
- ✅ Success message appears
- ✅ Redirected to Tickets screen
- ✅ New ticket visible in list

**Verify:**
- Available tickets decreased by quantity purchased
- Total amount = price × quantity

#### Step 3.2: Test My Tickets Screen
1. Go to Tickets tab
2. View all purchased tickets

**Expected Results:**
- ✅ Shows all your tickets
- ✅ Displays event name, quantity, total amount
- ✅ Shows ticket status (pending/confirmed)
- ✅ Correct purchase date

#### Step 3.3: Test Ticket Details
1. Click on any ticket
2. Go to Ticket Details screen

**Expected Results:**
- ✅ Shows complete ticket information
- ✅ Links to event details
- ✅ Shows purchase date and status

#### Step 3.4: Test Insufficient Tickets
1. Try to buy more tickets than available
2. Enter quantity greater than availableTickets

**Expected Results:**
- ✅ Error message: "Not enough tickets available"
- ✅ Purchase fails
- ✅ User stays on screen with error

---

## 🐛 Error Handling Tests

### Test Network Error
1. Turn off backend server while app is running
2. Try to load events or perform any action

**Expected Results:**
- ✅ Shows error message
- ✅ "Retry" button appears
- ✅ User can try again after restarting backend

### Test Invalid Token
1. Manually modify token in AsyncStorage
2. Try to access protected endpoint

**Expected Results:**
- ✅ Get 401 Unauthorized error
- ✅ Auto-logout triggered
- ✅ Redirected to Login screen

### Test Validation Errors
1. **Login with invalid email:**
   - Expected: "Invalid email or password"

2. **Register with weak password:**
   - Expected: "Password must be at least 6 characters"

3. **Register with existing email:**
   - Expected: "Email already registered"

---

## 📊 Data Verification

### Verify Event Data Structure
```javascript
// Expected event object:
{
  _id: "mongodbId",
  title: "Event Title",
  description: "Description",
  date: "2026-12-25",
  time: "10:00",
  location: "Location Name",
  image: "image-url",
  ticketPrice: 50,
  totalTickets: 100,
  availableTickets: 85,  // Should decrease after purchase
  createdBy: { _id: "userId", name: "Admin", email: "admin@example.com" },
  createdAt: "2026-08-17T...",
  updatedAt: "2026-08-17T..."
}
```

### Verify Ticket Data Structure
```javascript
// Expected ticket object:
{
  _id: "ticketId",
  user: { _id: "userId", name: "John", email: "john@example.com" },
  event: { /* full event object */ },
  quantity: 2,
  totalAmount: 100,  // price × quantity
  status: "pending",  // or confirmed/cancelled
  createdAt: "2026-08-17T...",
  updatedAt: "2026-08-17T..."
}
```

### Verify User Data Structure
```javascript
// Expected user object:
{
  id: "userId",
  name: "John Doe",
  email: "john@example.com",
  role: "user"  // or "admin"
}
```

---

## 🔍 DevTools Debugging

### Check Network Requests
1. Open DevTools (React Native Debugger or Chrome DevTools)
2. Go to Network tab
3. Perform API action
4. Check:
   - Request URL is correct
   - Method is correct (GET, POST, etc.)
   - Status is 200 (or appropriate error code)
   - Response contains expected data
   - Authorization header includes Bearer token

### Check Storage
```javascript
// In DevTools console:

// Get token
AsyncStorage.getItem('auth_token').then(console.log);

// Get user
AsyncStorage.getItem('auth_user').then(console.log);

// Get all storage
AsyncStorage.getAllKeys().then(keys => 
  AsyncStorage.multiGet(keys).then(console.log)
);
```

### Check Console Logs
```javascript
// Look for:
// ✓ API response logs
// ✓ Error messages
// ✗ Unhandled exceptions
// ✗ Network errors

// Filter by:
console.log('API Request:', url);
console.log('API Response:', response);
console.error('API Error:', error);
```

---

## ✅ Final Verification Checklist

### Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Persistent login after app restart
- [ ] Token saved in AsyncStorage
- [ ] User data retrieved correctly
- [ ] Error messages display for invalid credentials

### Events
- [ ] Events list loads
- [ ] Event details show correct information
- [ ] Add to favourites works
- [ ] Remove from favourites works
- [ ] Favourites screen shows correct events
- [ ] Loading states appear
- [ ] Error handling works
- [ ] Event cards display properly

### Tickets
- [ ] Ticket purchase works
- [ ] Available tickets decrease after purchase
- [ ] Total amount calculated correctly
- [ ] My tickets screen loads
- [ ] Ticket details display
- [ ] Cannot buy more than available
- [ ] Loading states appear
- [ ] Error handling works

### Performance
- [ ] App starts quickly
- [ ] Navigation is smooth
- [ ] No crashes or freezes
- [ ] Images load properly
- [ ] API calls complete within reasonable time
- [ ] Memory usage is acceptable

### UI/UX
- [ ] Loading skeletons appear
- [ ] Error messages are clear
- [ ] Buttons are responsive
- [ ] Text is readable
- [ ] Layout is clean
- [ ] No console errors

---

## 📱 Browser/Device Testing

### Test on Different Platforms

#### Android
```bash
npx expo start --android
```

#### iOS
```bash
npx expo start --ios
```

#### Web
```bash
npx expo start --web
```

**Check:**
- [ ] All features work on each platform
- [ ] UI renders correctly
- [ ] Fonts load properly
- [ ] Images display
- [ ] Touch interactions work

---

## 🔧 Debugging Tips

### Enable Detailed Logging
Add to your services:
```typescript
console.log('API Request:', endpoint, options);
const response = await apiCall(endpoint, options);
console.log('API Response:', response);
```

### Check Request Headers
```javascript
// In apiClient.ts, log headers being sent
console.log('Headers:', headers);
console.log('Authorization:', headers.Authorization);
```

### Verify Backend Connection
```bash
# In terminal, test backend directly
curl http://localhost:5000/api/events

# Should return JSON array of events
```

### Check MongoDB Connection
```bash
# Look at backend logs
# Should see: "✓ MongoDB Connected Successfully"
```

---

## 🚀 Performance Testing

### Measure Load Times
```javascript
const startTime = performance.now();
const response = await eventService.getAllEvents();
const endTime = performance.now();
console.log(`Load time: ${endTime - startTime}ms`);

// Expected: < 2000ms for normal connection
```

### Test with Large Data Sets
1. Add many events to database
2. Load events screen
3. Scroll through list
4. Check performance

**Expected:**
- Smooth scrolling
- No lag
- Images load without blocking

### Memory Profiling
1. Use React Native Debugger
2. Go to Profiler tab
3. Perform actions
4. Check memory usage

**Expected:**
- Memory usage stable
- No memory leaks
- Garbage collection working

---

## 📋 Test Report Template

```markdown
## Integration Testing Report

### Date: 2026-08-17
### Tester: [Your Name]
### Backend Version: 1.0.0
### Frontend Version: 1.0.0

### Test Results

#### Authentication
- Registration: ✅ / ❌
- Login: ✅ / ❌
- Logout: ✅ / ❌
- Persistent Login: ✅ / ❌

#### Events
- Event List: ✅ / ❌
- Event Details: ✅ / ❌
- Add to Favourites: ✅ / ❌
- Favourites List: ✅ / ❌

#### Tickets
- Purchase Ticket: ✅ / ❌
- My Tickets: ✅ / ❌
- Ticket Details: ✅ / ❌

#### Performance
- Load Time (Events): ✅ / ❌
- Scroll Performance: ✅ / ❌
- Memory Usage: ✅ / ❌

#### Errors
- Network Errors Handled: ✅ / ❌
- Validation Errors Shown: ✅ / ❌
- Error Recovery Works: ✅ / ❌

### Issues Found
- Issue #1: ...
- Issue #2: ...

### Overall Status
- ✅ All tests passed
- ⚠️ Some issues found
- ❌ Critical failures

### Recommendations
- ...
```

---

## 🎯 Success Criteria

Integration is successful when:
1. ✅ All authentication flows work
2. ✅ All events are displayed correctly
3. ✅ Favourites system works
4. ✅ Ticket purchase system works
5. ✅ Error handling is robust
6. ✅ Loading states appear
7. ✅ No console errors
8. ✅ No memory leaks
9. ✅ All API calls use JWT tokens
10. ✅ User experience is smooth

---

## 🎓 Troubleshooting

### "Cannot reach backend"
```bash
# Check if backend is running
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Start backend
cd server && npm run dev
```

### "API returns 401"
```bash
# Check token in AsyncStorage
AsyncStorage.getItem('auth_token').then(console.log);

# If empty, login again
# If present, check if it's valid JWT
```

### "Events not loading"
1. Check backend logs for errors
2. Check network tab for failed requests
3. Verify API endpoint URL in config
4. Restart both frontend and backend

### "Ticket purchase fails"
1. Check available tickets > 0
2. Verify event exists
3. Check quantity is valid
4. Look at backend error message

---

## 📚 Resources

- [Backend Documentation](../../server/README.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [API Quick Reference](./API_QUICK_REFERENCE.md)
- [Evently Integration Summary](./INTEGRATION_SUMMARY.md)

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-17  
**Status:** Ready for Testing ✅
