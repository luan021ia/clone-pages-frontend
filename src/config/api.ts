/**
 * Configuration for API endpoints
 * All backend URLs should be defined here
 */

// Helper para acessar variáveis de ambiente de forma compatível com Vite e testes
const getEnv = (): ImportMetaEnv => {
  // Em ambiente de teste, usar mock se disponível
  if (typeof globalThis !== 'undefined' && (globalThis as any).__VITE_ENV__) {
    return (globalThis as any).__VITE_ENV__;
  }
  // Em runtime do Vite, usar import.meta.env diretamente
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env;
  }
  // Fallback para testes
  return {} as ImportMetaEnv;
};

const env = getEnv();

// Use environment variable or default to development URL
// IMPORTANTE: No Vite, variáveis de ambiente devem ter prefixo VITE_ e são acessadas via import.meta.env
// Se VITE_USE_RELATIVE_URLS=true, usa caminhos relativos (requer proxy reverso no servidor web)
// Caso contrário, usa VITE_API_BASE_URL ou fallback para localhost em dev
const useRelativeUrls = env.VITE_USE_RELATIVE_URLS === 'true';
let API_BASE_URL = '';

if (useRelativeUrls) {
  // Caminhos relativos - assume que o servidor web faz proxy reverso
  API_BASE_URL = '';
} else if (env.VITE_API_BASE_URL) {
  // Usar URL configurada no ambiente
  API_BASE_URL = env.VITE_API_BASE_URL;
} else {
  // Fallback para desenvolvimento
  API_BASE_URL = 'http://localhost:3333';
}

// Debug: Log API configuration on module load
console.log('🔧 [API Config] Configuration:', {
  VITE_API_BASE_URL: env.VITE_API_BASE_URL || '(não definido)',
  VITE_USE_RELATIVE_URLS: env.VITE_USE_RELATIVE_URLS || '(não definido)',
  API_BASE_URL: API_BASE_URL || '(caminhos relativos)',
  MODE: env.MODE,
  DEV: env.DEV,
  PROD: env.PROD,
  useRelativeUrls,
});

// Warn if using default URL in development
if (env.DEV && !env.VITE_API_BASE_URL && !useRelativeUrls) {
  console.warn('⚠️ [API Config] VITE_API_BASE_URL não encontrada no .env, usando padrão:', API_BASE_URL);
  console.warn('💡 Dica: Crie um arquivo .env na raiz do frontend com: VITE_API_BASE_URL=https://sua-api.com');
}

// Warn if using relative URLs in production (requires proxy)
if (env.PROD && useRelativeUrls) {
  console.warn('⚠️ [API Config] Usando caminhos relativos. Certifique-se de que há um proxy reverso configurado no servidor web.');
}

// Export API_BASE_URL for components that need it
export { API_BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: `${API_BASE_URL}/users/login`,
  AUTH_REGISTER: `${API_BASE_URL}/users`,
  AUTH_ME: `${API_BASE_URL}/users/me`,

  // Users endpoints
  USERS: `${API_BASE_URL}/users`,

  // Tasks endpoints
  TASKS: `${API_BASE_URL}/tasks`,

  // Legacy endpoints (kept for backwards compatibility)
  CLONE: `${API_BASE_URL}/api/clone`,
  RENDER_PAGE: `${API_BASE_URL}/render-page`,
  DOWNLOAD_HTML: `${API_BASE_URL}/download-html`,
  RENDER: `${API_BASE_URL}/render`,
  HEALTH: `${API_BASE_URL}/health`,
} as const;

/**
 * Get allowed origins for postMessage validation
 * Uses API_BASE_URL to determine valid origins
 */
export const getAllowedOrigins = (): string[] => {
  const origins: string[] = ['null']; // Allow same-origin

  // Add current origin (frontend)
  if (typeof window !== 'undefined') {
    origins.push(window.location.origin);
  }

  // Add API base URL origin
  try {
    const apiUrl = new URL(API_BASE_URL);
    origins.push(apiUrl.origin);
  } catch (e) {
    // If API_BASE_URL is not a valid URL, fallback to localhost
    origins.push('http://localhost:3001');
    origins.push('http://localhost:3000');
    origins.push('http://localhost:5173');
  }

  // In development, allow localhost on any port
  if (isDevelopment()) {
    origins.push(...['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001']);
  }

  return origins;
};

/**
 * Check if an origin is allowed for postMessage
 */
export const isOriginAllowed = (origin: string): boolean => {
  const allowedOrigins = getAllowedOrigins();

  // Check exact match
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // In development, allow any localhost origin
  if (isDevelopment() && origin.startsWith('http://localhost:')) {
    return true;
  }

  return false;
};

// Helper to build full URL with query parameters
export const buildApiUrl = (
  endpoint: keyof typeof API_ENDPOINTS,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  let url = API_ENDPOINTS[endpoint];

  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined) // Filter out undefined values
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

// Export for testing and usage in components
export const isDevelopment = () => !!(env.DEV || env.MODE === 'development');
export const isProduction = () => !!(env.PROD || env.MODE === 'production');

