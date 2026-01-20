import { useCallback } from 'react';
import {
  clearSingleHistory,
  clearAllTrackingHistory,
  getHistoryStats,
  logAllHistories,
} from '../utils/clearHistoryStorage';

/**
 * Hook customizado para gerenciar limpeza de históricos de rastreamento
 */
export const useClearHistory = () => {
  const clearPixelHistory = useCallback(() => {
    clearSingleHistory('PIXEL');
  }, []);

  const clearGtagHistory = useCallback(() => {
    clearSingleHistory('GTAG');
  }, []);

  const clearUtmfyHistory = useCallback(() => {
    clearSingleHistory('UTMFY');
  }, []);

  const clearClarityHistory = useCallback(() => {
    clearSingleHistory('CLARITY');
  }, []);

  const clearWhatsappHistory = useCallback(() => {
    clearSingleHistory('WHATSAPP');
  }, []);

  const clearAll = useCallback(() => {
    clearAllTrackingHistory();
  }, []);

  const getStats = useCallback(() => {
    return getHistoryStats();
  }, []);

  const logHistories = useCallback(() => {
    logAllHistories();
  }, []);

  return {
    // Métodos individuais
    clearPixelHistory,
    clearGtagHistory,
    clearUtmfyHistory,
    clearClarityHistory,
    clearWhatsappHistory,
    // Métodos gerais
    clearAll,
    getStats,
    logHistories,
  };
};
