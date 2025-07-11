# Assignment 9: Implementasi Fitur Sign Up & Sign In

## Overview
Assignment ini bertujuan untuk mengembangkan fitur otentikasi (sign up & sign in) yang dapat digunakan pada aplikasi Todo List, serta menjelaskan langkah teknis implementasinya baik di backend maupun frontend.

## Fitur yang Diimplementasikan

### 1. Backend Authentication (Sudah ada dari Assignment 8)
- ✅ User registration dengan email & password
- ✅ User login dengan email & password
- ✅ JWT token authentication
- ✅ Password hashing dengan bcrypt
- ✅ Protected routes dengan middleware
- ✅ User profile endpoint

### 2. Frontend Authentication (Baru)
- ✅ Form login dengan email & password
- ✅ Form register dengan username, email, password, dan confirm password
- ✅ State management untuk authentication
- ✅ Protected dashboard untuk user yang sudah login
- ✅ Auto-redirect berdasarkan status authentication
- ✅ Error handling dan validation
- ✅ Loading states
- ✅ Responsive design

## Struktur Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx      # Form login
│   │   ├── RegisterForm.tsx   # Form register
│   │   └── Dashboard.tsx      # Dashboard setelah login
│   ├── hooks/
│   │   └── useAuth.ts         # Custom hook untuk auth state
│   ├── services/
│   │   └── authService.ts     # Service untuk API calls
│   ├── types/
│   │   └── auth.ts           # Type definitions
│   ├── App.tsx               # Main component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Flow Implementasi

### 1. Setup Frontend Project
```bash
# Buat folder frontend
mkdir frontend
cd frontend

# Inisialisasi project
npm init -y

# Install dependencies
npm install vite @vitejs/plugin-react react react-dom
npm install -D @types/react @types/react-dom

# Setup konfigurasi
# - vite.config.ts (proxy ke backend)
# - tsconfig.json
# - index.html
```

### 2. Implementasi Authentication Service
- **File**: `src/services/authService.ts`
- **Fungsi**: 
  - Handle API calls ke backend
  - Manage localStorage untuk token dan user data
  - Provide methods untuk login, register, logout

### 3. Implementasi Custom Hook
- **File**: `src/hooks/useAuth.ts`
- **Fungsi**:
  - State management untuk authentication
  - Auto-check authentication status saat app load
  - Provide methods untuk login, register, logout
  - Handle loading states dan error handling

### 4. Implementasi UI Components

#### LoginForm Component
- Form dengan email dan password
- Validation client-side
- Error handling
- Loading state
- Link ke register form

#### RegisterForm Component
- Form dengan username, email, password, confirm password
- Password validation (min 6 chars, match confirmation)
- Error handling
- Loading state
- Link ke login form

#### Dashboard Component
- Tampilan untuk user yang sudah login
- Display user information
- Logout functionality
- Protected content

### 5. Main App Component
- **File**: `src/App.tsx`
- **Fungsi**:
  - Conditional rendering berdasarkan auth status
  - Switch antara login dan register form
  - Auto-redirect ke dashboard jika sudah login

## Teknis Implementasi

### 1. State Management
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### 2. API Integration
- Menggunakan fetch API untuk HTTP requests
- Proxy configuration di Vite untuk development
- Automatic token inclusion di headers
- Error handling untuk network requests

### 3. Local Storage Management
- Token disimpan di localStorage
- User data disimpan di localStorage
- Auto-clear saat logout
- Auto-restore saat app reload

### 4. Form Validation
- Client-side validation untuk required fields
- Password confirmation matching
- Email format validation
- Password length validation (min 6 chars)

### 5. Error Handling
- Network error handling
- Server error response handling
- Form validation error display
- User-friendly error messages

### 6. Loading States
- Loading spinner saat API calls
- Disabled buttons saat loading
- Loading screen saat initial auth check

## Cara Menjalankan

### 1. Start Backend (dari Assignment 8)
```bash
cd ..  # Kembali ke root directory
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Akses Aplikasi
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Testing Flow

### 1. Register User Baru
1. Buka http://localhost:5173
2. Klik "Sign up here"
3. Isi form register:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Klik "Sign Up"
5. User akan otomatis login dan redirect ke dashboard

### 2. Login dengan User yang Ada
1. Klik "Logout" di dashboard
2. Isi form login:
   - Email: test@example.com
   - Password: password123
3. Klik "Login"
4. User akan redirect ke dashboard

### 3. Test Protected Routes
- Dashboard hanya bisa diakses setelah login
- Jika token expired, user akan auto-logout
- Refresh page akan tetap login jika token valid

## Security Features

### 1. Frontend Security
- Password tidak disimpan di localStorage
- Token validation sebelum setiap request
- Auto-logout jika token invalid
- Form validation untuk prevent XSS

### 2. Backend Security (dari Assignment 8)
- Password hashing dengan bcrypt
- JWT token dengan expiration
- CORS protection
- Rate limiting
- Helmet security headers

## Error Handling

### 1. Network Errors
- Connection timeout
- Server unavailable
- Network connectivity issues

### 2. Authentication Errors
- Invalid credentials
- Token expired
- User not found
- Email already exists

### 3. Validation Errors
- Required fields missing
- Invalid email format
- Password too short
- Password confirmation mismatch

## Responsive Design

- Mobile-friendly forms
- Responsive layout
- Touch-friendly buttons
- Readable typography
- Consistent spacing

## Next Steps untuk Development

1. **Integrasi dengan Todo API**
   - Implementasi CRUD untuk lists
   - Implementasi CRUD untuk tasks
   - Real-time updates

2. **Enhanced Features**
   - Password reset functionality
   - Email verification
   - Remember me functionality
   - Social login integration

3. **UI/UX Improvements**
   - Better loading animations
   - Toast notifications
   - Form auto-save
   - Keyboard shortcuts

## Kesimpulan

Assignment 9 berhasil mengimplementasikan sistem authentication yang lengkap dengan:

✅ **Backend**: API endpoints untuk register, login, dan protected routes  
✅ **Frontend**: User interface yang intuitive dan responsive  
✅ **Security**: Token-based authentication dengan proper validation  
✅ **User Experience**: Smooth flow dari login ke dashboard  
✅ **Error Handling**: Comprehensive error management  
✅ **State Management**: Proper state handling dengan React hooks  

Sistem ini siap untuk diintegrasikan dengan fitur Todo List yang sudah ada di Assignment 8. 