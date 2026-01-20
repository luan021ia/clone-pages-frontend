import React, { useState, useEffect, useRef } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import { convertToWebP } from '@/utils/imageUtils';

interface MediaTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ element, onUpdate }) => {
  // 🎯 FIX: Adicionar null safety para attributes access
  const attributes = element?.attributes || {};
  const [src, setSrc] = useState(element?.src || attributes.src || '');
  const [alt, setAlt] = useState(element?.alt || attributes.alt || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🎯 NOVO: Rastrear mudanças pendentes
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [pendingAlt, setPendingAlt] = useState<string | null>(null);

  // 🎯 NOVO: Suporte a dois métodos de entrada
  const [inputMethod, setInputMethod] = useState<'url' | 'embed'>('url');
  const [embedInput, setEmbedInput] = useState('');

  // 🎯 FIX: Adicionar null safety para tagName
  const tagName = element?.tagName || '';
  const isImage = tagName === 'IMG' || tagName === 'IMAGE';
  const isVideo = tagName === 'VIDEO' || tagName === 'IFRAME';

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar (novo elemento selecionado)
  // Isso evita que os inputs percam foco ao digitar
  useEffect(() => {
    // 🎯 FIX: Usar attributes que já foi definido com null safety acima
    const currentSrc = element?.src || attributes.src || '';
    const currentAlt = element?.alt || attributes.alt || '';

    setSrc(currentSrc);
    setAlt(currentAlt);

    if (currentSrc) {
      setImagePreview(currentSrc);
    }

    // Resetar mudanças pendentes ao trocar de elemento
    setHasPendingChanges(false);
    setPendingSrc(null);
    setPendingAlt(null);
  }, [element.xpath]); // 🎯 Mudança crítica: apenas quando elemento mudar, não quando attributes mudarem

  // 🎯 FUNÇÃO: Converter URL normal do YouTube para embed
  const convertYoutubeUrl = (url: string): string => {
    try {
      // https://www.youtube.com/watch?v=VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
      // https://youtu.be/VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID

      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (url.includes('youtube.com/embed') || url.includes('youtube-nocookie.com/embed')) {
        // Se já é uma URL embed, remover autoplay se existir
        try {
          const urlObj = new URL(url);
          if (urlObj.searchParams.has('autoplay')) {
            urlObj.searchParams.delete('autoplay');
            console.log('🎬 [MediaTab] Autoplay removido da URL do YouTube');
            return urlObj.toString();
          }
        } catch (e) {
          // Se der erro no parse, tentar remover por regex
          return url.replace(/[?&]autoplay=1/gi, '');
        }
      }
    } catch (e) {
      console.warn('Erro ao converter URL do YouTube:', e);
    }

    return url; // Retornar URL original se não for YouTube ou já estiver em formato embed
  };

  // 🎯 FUNÇÃO: Extrair src de código embed HTML
  const extractEmbedSrc = (embedCode: string): string => {
    try {
      if (embedCode.includes('<iframe') && embedCode.includes('</iframe>')) {
        const srcMatch = embedCode.match(/src\s*=\s*["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
          let extractedSrc = srcMatch[1];
          
          // 🎬 Remover autoplay se for YouTube
          if (extractedSrc.includes('youtube.com/embed') || extractedSrc.includes('youtube-nocookie.com/embed')) {
            if (extractedSrc.includes('autoplay=1')) {
              extractedSrc = extractedSrc.replace(/[?&]autoplay=1/gi, '');
              console.log('🎬 [MediaTab] Autoplay removido do código embed do YouTube');
            }
          }
          
          console.log('🎥 [MediaTab] Extraído src do código embed:', extractedSrc);
          return extractedSrc;
        }
      }
    } catch (e) {
      console.warn('Erro ao extrair src do embed:', e);
    }
    return embedCode;
  };

  // 🎯 FUNÇÕES DE MANIPULAÇÃO PARA CADA MÉTODO
  const handleUrlChange = (value: string) => {
    const convertedUrl = convertYoutubeUrl(value);
    setSrc(convertedUrl);
    setImagePreview(convertedUrl);
    setPendingSrc(convertedUrl);
    setHasPendingChanges(true);

    if (convertedUrl !== value) {
      console.log('🎥 [MediaTab] URL do YouTube convertida:', value, '→', convertedUrl);
    }
  };

  const handleEmbedChange = (value: string) => {
    setEmbedInput(value);
    const extractedSrc = extractEmbedSrc(value);
    setSrc(extractedSrc);
    setPendingSrc(extractedSrc);
    setHasPendingChanges(true);

    if (extractedSrc !== value) {
      console.log('🎥 [MediaTab] Embed processado:', value.substring(0, 50), '→', extractedSrc);
    }
  };

  const handleAltChange = (value: string) => {
    setAlt(value);
    setPendingAlt(value);
    setHasPendingChanges(true);
  };

  // 🎯 NOVO: Aplicar mudanças no iframe
  const applyChanges = () => {
    if (pendingSrc !== null) {
      console.log('📸 [MediaTab] Aplicando mudança de src:', pendingSrc.substring(0, 100));
      onUpdate({
        xpath: element.xpath,
        property: 'src',
        value: pendingSrc,
        type: 'attribute'
      });
    }

    if (pendingAlt !== null) {
      console.log('📝 [MediaTab] Aplicando mudança de alt:', pendingAlt);
      onUpdate({
        xpath: element.xpath,
        property: 'alt',
        value: pendingAlt,
        type: 'attribute'
      });
    }

    setHasPendingChanges(false);
    setPendingSrc(null);
    setPendingAlt(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar se é imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, GIF, etc.)');
      return;
    }

    // Validar tamanho (máximo 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('A imagem é muito grande. Tamanho máximo: 100MB');
      return;
    }

    console.log('🖼️ [MediaTab] Iniciando upload de imagem:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // 🎯 NOVO: Converter para WebP automaticamente (formato mais leve)
    convertToWebP(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85,
      maintainAspectRatio: true,
    })
      .then((webpBase64) => {
        console.log('✅ [MediaTab] Imagem convertida para WebP com sucesso');
        
        setImagePreview(webpBase64);
        setSrc(webpBase64);

        // Marcar como mudança pendente em vez de aplicar imediatamente
        setPendingSrc(webpBase64);
        setHasPendingChanges(true);

        console.log('🖼️ [MediaTab] Imagem carregada - aguardando aplicação:', {
          xpath: element.xpath,
          property: 'src',
          valueLength: webpBase64.length,
          hasPendingChanges: true
        });

        console.log('✅ [MediaTab] Imagem pronta para aplicar!');
      })
      .catch((error) => {
        console.error('❌ [MediaTab] Erro ao converter imagem:', error);
        alert('Erro ao processar a imagem. Tente outra.');
      });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="editor-tab-content">
      {isImage && (
        <>
          <div className="editor-group">
            <label>Upload de Imagem</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={triggerFileUpload}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '2px dashed #60a5fa',
                backgroundColor: '#f8f9ff',
                color: '#60a5fa',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#60a5fa';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9ff';
                e.currentTarget.style.color = '#60a5fa';
              }}
            >
              📤 Carregar Imagem do Computador
            </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
              Formatos aceitos: PNG, JPG, GIF, SVG | Convertido automaticamente para WebP | Tamanho máximo: 100MB
            </p>
          </div>

          {imagePreview && (
            <div className="editor-group">
              <label>Preview da Imagem</label>
              <div
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          )}

          <div className="editor-group">
            <label>URL da Imagem</label>
            <input
              type="text"
              value={src}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(96, 165, 250, 0.5)',
                fontSize: '14px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
              💡 Cole um link ou use o botão acima para carregar do computador
            </p>
          </div>

          <div className="editor-group">
            <label>Texto Alternativo (ALT)</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="Descrição da imagem para acessibilidade"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(96, 165, 250, 0.5)',
                fontSize: '14px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
              ♿ Importante para SEO e acessibilidade
            </p>
          </div>

          {/* 🎯 NOVO: Botão Aplicar Mudanças */}
          {hasPendingChanges && (
            <div className="editor-group" style={{ marginTop: '16px' }}>
              <button
                onClick={applyChanges}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#60a5fa',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#5568d3';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#60a5fa';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(96, 165, 250, 0.3)';
                }}
              >
                <span>✅</span>
                <span>Aplicar no Iframe</span>
              </button>
              <p style={{ fontSize: '11px', color: '#60a5fa', marginTop: '8px', marginBottom: '0', textAlign: 'center', fontWeight: '500' }}>
                💡 Clique para visualizar as mudanças no site
              </p>
            </div>
          )}
        </>
      )}

      {isVideo && (
        <>
          {/* 🎯 NOVO: Seleção de Método de Entrada */}
          <div className="editor-group">
            <label>Método de Inserção de Vídeo</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => setInputMethod('url')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: `2px solid ${inputMethod === 'url' ? '#60a5fa' : 'rgba(96, 165, 250, 0.5)'}`,
                  backgroundColor: inputMethod === 'url' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(31, 41, 55, 0.9)',
                  color: inputMethod === 'url' ? '#60a5fa' : '#666',
                  fontSize: '12px',
                  fontWeight: inputMethod === 'url' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (inputMethod !== 'url') {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseOut={(e) => {
                  if (inputMethod !== 'url') {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.9)';
                  }
                }}
              >
                🔗 URL do Vídeo
              </button>
              <button
                onClick={() => setInputMethod('embed')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: `2px solid ${inputMethod === 'embed' ? '#60a5fa' : 'rgba(96, 165, 250, 0.5)'}`,
                  backgroundColor: inputMethod === 'embed' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(31, 41, 55, 0.9)',
                  color: inputMethod === 'embed' ? '#60a5fa' : '#666',
                  fontSize: '12px',
                  fontWeight: inputMethod === 'embed' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (inputMethod !== 'embed') {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseOut={(e) => {
                  if (inputMethod !== 'embed') {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.9)';
                  }
                }}
              >
                📋 Código Embed
              </button>
            </div>
            <p style={{ fontSize: '11px', color: '#999', margin: '0' }}>
              {inputMethod === 'url' ? 'Cole a URL do YouTube, Vimeo, etc.' : 'Cole o código <iframe> completo do YouTube'}
            </p>
          </div>

          {/* 🎯 Método: URL */}
          {inputMethod === 'url' && (
            <div className="editor-group">
              <label>URL do Vídeo</label>
              <input
                type="text"
                value={inputMethod === 'url' ? src : ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID ou https://vimeo.com/VIDEO_ID"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
                🌐 YouTube, Vimeo e outras plataformas suportadas. O sistema converte automaticamente!
              </p>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '6px', marginBottom: '0' }}>
                💡 Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
            </div>
          )}

          {/* 🎯 Método: Embed */}
          {inputMethod === 'embed' && (
            <div className="editor-group">
              <label>Código Embed Completo</label>
              <textarea
                value={embedInput}
                onChange={(e) => handleEmbedChange(e.target.value)}
                placeholder={`Cole o código iframe completo. Exemplo:\n<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  minHeight: '100px',
                  maxHeight: '150px',
                  resize: 'vertical'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
                📋 Cole o código &lt;iframe&gt; completo. O sistema extrai o src automaticamente.
              </p>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '6px', marginBottom: '0' }}>
                💡 No YouTube: Compartilhar → Incorporar → Copiar código
              </p>
            </div>
          )}

          {element.tagName === 'IFRAME' && (
            <div className="editor-group">
              <label>Preview</label>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#000'
                }}
              >
                {src && (
                  <iframe
                    src={src}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allowFullScreen
                    title="Video Preview"
                  />
                )}
              </div>
            </div>
          )}

          {/* 🎯 NOVO: Botão Aplicar Mudanças para Vídeos */}
          {hasPendingChanges && (
            <div className="editor-group" style={{ marginTop: '16px' }}>
              <button
                onClick={applyChanges}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#60a5fa',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#5568d3';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#60a5fa';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(96, 165, 250, 0.3)';
                }}
              >
                <span>✅</span>
                <span>Aplicar no Iframe</span>
              </button>
              <p style={{ fontSize: '11px', color: '#60a5fa', marginTop: '8px', marginBottom: '0', textAlign: 'center', fontWeight: '500' }}>
                💡 Clique para visualizar o vídeo no site
              </p>
            </div>
          )}
        </>
      )}

      {!isImage && !isVideo && (
        <div className="editor-group">
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            ℹ️ Selecione uma imagem ou vídeo para editar
          </p>
          <p style={{ color: '#999', textAlign: 'center', padding: '0 20px', fontSize: '13px', marginTop: '8px' }}>
            💡 Para editar links, use a aba "Links"
          </p>
        </div>
      )}
    </div>
  );
};