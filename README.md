# Todo List API with Bearer Token Authentication

A secure, production-ready REST API for managing todo lists and tasks with JWT-based authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

3. **Access the API:**
- Base URL: `http://localhost:3000`
- API Documentation: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

## 🔐 Authentication Flow

### 1. Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Using the Bearer Token
Include the token in the Authorization header for all protected endpoints:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Lists Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/lists` | Get all user's lists | Yes |
| GET | `/api/lists/:id` | Get specific list | Yes |
| POST | `/api/lists` | Create new list | Yes |
| PUT | `/api/lists/:id` | Update list | Yes |
| DELETE | `/api/lists/:id` | Delete list | Yes |

### Tasks Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/list/:listId` | Get tasks in a list | Yes |
| GET | `/api/tasks/:id` | Get specific task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| PATCH | `/api/tasks/:id/status` | Update task status | Yes |

## 📝 Request/Response Examples

### Creating a List
```http
POST /api/lists
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Work Tasks",
  "description": "Tasks related to work projects"
}
```

**Response:**
```json
{
  "message": "List created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Work Tasks",
    "description": "Tasks related to work projects",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Creating a Task
```http
POST /api/tasks
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "listId": 1,
  "title": "Complete API documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "dueDate": "2024-01-20T23:59:59.000Z"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "list_id": 1,
    "title": "Complete API documentation",
    "description": "Write comprehensive API docs",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-01-20T23:59:59.000Z",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Updating Task Status
```http
PATCH /api/tasks/1/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "in_progress"
}
```

## 🔧 Data Models

### User
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### List
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Work Tasks",
  "description": "Tasks related to work projects",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### Task
```json
{
  "id": 1,
  "list_id": 1,
  "title": "Complete API documentation",
  "description": "Write comprehensive API docs",
  "status": "pending",
  "priority": "high",
  "due_date": "2024-01-20T23:59:59.000Z",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers for Express
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries

## 🗄️ Database Schema

The API uses SQLite with the following schema:

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Lists table
CREATE TABLE lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);
```

## 🔄 Status and Priority Values

### Task Status
- `pending` - Task is not started
- `in_progress` - Task is being worked on
- `completed` - Task is finished

### Task Priority
- `low` - Low priority task
- `medium` - Medium priority task (default)
- `high` - High priority task

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🧪 Testing the API

### Using curl

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login and get token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Create a list (replace YOUR_TOKEN):**
```bash
curl -X POST http://localhost:3000/api/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My First List","description":"A test list"}'
```

### Using Postman/Insomnia
Import the provided collection file for a complete set of pre-configured requests.

## 🔧 Configuration

Environment variables (optional):
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT signing secret (default: development secret)
- `NODE_ENV` - Environment (development/production)

## 📦 Project Structure

```
├── server.js              # Main server file
├── config.js              # Configuration
├── package.json           # Dependencies
├── README.md             # This file
├── database/
│   └── init.js           # Database initialization
├── middleware/
│   └── auth.js           # Authentication middleware
└── routes/
    ├── auth.js           # Authentication routes
    ├── lists.js          # Lists routes
    └── tasks.js          # Tasks routes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**For AI Assistants**: This API is designed to be easily integrated with frontend applications. All endpoints return consistent JSON responses with clear error messages. The authentication flow uses standard JWT Bearer tokens, and all protected endpoints require the Authorization header. The API follows RESTful conventions and includes comprehensive validation and error handling. 