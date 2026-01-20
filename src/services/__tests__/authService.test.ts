import { authService } from '../authService';

// Mock do fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock do sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  describe('register', () => {
    it('deve registrar usuário com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Usuário criado com sucesso',
          user: { id: 1, email: 'test@example.com', role: 'user' },
          token: 'mock-token'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await authService.register('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      expect(result.message).toBe('Usuário criado com sucesso');
    });

    it('deve lidar com email já existente', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Email já existe'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.register('existing@example.com', 'password123')).rejects.toThrow('Email já existe');
    });

    it('deve lidar com erro de rede', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(authService.register('test@example.com', 'password123')).rejects.toThrow('Network error');
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          token: 'mock-jwt-token',
          user: { id: 1, email: 'test@example.com', role: 'user' },
          message: 'Login realizado com sucesso'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      expect(result.token).toBe('mock-jwt-token');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    });

    it('deve lidar com credenciais inválidas', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Credenciais inválidas'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.login('wrong@example.com', 'wrongpassword')).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('getCurrentUser', () => {
    it('deve retornar usuário atual com token válido', async () => {
      mockSessionStorage.getItem.mockReturnValue('valid-token');
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: mockUser
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(result.email).toBe('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando não há token', async () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      await expect(authService.getCurrentUser()).rejects.toThrow('Token não encontrado');
    });

    it('deve lidar com token inválido', async () => {
      mockSessionStorage.getItem.mockReturnValue('invalid-token');
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Token inválido'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.getCurrentUser()).rejects.toThrow('Token inválido');
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar lista de usuários para admin', async () => {
      mockSessionStorage.getItem.mockReturnValue('admin-token');
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'user' },
        { id: 2, email: 'user2@example.com', role: 'admin' },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          users: mockUsers
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await authService.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockUsers);
    });

    it('deve negar acesso para usuário não admin', async () => {
      mockSessionStorage.getItem.mockReturnValue('user-token');
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Acesso negado'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.getAllUsers()).rejects.toThrow('Acesso negado');
    });
  });

  describe('updateUserRole', () => {
    it('deve atualizar role do usuário com sucesso', async () => {
      mockSessionStorage.getItem.mockReturnValue('admin-token');
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        role: 'admin',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: mockUser
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await authService.updateUserRole(1, 'admin');

      expect(result.role).toBe('admin');
      expect(result.id).toBe(1);
    });

    it('deve lidar com usuário não encontrado', async () => {
      mockSessionStorage.getItem.mockReturnValue('admin-token');
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Usuário não encontrado'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.updateUserRole(999, 'admin')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      mockSessionStorage.getItem.mockReturnValue('admin-token');
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.deleteUser(1)).resolves.not.toThrow();
    });

    it('deve lidar com erro ao deletar usuário', async () => {
      mockSessionStorage.getItem.mockReturnValue('admin-token');
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Não é possível deletar este usuário'
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(authService.deleteUser(1)).rejects.toThrow('Não é possível deletar este usuário');
    });
  });


});