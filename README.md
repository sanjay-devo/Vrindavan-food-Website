# Vrindavan Food Website

This is a static restaurant website using direct Firebase Realtime Database REST calls for registration, login, menu loading, order placement, and order history.

## Fixed issue

The app now uses the correct Realtime Database endpoint:

- `https://vrindavan-website-default-rtdb.firebaseio.com`

This was updated in:

- `login.html`
- `register.html`
- `menu.html`
- `orders.html`

## Firebase Realtime Database rules

If you are using direct browser access without Firebase Auth, set the following rules in the Firebase console under Realtime Database > Rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> Note: This rule is suitable for development and quick testing only. For production, tighten security using user authentication and more specific rules.

### More secure sample rules for this app

If you want a slightly more structured approach while still allowing client access, use:

```json
{
  "rules": {
    "menu": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": true,
      ".write": true,
      ".indexOn": ["email", "mobile"]
    },
    "orders": {
      ".read": true,
      ".write": true
    }
  }
}
```

> Important: The `.indexOn` rule is required for Realtime Database queries that use `orderBy` on `email` or `mobile` under `/users`.
>
> This project now also supports direct lookup nodes under `/usersByEmail` and `/usersByMobile`, so the app does not need the `/users` query index for login and registration checks.
>
> If you still want to keep query support, add `.indexOn`: `["email", "mobile"]` under `/users`.

## Usage

1. Open `index.html` in your browser.
2. Register a new account via `register.html`.
3. Login from `login.html`.
4. Browse menu and place orders through `menu.html`.
5. Review and manage your cart at `cart.html`.
6. View historical orders in `orders.html`.

## Notes

- The app stores session data in `localStorage` under `vrindavanUser`.
- The Firebase endpoint is loaded directly into client-side JavaScript.
- For production, replace open rules with authenticated rules and do not keep `.read` / `.write` globally enabled.
