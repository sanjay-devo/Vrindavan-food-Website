# Vrindavan Food Website

This is a static restaurant website using Firebase Realtime Database for registration, login, menu loading, order placement, order history, and admin dashboard. All prices are displayed in **Indian Rupees (₹)**.

## Features

- **User Authentication**: Register and login with email or mobile number
- **Admin Dashboard**: Manage orders, menu items, and view customers and analytics
- **Real-time Orders**: Orders sync in real-time from Firebase
- **Menu Management**: View and manage menu items from Firebase with prices in rupees
- **Customer Management**: See all registered customers and their order history
- **Analytics**: View top-selling items and daily revenue
- **Currency**: All prices and transactions in Indian Rupees (₹)

## Firebase Realtime Database Endpoint

The app uses the following Firebase Realtime Database endpoint:

- `https://vrindavan-website-default-rtdb.firebaseio.com`

## Firebase Database Structure

The following structure should exist in your Firebase Realtime Database:

```json
{
  "users": {
    "userId1": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "password": "hashed_password",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "userId2": {
      "fullName": "Admin User",
      "email": "admin@example.com",
      "mobile": "9876543211",
      "password": "hashed_password",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "usersByEmail": {
    "john@example.com": "userId1",
    "admin@example.com": "userId2"
  },
  "usersByMobile": {
    "9876543210": "userId1",
    "9876543211": "userId2"
  },
  "menu": {
    "item1": {
      "name": "Margherita Pizza",
      "category": "Pizza",
      "price": 299.99,
      "description": "Classic pizza with mozzarella and basil"
    }
  },
  "orders": {
    "order1": {
      "userId": "userId1",
      "customerName": "John Doe",
      "items": [
        {
          "name": "Margherita Pizza",
          "quantity": 1,
          "price": 299.99
        }
      ],
      "itemCount": 1,
      "total": 349.98,
      "status": "pending",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  }
}
```

## Firebase Realtime Database Rules

Set the following rules in the Firebase console under Realtime Database > Rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> **Note**: This rule is suitable for development and quick testing only. For production, implement proper authentication and more restrictive rules.

### More Secure Rules for Production

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true,
      ".indexOn": ["email", "mobile"]
    },
    "usersByEmail": {
      ".read": true,
      ".write": true
    },
    "usersByMobile": {
      ".read": true,
      ".write": true
    },
    "menu": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "orders": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Creating an Admin User

To create an admin user, manually add a user document to the Firebase Realtime Database with the `role` set to `"admin"`:

### Via Firebase Console

1. Navigate to your Firebase project
2. Go to **Realtime Database**
3. Under the `users` node, create a new entry with:
   ```json
   {
     "fullName": "Admin Name",
     "email": "admin@example.com",
     "mobile": "9876543210",
     "password": "admin_password",
     "role": "admin",
     "createdAt": "2024-01-01T00:00:00Z"
   }
   ```
4. Create lookup entries in `usersByEmail` and `usersByMobile`:
   - `usersByEmail/admin@example.com` → `userId`
   - `usersByMobile/9876543210` → `userId`

### Via Firebase CLI

You can also use the Firebase CLI to write data:

```bash
firebase database:set /users/admin_user_id '{"fullName":"Admin","email":"admin@example.com","mobile":"9876543210","password":"password","role":"admin","createdAt":"2024-01-01T00:00:00Z"}' --project your-project-id
```

## Usage

1. Open `index.html` in your browser
2. **Register** a new account via `register.html`
3. **Login** from `login.html`
   - Regular users are redirected to `menu.html`
   - Admin users are redirected to `admin_dashboard.html`
4. **Browse Menu**: View dishes at `menu.html`
5. **Place Orders**: Add items to cart and checkout
6. **View Orders**: See order history at `orders.html`
7. **Admin Dashboard**: Manage orders, menu, and customers at `admin_dashboard.html` (admin only)

## Admin Dashboard Features

### Dashboard
- View real-time statistics (total orders, revenue, today's orders, pending orders)
- See recent orders table
- Notification badge for pending orders

### Orders Management
- View all orders with status filtering
- Filter by order status (pending, preparing, ready, delivered, cancelled)
- Exportable order data

### Menu Management
- View all menu items
- Edit menu items (coming soon)
- Delete menu items (coming soon)

### Customers
- View all registered customers
- See customer email and mobile
- Track customer join date

### Analytics
- Top selling items with sales count
- Daily revenue tracking
- Business performance insights

## Authentication Flow

### Regular User Login
1. User enters email/mobile and password
2. System checks credentials
3. If role is `"user"` → redirect to home/menu
4. User data stored in localStorage

### Admin Login
1. Admin enters email/mobile and password
2. System checks credentials
3. If role is `"admin"` → redirect to admin_dashboard.html
4. Admin dashboard loads real-time data from Firebase
5. Only accessible with valid admin credentials

## Notes

- The app stores session data in `localStorage` under `vrindavanUser`
- All real-time data is fetched directly from Firebase without authentication tokens
- AdminDashboard automatically verifies admin role on page load
- Timestamps are stored in ISO 8601 format
- Passwords are stored in plaintext (for development only - encrypt in production)
- For production, implement proper authentication, password hashing, and security measures
