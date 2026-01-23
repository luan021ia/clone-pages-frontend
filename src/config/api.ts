/**
 * Configuração da API
 */

// URL base da API - lê do .env
// Fallback: usa localhost em desenvolvimento, produção em produção
const getDefaultApiUrl = () => {
  const isProduction = import.meta.env.MODE === 'production' || import.meta.env.PROD;
  return isProduction 
    ? 'https://bclone.fabricadelowticket.com.br'
    : 'http://localhost:3333';
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl();

// Timeout padrão para requisições (30 segundos)
export const API_TIMEOUT = 30000;

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  AUTH_LOGIN: `${API_BASE_URL}/users/login`,
  AUTH_REGISTER: `${API_BASE_URL}/users`,
  AUTH_ME: `${API_BASE_URL}/users/me`,
  
  // Usuários
  USERS: `${API_BASE_URL}/users`,
  
  // Tasks
  TASKS: `${API_BASE_URL}/tasks`,
  
  // Clone
  CLONE: `${API_BASE_URL}/api/clone`,
  RENDER_PAGE: `${API_BASE_URL}/render-page`,
  DOWNLOAD_HTML: `${API_BASE_URL}/download-html`,
};

/**
 * Constrói URL da API com query parameters
 */
export function buildApiUrl(
  endpoint: keyof typeof API_ENDPOINTS,
  params?: Record<string, any>
): string {
  const baseUrl = API_ENDPOINTS[endpoint];
  
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const encodedValue = encodeURIComponent(String(value));
      return `${key}=${encodedValue}`;
    })
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export default {
  API_BASE_URL,
  API_TIMEOUT,
  DEFAULT_HEADERS,
  API_ENDPOINTS,
  buildApiUrl,
};
