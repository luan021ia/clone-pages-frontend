import '@testing-library/jest-dom';

// Mock de variáveis de ambiente compatível com config/api.ts
(globalThis as any).__VITE_ENV__ = {
  VITE_API_BASE_URL: 'http://localhost:3001',
  MODE: 'test',
  DEV: true,
  PROD: false
};

// Mock do fetch global
global.fetch = jest.fn();

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock as any;

// Mock do URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock do postMessage
global.postMessage = jest.fn();

// Mock do console para testes mais limpos
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Limpar mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});