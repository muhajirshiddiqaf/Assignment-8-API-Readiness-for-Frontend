# Todo App Frontend - Assignment 9

Frontend React application untuk Todo App dengan fitur authentication dan navigasi menggunakan React Router.

## Features

- ✅ User Registration dengan email & password
- ✅ User Login dengan email & password
- ✅ JWT Token Authentication
- ✅ Protected Dashboard
- ✅ Responsive Design
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ Navigasi URL dengan React Router

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **React Router DOM** - Routing
- **CSS** - Styling
- **Fetch API** - HTTP Requests

## Project Structure

```
src/
├── components/
│   ├── LoginForm.tsx      # Login form component
│   ├── RegisterForm.tsx   # Register form component
│   ├── Dashboard.tsx      # Dashboard after login
│   └── DebugInfo.tsx      # Debug info overlay
├── hooks/
│   └── useAuth.ts         # Authentication custom hook
├── services/
│   └── authService.ts     # API service for auth
├── types/
│   └── auth.ts           # TypeScript interfaces
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## 🚀 Cara Menjalankan Frontend (FE)

### 1. **Masuk ke folder frontend**
```bash
cd frontend
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Jalankan development server**
```bash
npm run dev
```

### 4. **Akses aplikasi di browser**
```
http://localhost:5173
```

### 5. **Navigasi Halaman**
- **/login** — Halaman login
- **/register** — Halaman register
- **/dashboard** — Dashboard (hanya bisa diakses jika sudah login)
- Navigasi otomatis setelah login/register/logout

### 6. **Fitur Navigasi**
- Menggunakan React Router DOM
- URL berubah sesuai halaman
- Proteksi route dashboard (redirect ke login jika belum login)
- Link antar halaman login/register

### 7. **Jika ada error**
- Pastikan backend berjalan di port 3000
- Pastikan proxy di `vite.config.ts` sudah benar
- Cek console browser dan terminal untuk pesan error

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## API Integration

Frontend terintegrasi dengan backend API dari Assignment 8:

- **Base URL**: `http://localhost:3000/api`
- **Proxy**: Configured in `vite.config.ts`
- **Authentication**: JWT Bearer Token

### Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## Authentication Flow

1. **Initial Load**: Check localStorage for existing token
2. **Login**: Submit credentials → Receive JWT token → Store in localStorage
3. **Register**: Submit user data → Create account → Auto-navigate ke login
4. **Protected Routes**: Verify token before accessing dashboard
5. **Logout**: Clear localStorage → Redirect to login

## State Management

Menggunakan custom hook `useAuth` untuk state management:

```typescript
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  login,
  register,
  logout
} = useAuth();
```

## Form Validation

### Login Form
- Email required & valid format
- Password required

### Register Form
- Username required
- Email required & valid format
- Password required & min 6 characters
- Confirm password must match

## Error Handling

- Network errors
- Authentication errors
- Validation errors
- User-friendly error messages

## Security Features

- Password not stored in localStorage
- Token validation on each request
- Auto-logout on token expiration
- Form validation to prevent XSS

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

No environment variables required for development. API proxy is configured in `vite.config.ts`.

## Testing

1. **Register New User**:
   - Navigate to sign up form
   - Fill in user details
   - Submit form
   - Should redirect to login

2. **Login Existing User**:
   - Navigate to login form
   - Enter credentials
   - Submit form
   - Should redirect to dashboard

3. **Protected Routes**:
   - Try accessing dashboard without login
   - Should redirect to login form

4. **Logout**:
   - Click logout button
   - Should clear session and redirect to login

## Troubleshooting

### Common Issues

1. **Backend not running**:
   - Ensure backend server is running on port 3000
   - Check console for connection errors

2. **CORS errors**:
   - Backend CORS is configured for localhost:5173
   - Check backend CORS settings

3. **Token issues**:
   - Clear localStorage and try again
   - Check token expiration

### Debug Mode

Open browser developer tools to see:
- Network requests
- Console errors
- Local storage contents

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Maintain consistent code style
4. Add proper error handling
5. Test all authentication flows

## License

This project is part of Assignment 9 for authentication implementation. 