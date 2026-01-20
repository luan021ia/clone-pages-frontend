import { useState, useCallback, useEffect } from 'react';

export interface UseExpandButtonOptions {
  initialExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onToggle?: (isExpanded: boolean) => void;
  storageKey?: string;
  /**
   * Controla se a expansão está habilitada. Quando false,
   * o hook força o estado para contraído e limpa o storage.
   */
  enabled?: boolean;
}

export interface UseExpandButtonReturn {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  setExpanded: (expanded: boolean) => void;
}

/**
 * Hook customizado para gerenciar o estado de expansão/contração
 * com persistência no localStorage e callbacks opcionais
 */
export const useExpandButton = ({
  initialExpanded = false,
  onExpand,
  onCollapse,
  onToggle,
  storageKey = 'clonepages-expand-state',
  enabled = true,
}: UseExpandButtonOptions = {}): UseExpandButtonReturn => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);

  // Carregar estado do localStorage na montagem
  useEffect(() => {
    if (!enabled) {
      // Se não estiver habilitado, garantir estado contraído e limpar storage
      setIsExpanded(false);
      if (typeof window !== 'undefined' && storageKey) {
        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.warn('Failed to clear expand state when disabled:', error);
        }
      }
      return;
    }

    if (typeof window !== 'undefined' && storageKey && enabled) {
      try {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setIsExpanded(parsed);
        }
      } catch (error) {
        console.warn('Failed to parse saved expand state:', error);
      }
    }
  }, [storageKey, enabled]);

  // Salvar estado no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && storageKey && enabled) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(isExpanded));
      } catch (error) {
        console.warn('Failed to save expand state:', error);
      }
    }
  }, [isExpanded, storageKey, enabled]);

  // Colapsar e limpar storage quando ficar desabilitado
  useEffect(() => {
    if (!enabled) {
      setIsExpanded(false);
      onCollapse?.();
      onToggle?.(false);
      if (typeof window !== 'undefined' && storageKey) {
        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.warn('Failed to clear expand state on disable:', error);
        }
      }
    }
  }, [enabled, onCollapse, onToggle, storageKey]);

  // Função para expandir
  const expand = useCallback(() => {
    if (!enabled) return;
    setIsExpanded(true);
    onExpand?.();
    onToggle?.(true);
  }, [enabled, onExpand, onToggle]);

  // Função para contrair
  const collapse = useCallback(() => {
    setIsExpanded(false);
    onCollapse?.();
    onToggle?.(false);
  }, [onCollapse, onToggle]);

  // Função para alternar
  const toggle = useCallback(() => {
    if (!enabled) return;
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    if (newState) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
    
    onToggle?.(newState);
  }, [enabled, isExpanded, onExpand, onCollapse, onToggle]);

  // Função para definir estado diretamente
  const setExpanded = useCallback((expanded: boolean) => {
    if (!enabled && expanded) return;
    setIsExpanded(expanded);
    
    if (expanded) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
    
    onToggle?.(expanded);
  }, [enabled, onExpand, onCollapse, onToggle]);

  // Efeito para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        collapse();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, collapse]);

  return {
    isExpanded,
    expand,
    collapse,
    toggle,
    setExpanded,
  };
};