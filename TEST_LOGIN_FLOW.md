# Test Login Flow - Debug Guide

## 🔍 **Debug Steps**

### 1. **Buka Browser Developer Tools**
1. Buka http://localhost:5173
2. Tekan F12 untuk membuka Developer Tools
3. Buka tab **Console** untuk melihat log
4. Buka tab **Network** untuk melihat API calls

### 2. **Test Login Flow**

#### **Step 1: Register User Baru**
1. Klik "Sign up here"
2. Isi form:
   - Username: `debuguser`
   - Email: `debug@example.com`
   - Password: `password123`
   - Confirm: `password123`
3. Klik "Sign Up"
4. **Check Console**: Lihat log register process
5. **Expected**: Auto-navigate ke login setelah 2 detik

#### **Step 2: Login**
1. Di halaman login, isi:
   - Email: `debug@example.com`
   - Password: `password123`
2. Klik "Login"
3. **Check Console**: Lihat log login process
4. **Check Debug Info**: Lihat status di pojok kanan atas

### 3. **Expected Console Logs**

#### **Register Process:**
```
Registering user: {username: "debuguser", email: "debug@example.com", password: "[HIDDEN]"}
API URL: /api/auth/register
Register response status: 200
Registration successful: {message: "User registered successfully", user: {...}, token: "..."}
```

#### **Login Process:**
```
Login function called with: {email: "debug@example.com", password: "[HIDDEN]"}
Logging in user: {email: "debug@example.com", password: "[HIDDEN]"}
API URL: /api/auth/login
Login response status: 200
Login response headers: Headers {...}
Login successful, response: {message: "Login successful", user: {...}, token: "..."}
Setting auth data: {token: "Token set", user: "debuguser"}
Setting new auth state: {user: {...}, token: "...", isAuthenticated: true, isLoading: false, error: null}
Login successful, state updated
App component - isAuthenticated: true
App component - isLoading: false
App: Showing dashboard
```

### 4. **Debug Info Expected Values**

#### **Before Login:**
- isAuthenticated: false
- isLoading: false
- User: null
- Token: null
- Error: none
- Success: none

#### **After Login:**
- isAuthenticated: true
- isLoading: false
- User: debuguser
- Token: exists
- Error: none
- Success: Login successful! Welcome back!

### 5. **Troubleshooting**

#### **Jika Login tidak redirect ke Dashboard:**

1. **Check Console Errors:**
   - Network errors
   - API response errors
   - JavaScript errors

2. **Check Network Tab:**
   - POST /api/auth/login request
   - Response status (should be 200)
   - Response body (should have token and user)

3. **Check LocalStorage:**
   - Open Application tab in DevTools
   - Check Local Storage for token and user data

4. **Check Debug Info:**
   - isAuthenticated should be true
   - User should show username
   - Token should show "exists"

#### **Common Issues:**

1. **CORS Error:**
   - Backend CORS not configured properly
   - Check backend CORS settings

2. **Proxy Not Working:**
   - Restart frontend server
   - Check vite.config.ts proxy settings

3. **API Response Error:**
   - Check backend logs
   - Verify API endpoint is working

4. **State Not Updating:**
   - Check useAuth hook
   - Verify setAuthState is called
   - Check React DevTools for state changes

### 6. **Manual API Test**

```bash
# Test register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 7. **Reset for Testing**

Jika perlu reset untuk test ulang:

1. **Clear LocalStorage:**
   ```javascript
   localStorage.clear();
   ```

2. **Refresh Page:**
   - Should show login form

3. **Clear Console:**
   - Clear console logs for clean testing

## 🎯 **Success Criteria**

✅ **Register**: Success message → Auto-navigate to login  
✅ **Login**: Success → Auto-redirect to dashboard  
✅ **Dashboard**: Welcome message → User info displayed  
✅ **Logout**: Success message → Auto-redirect to login  
✅ **Debug Info**: Shows correct state values  
✅ **Console Logs**: No errors, proper flow logs  

Jika semua criteria terpenuhi, maka login flow sudah berfungsi dengan baik! 🚀 