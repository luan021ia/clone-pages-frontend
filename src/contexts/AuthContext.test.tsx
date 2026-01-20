import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Mock the authService
jest.mock('../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods to avoid noise in tests
const consoleSpy = {
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
};

// Test component to consume the context
const TestComponent = () => {
  const {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="admin">{isAdmin ? 'true' : 'false'}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register('new@example.com', 'password')}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    consoleSpy.warn.mockClear();
    consoleSpy.error.mockClear();
  });

  it('provides initial context values', async () => {
    mockAuthService.getCurrentUser.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
  });

  it('handles unauthenticated state when no token', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
  });

  it('handles login successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    const mockToken = 'valid.jwt.token';

    mockAuthService.login.mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('handles register successfully', async () => {
    const mockUser = {
      id: '2',
      email: 'new@example.com',
      name: 'New User',
      role: 'user',
    };
    const mockToken = 'new.jwt.token';

    mockAuthService.register.mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    await act(async () => {
      await userEvent.click(screen.getByText('Register'));
    });

    expect(mockAuthService.register).toHaveBeenCalledWith('new@example.com', 'password');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(screen.getByTestId('user')).toHaveTextContent('new@example.com');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('handles logout correctly', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };

    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
    localStorageMock.getItem.mockReturnValue('valid.jwt.token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('identifies admin users correctly', async () => {
    const mockUser = {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    };

    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    expect(screen.getByTestId('admin')).toHaveTextContent('true');
  });

  describe('Token Security', () => {
    it('validates token format with 3 parts', async () => {
      localStorageMock.getItem.mockReturnValue('invalid.token');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(consoleSpy.warn).toHaveBeenCalledWith('Invalid token format');
    });

    it('handles expired tokens', async () => {
      const expiredPayload = JSON.stringify({ exp: Date.now() / 1000 - 3600 }); // 1 hour ago
      const expiredToken = `header.${btoa(expiredPayload)}.signature`;

      localStorageMock.getItem.mockReturnValue(expiredToken);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(consoleSpy.warn).toHaveBeenCalledWith('Token expired');
    });

    it('handles malformed token payload', async () => {
      localStorageMock.getItem.mockReturnValue('header.invalidjson.signature');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Failed to parse token payload:',
        expect.any(Error)
      );
    });

    it('validates token before storing', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'invalid.token', // Only 2 parts
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      await act(async () => {
        await userEvent.click(screen.getByText('Login'));
      });

      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error storing token:',
        expect.any(Error)
      );
    });
  });

  describe('Error Handling', () => {
    it('handles authService.getCurrentUser errors', async () => {
      mockAuthService.getCurrentUser.mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Auth check failed:',
        expect.any(Error)
      );
    });

    it('handles localStorage errors gracefully', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error reading token:',
        expect.any(Error)
      );
    });
  });

  describe('useAuth Hook', () => {
    it('throws error when used outside AuthProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });
  });

  describe('Loading States', () => {
    it('shows loading state initially', () => {
      mockAuthService.getCurrentUser.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        }), 100))
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });

    it('handles concurrent auth operations', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      const mockToken = 'valid.jwt.token';

      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      // Simulate rapid login clicks
      const loginButton = screen.getByText('Login');

      await act(async () => {
        await Promise.all([
          userEvent.click(loginButton),
          userEvent.click(loginButton),
        ]);
      });

      // Should handle gracefully without errors
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });
});