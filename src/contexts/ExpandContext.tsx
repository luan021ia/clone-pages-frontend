import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ExpandContextState {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
}

interface ExpandProviderProps {
  children: ReactNode;
  initialExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

const ExpandContext = createContext<ExpandContextState | undefined>(undefined);

/**
 * Provider para gerenciar o estado de expansão globalmente
 */
export const ExpandProvider: React.FC<ExpandProviderProps> = ({
  children,
  initialExpanded = false,
  onExpand,
  onCollapse,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);

  // Carregar estado do localStorage na montagem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('clonepages-expand-context-state');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setIsExpanded(parsed);
        }
      } catch (error) {
        console.warn('Failed to parse saved expand context state:', error);
      }
    }
  }, []);

  // Salvar estado no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('clonepages-expand-context-state', JSON.stringify(isExpanded));
      } catch (error) {
        console.warn('Failed to save expand context state:', error);
      }
    }
  }, [isExpanded]);

  // Função para expandir
  const expand = useCallback(() => {
    setIsExpanded(true);
    onExpand?.();
  }, [onExpand]);

  // Função para contrair
  const collapse = useCallback(() => {
    setIsExpanded(false);
    onCollapse?.();
  }, [onCollapse]);

  // Função para alternar
  const toggle = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    if (newState) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
  }, [isExpanded, onExpand, onCollapse]);

  // Efeito para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        collapse();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isExpanded, collapse]);

  const value: ExpandContextState = {
    isExpanded,
    expand,
    collapse,
    toggle,
  };

  return (
    <ExpandContext.Provider value={value}>
      {children}
    </ExpandContext.Provider>
  );
};

/**
 * Hook para usar o contexto de expansão
 */
export const useExpandContext = (): ExpandContextState => {
  const context = useContext(ExpandContext);
  if (context === undefined) {
    throw new Error('useExpandContext must be used within an ExpandProvider');
  }
  return context;
};