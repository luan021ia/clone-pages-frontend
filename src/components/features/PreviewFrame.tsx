import React, { forwardRef, useState, useEffect } from 'react';
import type { ViewportMode } from '../../types/viewport.types';
import { VIEWPORT_CONFIGS } from '../../types/viewport.types';

interface PreviewFrameProps {
  src: string;
  viewportMode: ViewportMode;
  status: string;
}

export const PreviewFrame = forwardRef<HTMLIFrameElement, PreviewFrameProps>(
  ({ src, viewportMode, status }, ref) => {
    const { width, height } = VIEWPORT_CONFIGS[viewportMode];
    const [loadError, setLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const iframeStyle: React.CSSProperties = {
      width,
      height,
      border: '1px solid #ddd',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    };

    // Reset error state when src changes
    useEffect(() => {
      if (src) {
        setLoadError(false);
        setIsLoading(true);
        
        // Timeout de segurança para detectar loops ou carregamentos travados
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 30000); // 30 segundos
        
        return () => clearTimeout(timeoutId);
      }
    }, [src]);

    const handleLoad = () => {
      setIsLoading(false);
      setLoadError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setLoadError(true);
      console.error('Erro ao carregar iframe:', src);
    };

    if (!src) {
      return (
        <div className="preview-placeholder" style={iframeStyle}>
          <p>{status}</p>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="preview-placeholder" style={iframeStyle}>
          <p style={{ color: '#e74c3c' }}>
            Erro ao carregar a página. Verifique a URL e tente novamente.
          </p>
        </div>
      );
    }

    return (
      <div className="preview-container">
        {isLoading && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}>
            <p>Carregando...</p>
          </div>
        )}
        <iframe
          ref={ref}
          src={src}
          style={iframeStyle}
          title="Preview"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }
);