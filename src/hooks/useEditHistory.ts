import { useState, useCallback, useRef } from 'react';

interface EditHistoryState {
  html: string;
  timestamp: number;
  description?: string;
}

interface UseEditHistoryReturn {
  /** Adicionar estado ao histórico */
  pushState: (html: string, description?: string) => void;
  /** Desfazer (voltar ao estado anterior) */
  undo: () => string | null;
  /** Refazer (avançar para o próximo estado) */
  redo: () => string | null;
  /** Pode desfazer? */
  canUndo: boolean;
  /** Pode refazer? */
  canRedo: boolean;
  /** Limpar histórico */
  clearHistory: () => void;
  /** Estado atual do histórico */
  currentState: EditHistoryState | null;
  /** Número de estados no histórico */
  historyLength: number;
  /** Posição atual no histórico */
  currentIndex: number;
  /** Flag para indicar se está em operação de undo/redo */
  isUndoRedo: boolean;
  /** Inicializar histórico com estado inicial */
  initializeHistory: (html: string) => void;
}

const MAX_HISTORY_SIZE = 50;

export const useEditHistory = (): UseEditHistoryReturn => {
  const historyRef = useRef<EditHistoryState[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef(false);
  
  // Estado para forçar re-render quando necessário
  const [, forceUpdate] = useState(0);
  const triggerUpdate = useCallback(() => forceUpdate(n => n + 1), []);

  /**
   * Inicializar histórico com o estado original
   */
  const initializeHistory = useCallback((html: string) => {
    if (historyRef.current.length === 0 && html) {
      historyRef.current = [{
        html,
        timestamp: Date.now(),
        description: 'Estado original',
      }];
      currentIndexRef.current = 0;
      triggerUpdate();
    }
  }, [triggerUpdate]);

  /**
   * Adicionar novo estado ao histórico
   */
  const pushState = useCallback((html: string, description?: string) => {
    if (isUndoRedoRef.current || !html) {
      return;
    }

    // Se o histórico está vazio, inicializar primeiro
    if (historyRef.current.length === 0) {
      historyRef.current = [{
        html,
        timestamp: Date.now(),
        description: description || 'Estado inicial',
      }];
      currentIndexRef.current = 0;
      triggerUpdate();
      return;
    }

    // Verificar se é diferente do último estado
    const lastState = historyRef.current[currentIndexRef.current];
    if (lastState && lastState.html === html) {
      console.log('⏸️ [History] HTML idêntico - skip');
      return;
    }

    // Se estamos no meio do histórico (após undo), remover estados futuros
    historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);

    // Adicionar novo estado
    historyRef.current.push({
      html,
      timestamp: Date.now(),
      description,
    });

    // Limitar tamanho
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current = historyRef.current.slice(-MAX_HISTORY_SIZE);
    }

    currentIndexRef.current = historyRef.current.length - 1;
    triggerUpdate();
  }, [triggerUpdate]);

  /**
   * Desfazer - voltar ao estado anterior
   */
  const undo = useCallback((): string | null => {
    if (currentIndexRef.current <= 0 || historyRef.current.length <= 1) {
      return null;
    }

    isUndoRedoRef.current = true;
    currentIndexRef.current -= 1;
    const previousState = historyRef.current[currentIndexRef.current];
    
    
    triggerUpdate();
    
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 300);
    
    return previousState?.html || null;
  }, [triggerUpdate]);

  /**
   * Refazer - avançar para o próximo estado
   */
  const redo = useCallback((): string | null => {
    if (currentIndexRef.current >= historyRef.current.length - 1) {
      return null;
    }

    isUndoRedoRef.current = true;
    currentIndexRef.current += 1;
    const nextState = historyRef.current[currentIndexRef.current];
    
    
    triggerUpdate();
    
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 300);
    
    return nextState?.html || null;
  }, [triggerUpdate]);

  /**
   * Limpar histórico
   */
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
    isUndoRedoRef.current = false;
    triggerUpdate();
  }, [triggerUpdate]);

  // Calcular canUndo/canRedo baseado nos refs
  const canUndo = currentIndexRef.current > 0 && historyRef.current.length > 1;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1 && historyRef.current.length > 0;

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    currentState: historyRef.current[currentIndexRef.current] || null,
    historyLength: historyRef.current.length,
    currentIndex: currentIndexRef.current,
    isUndoRedo: isUndoRedoRef.current,
    initializeHistory,
  };
};
