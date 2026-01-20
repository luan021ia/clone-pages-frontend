/**
 * Utilitário para limpar todos os históricos de rastreamento do localStorage
 * Use isto quando precisar resetar os históricos de Pixel, Google Tag, UTMFY, Clarity e WhatsApp
 */

export const HISTORY_KEYS = {
  PIXEL: 'pixelHistory',
  GTAG: 'gtagHistory',
  UTMFY: 'utmfyHistory',
  CLARITY: 'clarityHistory',
  WHATSAPP: 'whatsappHistory',
} as const;

/**
 * Limpar um histórico específico pelo nome da chave
 */
export const clearSingleHistory = (key: keyof typeof HISTORY_KEYS): void => {
  const storageKey = HISTORY_KEYS[key];
  localStorage.removeItem(storageKey);
  console.log(`✅ Histórico de ${key} removido do localStorage`);
};

/**
 * Limpar todos os históricos de rastreamento
 */
export const clearAllTrackingHistory = (): void => {
  Object.values(HISTORY_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  console.log('✅ Todos os históricos de rastreamento foram removidos');
};

/**
 * Obter estatísticas dos históricos armazenados
 */
export const getHistoryStats = (): Record<string, number> => {
  const stats: Record<string, number> = {};

  Object.entries(HISTORY_KEYS).forEach(([name, storageKey]) => {
    try {
      const data = localStorage.getItem(storageKey);
      if (data) {
        const history = JSON.parse(data);
        stats[name] = Array.isArray(history) ? history.length : 0;
      } else {
        stats[name] = 0;
      }
    } catch (error) {
      console.error(`Erro ao ler ${storageKey}:`, error);
      stats[name] = 0;
    }
  });

  return stats;
};

/**
 * Exibir todos os históricos no console (para debugging)
 */
export const logAllHistories = (): void => {
  console.log('📊 Históricos de Rastreamento Armazenados:');
  Object.entries(HISTORY_KEYS).forEach(([name, storageKey]) => {
    try {
      const data = localStorage.getItem(storageKey);
      if (data) {
        const history = JSON.parse(data);
        console.log(`${name}:`, history);
      } else {
        console.log(`${name}: (vazio)`);
      }
    } catch (error) {
      console.error(`Erro ao ler ${storageKey}:`, error);
    }
  });
};
