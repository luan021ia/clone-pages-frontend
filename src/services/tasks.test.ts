import { taskService } from './tasks';
import { API_ENDPOINTS } from '../config/api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock API endpoints
jest.mock('../config/api', () => ({
  API_ENDPOINTS: {
    TASKS: '/api/tasks',
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  describe('getHeaders', () => {
    it('returns headers with authorization token when token exists', () => {
      const mockToken = 'test-token';
      localStorageMock.getItem.mockReturnValue(mockToken);

      // Access private method through any for testing
      const getHeaders = (taskService as any).getHeaders.bind(taskService);
      const headers = getHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      });
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    });

    it('returns headers without authorization when no token', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const getHeaders = (taskService as any).getHeaders.bind(taskService);
      const headers = getHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });

  describe('getTasks', () => {
    it('fetches tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'open' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'done' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: mockTasks }),
      });

      const result = await taskService.getTasks();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.TASKS, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockTasks);
    });

    it('throws error when fetch fails', async () => {
      const mockError = { error: 'Failed to fetch tasks' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(taskService.getTasks()).rejects.toThrow('Failed to fetch tasks');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(taskService.getTasks()).rejects.toThrow('Network error');
    });

    it('includes authorization header when token exists', async () => {
      const mockToken = 'test-token';
      localStorageMock.getItem.mockReturnValue(mockToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      await taskService.getTasks();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.TASKS, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe('createTask', () => {
    it('creates task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        status: 'open',
      };

      const createdTask = { id: 3, ...newTask };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: createdTask }),
      });

      const result = await taskService.createTask(newTask);

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      expect(result).toEqual(createdTask);
    });

    it('throws error when creation fails', async () => {
      const mockError = { error: 'Failed to create task' };
      const newTask = { title: 'New Task' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(taskService.createTask(newTask)).rejects.toThrow('Failed to create task');
    });

    it('handles missing description field', async () => {
      const newTask = { title: 'Task without description' };
      const createdTask = { id: 4, ...newTask, description: null };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: createdTask }),
      });

      const result = await taskService.createTask(newTask);

      expect(result).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('updates task successfully', async () => {
      const taskId = 1;
      const updateData = {
        title: 'Updated Task',
        status: 'done',
      };

      const updatedTask = {
        id: taskId,
        title: 'Updated Task',
        status: 'done',
        description: 'Original Description',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: updatedTask }),
      });

      const result = await taskService.updateTask(taskId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedTask);
    });

    it('throws error when update fails', async () => {
      const taskId = 999;
      const updateData = { title: 'Updated Task' };
      const mockError = { error: 'Task not found' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(taskService.updateTask(taskId, updateData)).rejects.toThrow('Task not found');
    });

    it('handles partial updates', async () => {
      const taskId = 1;
      const updateData = { status: 'in_progress' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: { id: taskId, ...updateData } }),
      });

      await taskService.updateTask(taskId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
    });
  });

  describe('deleteTask', () => {
    it('deletes task successfully', async () => {
      const taskId = 1;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await taskService.deleteTask(taskId);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('throws error when deletion fails', async () => {
      const taskId = 999;
      const mockError = { error: 'Task not found' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(taskService.deleteTask(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('Error handling', () => {
    it('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Unexpected token in JSON');
        },
      });

      await expect(taskService.getTasks()).rejects.toThrow();
    });

    it('handles empty error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(taskService.getTasks()).rejects.toThrow();
    });

    it('handles timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 100);
        });
      });

      await expect(taskService.getTasks()).rejects.toThrow('Request timeout');
    });
  });

  describe('Data validation', () => {
    it('handles empty task list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tasks: [] }),
      });

      const result = await taskService.getTasks();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles missing tasks field in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // Missing 'tasks' field
      });

      const result = await taskService.getTasks();

      expect(result).toBeUndefined(); // This might indicate a bug in the service
    });

    it('handles invalid task data structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tasks: [
            { id: 'invalid', title: null, status: 'invalid_status' },
          ],
        }),
      });

      const result = await taskService.getTasks();

      // Service should return data as-is, validation should happen elsewhere
      expect(result).toEqual([
        { id: 'invalid', title: null, status: 'invalid_status' },
      ]);
    });
  });

  describe('Integration scenarios', () => {
    it('handles complete task lifecycle', async () => {
      const newTask = {
        title: 'Lifecycle Task',
        description: 'Test Description',
        status: 'open' as const,
      };

      // Create
      const createdTask = { id: 1, ...newTask };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: createdTask }),
      });

      const created = await taskService.createTask(newTask);
      expect(created).toEqual(createdTask);

      // Update
      const updateData = { status: 'done' as const };
      const updatedTask = { ...createdTask, ...updateData };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ task: updatedTask }),
      });

      const updated = await taskService.updateTask(createdTask.id, updateData);
      expect(updated.status).toBe('done');

      // Delete
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await expect(taskService.deleteTask(createdTask.id)).resolves.not.toThrow();
    });
  });
});