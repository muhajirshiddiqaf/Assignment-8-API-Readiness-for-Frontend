# Authentication Flow Diagram - Assignment 9

## 1. Application Startup Flow

```
┌─────────────────┐
│   App Load      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check Local     │
│ Storage for     │
│ Token & User    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐     Yes     ┌─────────────────┐
│ Token Exists?   │ ──────────► │ Verify Token    │
└─────────┬───────┘             │ with Backend    │
          │ No                  └─────────┬───────┘
          ▼                              │
┌─────────────────┐                      │
│ Show Login      │                      ▼
│ Form            │             ┌─────────────────┐
└─────────────────┘             │ Token Valid?    │
                                └─────────┬───────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                       │
                    ▼ Yes                                   ▼ No
        ┌─────────────────┐                    ┌─────────────────┐
        │ Show Dashboard  │                    │ Clear Storage   │
        │ (Authenticated) │                    │ Show Login Form │
        └─────────────────┘                    └─────────────────┘
```

## 2. User Registration Flow

```
┌─────────────────┐
│ User Clicks     │
│ "Sign Up"       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Show Register   │
│ Form            │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Fills      │
│ Form Data       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Client-side     │
│ Validation      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐     Valid     ┌─────────────────┐
│ Validation      │ ────────────► │ Submit to       │
│ Passed?         │               │ Backend API     │
└─────────┬───────┘               └─────────┬───────┘
          │ No                              │
          ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│ Show Error      │              │ Backend         │
│ Message         │              │ Processing      │
└─────────────────┘              └─────────┬───────┘
                                          │
                                          ▼
                    ┌────────────────────┴────────────────────┐
                    │                                       │
                    ▼ Success                               ▼ Error
        ┌─────────────────┐                    ┌─────────────────┐
        │ Store Token &   │                    │ Show Error      │
        │ User Data       │                    │ Message         │
        └─────────┬───────┘                    └─────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │ Redirect to     │
        │ Dashboard       │
        └─────────────────┘
```

## 3. User Login Flow

```
┌─────────────────┐
│ User Clicks     │
│ "Login"         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Show Login      │
│ Form            │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Enters     │
│ Credentials     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Client-side     │
│ Validation      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐     Valid     ┌─────────────────┐
│ Validation      │ ────────────► │ Submit to       │
│ Passed?         │               │ Backend API     │
└─────────┬───────┘               └─────────┬───────┘
          │ No                              │
          ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│ Show Error      │              │ Backend         │
│ Message         │              │ Authentication  │
└─────────────────┘              └─────────┬───────┘
                                          │
                                          ▼
                    ┌────────────────────┴────────────────────┐
                    │                                       │
                    ▼ Success                               ▼ Error
        ┌─────────────────┐                    ┌─────────────────┐
        │ Store Token &   │                    │ Show Error      │
        │ User Data       │                    │ Message         │
        └─────────┬───────┘                    └─────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │ Redirect to     │
        │ Dashboard       │
        └─────────────────┘
```

## 4. Protected Route Flow

```
┌─────────────────┐
│ User Tries to   │
│ Access Protected│
│ Route           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check Auth      │
│ State           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐     Yes     ┌─────────────────┐
│ Is Authenticated│ ──────────► │ Allow Access    │
│ ?               │             │ to Route        │
└─────────┬───────┘             └─────────────────┘
          │ No
          ▼
┌─────────────────┐
│ Redirect to     │
│ Login Form      │
└─────────────────┘
```

## 5. Logout Flow

```
┌─────────────────┐
│ User Clicks     │
│ Logout Button   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Clear Local     │
│ Storage         │
│ (Token & User)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Reset Auth      │
│ State           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Redirect to     │
│ Login Form      │
└─────────────────┘
```

## 6. API Integration Flow

```
┌─────────────────┐
│ Frontend        │
│ Component       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Auth Service    │
│ Method Call     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Prepare Request │
│ Headers & Body  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Fetch API Call  │
│ to Backend      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Backend         │
│ Processing      │
└─────────┬───────┘
          │
          ▼
                    ┌────────────────────┴────────────────────┐
                    │                                       │
                    ▼ Success                               ▼ Error
        ┌─────────────────┐                    ┌─────────────────┐
        │ Return Response │                    │ Return Error     │
        │ with Token      │                    │ Message          │
        └─────────┬───────┘                    └─────────┬───────┘
                  │                                      │
                  ▼                                      ▼
        ┌─────────────────┐                    ┌─────────────────┐
        │ Update State    │                    │ Update State    │
        │ & Local Storage │                    │ with Error      │
        └─────────────────┘                    └─────────────────┘
```

## 7. Error Handling Flow

```
┌─────────────────┐
│ Error Occurs    │
│ (Network/Auth/  │
│ Validation)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Determine Error │
│ Type            │
└─────────┬───────┘
          │
          ▼
                    ┌────────────────────┴────────────────────┐
                    │                                       │
                    ▼ Network                               ▼ Auth
        ┌─────────────────┐                    ┌─────────────────┐
        │ Show Network    │                    │ Show Auth       │
        │ Error Message   │                    │ Error Message   │
        └─────────────────┘                    └─────────────────┘
                    │                                       │
                    └─────────────────┬─────────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │ User Can Retry  │
                            │ or Navigate     │
                            └─────────────────┘
```

## 8. State Management Flow

```
┌─────────────────┐
│ useAuth Hook    │
│ Initialization  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Initial State   │
│ Setup           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check Local     │
│ Storage         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Update State    │
│ Based on Storage│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Provide State   │
│ & Methods to    │
│ Components      │
└─────────────────┘
```

## Key Components Interaction

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   App.tsx   │    │ useAuth     │    │ AuthService │
│             │◄──►│ Hook        │◄──►│             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ LoginForm   │    │ State       │    │ API Calls   │
│ RegisterForm│    │ Management  │    │ LocalStorage│
│ Dashboard   │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Security Flow

```
┌─────────────────┐
│ User Input      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Client-side     │
│ Validation      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Send to Backend │
│ (HTTPS)         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Backend         │
│ Validation      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Password Hash   │
│ (bcrypt)        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ JWT Token       │
│ Generation      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Return Token    │
│ (Secure)        │
└─────────────────┘
```

## Data Flow Summary

1. **User Input** → **Validation** → **API Call** → **Backend Processing** → **Response** → **State Update** → **UI Update**

2. **Authentication Check** → **Token Validation** → **Route Protection** → **Access Control**

3. **Error Handling** → **Error Classification** → **User Feedback** → **Recovery Options**

4. **State Management** → **Local Storage** → **Component Updates** → **UI Synchronization**

## Implementation Notes

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **Authentication**: JWT Bearer Token
- **State Management**: Custom React Hooks
- **API Communication**: Fetch API with proxy
- **Security**: HTTPS, CORS, Input Validation
- **Storage**: LocalStorage for persistence 