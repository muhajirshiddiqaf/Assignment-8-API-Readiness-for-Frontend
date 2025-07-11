# API Testing Guide

## 🚀 Quick Testing Options

### Option 1: Postman Collection (Recommended)
1. Import file `Todo-List-API.postman_collection.json` ke Postman
2. Set variable `baseUrl` ke `http://localhost:3000`
3. Jalankan request "Login User" atau "Register User"
4. **Token akan otomatis tersimpan** di variable `authToken` (script di setiap endpoint)
5. Semua request berikutnya akan menggunakan token tersebut
6. **Setiap endpoint memiliki script individual** untuk logging dan error handling

### Option 2: Bash Script (test-api.sh)
Script otomatis menyimpan token dan memudahkan testing:

```bash
# Check if server is running
./test-api.sh check

# Register new user (token otomatis tersimpan)
./test-api.sh register username email password

# Login user (token otomatis tersimpan)
./test-api.sh login email password

# Get user profile (menggunakan token tersimpan)
./test-api.sh profile

# Create list
./test-api.sh create-list "My List" "Description"

# Get all lists
./test-api.sh get-lists

# Create task
./test-api.sh create-task 1 "Task Title" "Description" "high"

# Get tasks by list ID
./test-api.sh get-tasks 1

# Run full test flow
./test-api.sh test
```

### Option 3: Manual curl Commands

#### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

#### 2. Login & Save Token
```bash
# Login and extract token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Save token to file
echo $TOKEN > .auth_token
```

#### 3. Use Token for Protected Endpoints
```bash
# Get user profile
curl -H "Authorization: Bearer $(cat .auth_token)" \
  http://localhost:3000/api/auth/profile

# Create list
curl -X POST http://localhost:3000/api/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(cat .auth_token)" \
  -d '{"title":"My List","description":"Description"}'
```

## 🔧 Troubleshooting

### Error: "Unauthorized" / "Authentication required"
**Solution:** 
- Pastikan sudah login/register terlebih dahulu
- Di Postman: Jalankan request "Login User" 
- Di script: Jalankan `./test-api.sh login email password`
- Di curl: Pastikan token valid dan format Bearer benar

### Error: "Server not running"
**Solution:**
```bash
npm start
# atau
npm run dev
```

### Error: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Atau gunakan port lain dengan mengubah config.js
```

## 📋 Testing Checklist

- [ ] Server running (`./test-api.sh check`)
- [ ] Register user successful
- [ ] Login user successful  
- [ ] Token auto-saved (Postman/script)
- [ ] Get profile works
- [ ] Create list works
- [ ] Get lists works
- [ ] Create task works
- [ ] Get tasks works
- [ ] Update operations work
- [ ] Delete operations work

## 🎯 Tips

1. **Postman**: Gunakan collection yang sudah disediakan untuk kemudahan
2. **Script**: Gunakan `./test-api.sh test` untuk test lengkap
3. **Token**: Selalu simpan token setelah login/register
4. **Headers**: Pastikan `Content-Type: application/json` untuk POST/PUT
5. **Authorization**: Format `Bearer <token>` untuk semua protected endpoints

## 📁 Files

- `Todo-List-API.postman_collection.json` - Postman collection
- `test-api.sh` - Bash testing script
- `.auth_token` - Auto-generated token file (gitignored)
- `README.md` - Full API documentation 