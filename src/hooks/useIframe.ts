import { useRef, useEffect, useCallback } from 'react';
import { CloneService } from '../services/cloneService';

export const useIframe = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const requestEditedHtml = useCallback(async (): Promise<string> => {
    if (!iframeRef.current?.contentWindow) {
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
      return () => { };
    }

    try {
      const iframeDoc = iframeRef.current.contentDocument;

      if (!iframeDoc.body) {
        return () => { };
      }

      // Create new observer
      observerRef.current = new MutationObserver((_mutations) => {
        // Log mutations for debugging (can be removed in production)
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
        }
      };
    } catch (error) {
      console.error('❌ useIframe: failed to setup DOM observer:', error);
      return () => { };
    }
  }, []);

  // Setup iframe load handler
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
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