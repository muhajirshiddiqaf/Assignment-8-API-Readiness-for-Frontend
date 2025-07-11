import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

// Use relative URL for proxy
const API_BASE_URL = '/api';

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('Registering user:', { ...data, password: '[HIDDEN]' });
    console.log('API URL:', `${API_BASE_URL}/auth/register`);
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Register response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      console.error('Registration error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Registration successful:', result);
    return result;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('Logging in user:', { ...data, password: '[HIDDEN]' });
    console.log('API URL:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        console.error('Login error:', errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Login successful, response:', result);
      
      // Validate response structure
      if (!result.token || !result.user) {
        console.error('Invalid response structure:', result);
        throw new Error('Invalid response from server');
      }
      
      return result;
    } catch (error) {
      console.error('Login fetch error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<{ user: any }> {
    console.log('Getting user profile');
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    console.log('Profile response status:', response.status);

    if (!response.ok) {
      console.error('Profile fetch failed:', response.status);
      throw new Error('Failed to get profile');
    }

    const result = await response.json();
    console.log('Profile fetched successfully:', result);
    return result;
  }

  logout(): void {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Getting token:', token ? 'Token exists' : 'No token');
    return token;
  }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('Getting user:', user ? 'User exists' : 'No user');
    return user;
  }

  setAuthData(token: string, user: any): void {
    console.log('Setting auth data:', { token: 'Token set', user: user?.username });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    const authenticated = !!this.getToken();
    console.log('Checking authentication:', authenticated);
    return authenticated;
  }
}

export const authService = new AuthService(); 