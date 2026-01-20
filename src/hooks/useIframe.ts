import { useRef, useEffect, useCallback } from 'react';
import { CloneService } from '../services/cloneService';

export const useIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const requestEditedHtml = useCallback(async (): Promise<string> => {
    if (!iframeRef.current?.contentWindow) {
      console.error('❌ useIframe: iframe contentWindow not available');
      return '';
    }

    try {
      return await CloneService.requestEditedHtml(iframeRef.current.contentWindow);
    } catch (error) {
      console.error('❌ useIframe: failed to request edited HTML:', error);
      return '';
    }
  }, []);

  const syncDOMChanges = useCallback(() => {
    // Clean up existing observer if any
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!iframeRef.current?.contentDocument) {
      console.warn('⚠️ useIframe: iframe document not available');
      return () => {};
    }

    try {
      const iframeDoc = iframeRef.current.contentDocument;

      if (!iframeDoc.body) {
        console.warn('⚠️ useIframe: iframe body not available');
        return () => {};
      }

      // Create new observer
      observerRef.current = new MutationObserver((mutations) => {
        // Log mutations for debugging (can be removed in production)
        if (mutations.length > 0) {
          console.log(`📝 DOM changes detected in iframe: ${mutations.length} mutations`);
        }
      });

      observerRef.current.observe(iframeDoc.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: false,
        characterData: true,
        characterDataOldValue: false
      });

      console.log('✅ useIframe: DOM observer started');

      // Return cleanup function
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
          console.log('✅ useIframe: DOM observer stopped');
        }
      };
    } catch (error) {
      console.error('❌ useIframe: failed to setup DOM observer:', error);
      return () => {};
    }
  }, []);

  // Setup iframe load handler
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('✅ useIframe: iframe loaded');
      syncDOMChanges();
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      // Clean up observer on unmount
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [syncDOMChanges]);

  return {
    iframeRef,
    requestEditedHtml,
    syncDOMChanges
  };
};