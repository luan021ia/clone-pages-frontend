import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: string; // UUID from backend
  name: string;
  email: string;
  role: 'user' | 'admin';
  cpf?: string;
  phone?: string;
  createdAt: string;
  created_at?: string; // Backward compatibility
  updatedAt?: string;
  updated_at?: string; // Backward compatibility
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LicenseInfo {
  isActive: boolean;
  isAdmin?: boolean;
  expiresAt: string | null;
  daysRemaining: number | null;
  status: 'active' | 'expired' | 'expiring_soon' | 'inactive' | 'admin';
}

class AuthService {
  private getHeaders(): HeadersInit {
    // Use localStorage for persistent authentication
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Note: Token validation is now handled in AuthContext.tsx
  // The validateToken method was removed as it was not being used
  // For token validation and expiry checks, see AuthContext.tsx secureTokenStorage.getToken()

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = 'Falha no login';
        try {
          const error = await response.json();
          // NestJS retorna message, não error
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        // Provide more specific error messages
        if (response.status === 404) {
          throw new Error('Backend não encontrado. Verifique se a URL da API está correta.');
        }
        if (response.status === 401) {
          throw new Error(errorMessage); // Use mensagem do backend
        }
        if (response.status === 0 || response.type === 'error') {
          throw new Error('Erro de conexão. Verifique se o backend está rodando e acessível.');
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Salvar token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      // Handle network errors (SSL, CORS, etc)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão com o servidor. Verifique se o backend está acessível e a configuração de rede.');
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(API_ENDPOINTS.AUTH_ME, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Token inválido');
    }

    const data = await response.json();
    return data.user;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(API_ENDPOINTS.USERS, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get users');
    }

    const data = await response.json();
    // Backend retorna array direto, não wrapped em objeto
    return Array.isArray(data) ? data : (data.users || []);
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/role`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update role');
    }

    const data = await response.json();
    return data.user;
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
  }

  // 🔐 LICENSE MANAGEMENT METHODS

  async createUser(
    email: string,
    password: string,
    licenseDays: number = 365,
    role: 'user' | 'admin' = 'user'
  ): Promise<User> {
    const response = await fetch(API_ENDPOINTS.USERS, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, licenseDays, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    const data = await response.json();
    return data.user;
  }

  async updateUser(userId: string, updates: { email?: string; role?: 'user' | 'admin' }): Promise<User> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    const data = await response.json();
    return data.user;
  }

  async updateUserPassword(userId: string, password: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update password');
    }
  }

  async renewUserLicense(userId: string, days: number): Promise<LicenseInfo> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/license`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ days }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to renew license');
    }

    const data = await response.json();
    // Backend retorna direto, não wrapped
    return data.license || data;
  }

  async getUserLicense(userId: string): Promise<LicenseInfo | undefined> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/license`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get license info');
    }

    const data = await response.json();
    // Backend retorna direto, não wrapped
    return data.license || data;
  }

  async deactivateUserLicense(userId: string): Promise<LicenseInfo> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/license/deactivate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to deactivate license');
    }

    const data = await response.json();
    // Backend retorna direto, não wrapped
    return data.license || data;
  }

  async reactivateUserLicense(userId: string, days: number = 365): Promise<LicenseInfo> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/license/reactivate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ days }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reactivate license');
    }

    const data = await response.json();
    // Backend retorna direto, não wrapped
    return data.license || data;
  }

  async setUserLicenseDays(userId: string, days: number): Promise<LicenseInfo> {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}/license/days`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ days }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set license days');
    }

    const data = await response.json();
    return data.license || data;
  }
}

export const authService = new AuthService();

