import { useState, useCallback, useRef, useEffect } from 'react';
import { writeToClipboard } from '../utils/clipboard';

export const useClipboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCopied, setLastCopied] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const success = await writeToClipboard(text);
      if (success) {
        setLastCopied(text);

        // Limpa o timeout anterior se existir
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Limpa o estado após 3 segundos
        timeoutRef.current = setTimeout(() => setLastCopied(null), 3000);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup do timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    copyToClipboard,
    isLoading,
    lastCopied
  };
};