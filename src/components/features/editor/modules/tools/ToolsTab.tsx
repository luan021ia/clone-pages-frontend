import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SelectedElement, ElementUpdate, PageSettings } from '@/types/editor.types';
import { convertToWebP } from '@/utils/imageUtils';

interface ToolsTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  onSaveEdits?: () => void; // Callback para salvar edições globais
}

const defaultSettings: PageSettings = {
  title: '',
  description: '',
  keywords: '',
  favicon: '',
  headerCode: '',
  footerCode: '',
};

/**
 * 🔧 FERRAMENTAS - Configurações Globais da Página
 * - SEO: Título, Descrição, Keywords
 * - Identidade Visual: Favicon (upload/URL com compressão)
 * - Códigos Customizados: Header e Footer
 */
export const ToolsTab: React.FC<ToolsTabProps> = ({ element: _element, onUpdate: _onUpdate, iframeRef, onSaveEdits }) => {
  const [settings, setSettings] = useState<PageSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [originalFavicon, setOriginalFavicon] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // 📥 Solicitar configurações atuais do iframe
  const requestPageSettings = useCallback(() => {
    if (!iframeRef?.current?.contentWindow) {
      setIsLoading(false);
      return;
    }
    console.log('🔧 [ToolsTab] Solicitando configurações da página...');
    iframeRef.current.contentWindow.postMessage({
      source: 'EDITOR_PARENT',
      type: 'GET_PAGE_SETTINGS',
    }, '*');
  }, [iframeRef]);

  // 📤 Enviar configurações atualizadas para o iframe
  const updatePageSettings = useCallback((newSettings: Partial<PageSettings>) => {
    if (!iframeRef?.current?.contentWindow) {
      console.warn('❌ [ToolsTab] iframe não disponível');
      return;
    }

    setIsSaving(true);
    console.log('💾 [ToolsTab] Atualizando configurações:', newSettings);
    
    iframeRef.current.contentWindow.postMessage({
      source: 'EDITOR_PARENT',
      type: 'UPDATE_PAGE_SETTINGS',
      data: newSettings,
    }, '*');
  }, [iframeRef]);

  // 🎧 Listener para mensagens do iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source !== 'EDITOR_IFRAME') return;

      const { type, data } = event.data;

      if (type === 'PAGE_SETTINGS_DATA') {
        console.log('📥 [ToolsTab] Configurações recebidas:', data);
        setSettings(prev => ({ ...prev, ...data }));
        if (data?.favicon) {
          setFaviconPreview(data.favicon);
          setOriginalFavicon(data.favicon);
        }
        setIsLoading(false);
      }

      if (type === 'PAGE_SETTINGS_UPDATED') {
        console.log('✅ [ToolsTab] Configurações aplicadas com sucesso');
        setIsSaving(false);
        setSaveStatus('success');
        setHasChanges(false);
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 🔄 Solicitar configurações ao montar
  useEffect(() => {
    requestPageSettings();
    const timeout = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [requestPageSettings, isLoading]);

  // 📝 Handler genérico de alteração de campo
  const handleFieldChange = (field: keyof PageSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // 💾 Salvar alterações
  const handleSave = () => {
    updatePageSettings(settings);
    
    // 🎯 Após salvar configurações no iframe, também salvar o HTML geral
    // para garantir que o download terá as alterações
    setTimeout(() => {
      if (onSaveEdits) {
        console.log('🔧 [ToolsTab] Acionando salvamento global do HTML...');
        onSaveEdits();
      }
    }, 500); // Delay para garantir que o iframe processou as alterações
  };

  // 🖼️ Comprimir imagem para favicon (convertido para WebP)
  const compressImage = (file: File, maxSize: number = 64): Promise<string> => {
    // Usar convertToWebP com dimensões específicas para favicon
    return convertToWebP(file, {
      maxWidth: maxSize,
      maxHeight: maxSize,
      quality: 0.9,
      maintainAspectRatio: true,
    }).then((webpBase64) => {
      console.log(`🔧 [ToolsTab] Favicon convertido para WebP: ${Math.round(webpBase64.length * 0.75 / 1024)}KB`);
      return webpBase64;
    });
  };

  // 📤 Upload de favicon
  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    setIsCompressing(true);

    try {
      let base64: string;
      
      if (file.size > 100 * 1024) {
        console.log(`🔧 [ToolsTab] Comprimindo favicon (${Math.round(file.size / 1024)}KB)...`);
        base64 = await compressImage(file, 64);
      } else {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
          reader.readAsDataURL(file);
        });
      }

      setFaviconPreview(base64);
      handleFieldChange('favicon', base64);
    } catch (error) {
      console.error('❌ [ToolsTab] Erro ao processar favicon:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setIsCompressing(false);
    }
  };

  // 🔗 Usar URL de favicon
  const handleFaviconUrl = (url: string) => {
    setFaviconPreview(url);
    handleFieldChange('favicon', url);
  };

  // 🔄 Loading
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '200px',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(96, 165, 250, 0.3)',
          borderTopColor: '#60a5fa',
          borderRadius: '50%',
          animation: 'rotate 0.8s linear infinite',
        }} />
        <p style={{ color: '#a5b4fc', fontSize: '13px' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔍 SEO - TÍTULO E DESCRIÇÃO */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {/* Título da Página */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#c7d2fc',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>📄</span>
          Título da Página
        </label>
        <input
          type="text"
          value={settings.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Ex: Minha Página Incrível"
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '10px',
            color: '#e5e7eb',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
          Aparece na aba do navegador • {settings.title.length}/60 caracteres
        </p>
      </div>

      {/* Meta Descrição */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#c7d2fc',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>📝</span>
          Meta Descrição
        </label>
        <textarea
          value={settings.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Descreva sua página em até 160 caracteres..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '10px',
            color: '#e5e7eb',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            minHeight: '80px',
          }}
        />
        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
          Resumo nos resultados de busca • {settings.description.length}/160 caracteres
        </p>
      </div>

      {/* Palavras-chave */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#c7d2fc',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>🏷️</span>
          Palavras-chave
          <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input
          type="text"
          value={settings.keywords || ''}
          onChange={(e) => handleFieldChange('keywords', e.target.value)}
          placeholder="palavra1, palavra2, palavra3"
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '10px',
            color: '#e5e7eb',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SEPARADOR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent)',
        margin: '4px 0',
      }} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🎨 FAVICON */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#c7d2fc',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '16px' }}>🎨</span>
          Favicon
        </label>

        {/* Preview do Favicon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(96, 165, 250, 0.2)',
          marginBottom: '12px',
        }}>
          {/* Ícone Preview */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(129, 140, 248, 0.1) 100%)',
            border: '2px solid rgba(96, 165, 250, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {faviconPreview ? (
              <img
                src={faviconPreview}
                alt="Favicon"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '8px',
                }}
              />
            ) : (
              <span style={{ fontSize: '24px', opacity: 0.4 }}>🖼️</span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', color: '#e0e7ff', margin: '0 0 4px 0', fontWeight: 500 }}>
              {faviconPreview ? (
                faviconPreview === originalFavicon ? 'Favicon Original' : '✨ Novo Favicon'
              ) : 'Sem favicon definido'}
            </p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
              Ícone que aparece na aba do navegador
            </p>
          </div>

          {/* Botão Remover */}
          {faviconPreview && (
            <button
              onClick={() => {
                setFaviconPreview('');
                handleFieldChange('favicon', '');
              }}
              style={{
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Remover
            </button>
          )}
        </div>

        {/* Upload de Favicon */}
        <input
          ref={faviconInputRef}
          type="file"
          accept="image/*"
          onChange={handleFaviconUpload}
          style={{ display: 'none' }}
        />
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button
            onClick={() => faviconInputRef.current?.click()}
            disabled={isCompressing}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'rgba(79, 70, 229, 0.15)',
              border: '1px dashed rgba(96, 165, 250, 0.4)',
              borderRadius: '8px',
              color: '#a5b4fc',
              fontSize: '13px',
              cursor: isCompressing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {isCompressing ? '⏳ Comprimindo...' : '📤 Upload'}
          </button>
        </div>

        {/* URL do Favicon */}
        <input
          type="text"
          value={settings.favicon.startsWith('data:') ? '' : settings.favicon}
          onChange={(e) => handleFaviconUrl(e.target.value)}
          placeholder="Ou cole a URL do favicon aqui..."
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '8px',
            color: '#e5e7eb',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SEPARADOR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent)',
        margin: '4px 0',
      }} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 💻 CÓDIGOS CUSTOMIZADOS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* Código do Header */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#c7d2fc',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>🔝</span>
          Código no Header
        </label>
        <textarea
          value={settings.headerCode}
          onChange={(e) => handleFieldChange('headerCode', e.target.value)}
          placeholder="<!-- Scripts, CSS, meta tags... -->"
          rows={4}
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '10px',
            color: '#e5e7eb',
            fontSize: '12px',
            fontFamily: 'monospace',
            outline: 'none',
            resize: 'vertical',
            minHeight: '90px',
          }}
        />
        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
          Injetado antes de &lt;/head&gt; • Analytics, Pixel, CSS
        </p>
      </div>

      {/* Código do Footer */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#c7d2fc',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>🔚</span>
          Código no Footer
        </label>
        <textarea
          value={settings.footerCode}
          onChange={(e) => handleFieldChange('footerCode', e.target.value)}
          placeholder="<!-- Scripts de rastreamento, chat... -->"
          rows={4}
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '10px',
            color: '#e5e7eb',
            fontSize: '12px',
            fontFamily: 'monospace',
            outline: 'none',
            resize: 'vertical',
            minHeight: '90px',
          }}
        />
        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
          Injetado antes de &lt;/body&gt; • Scripts, Chat widgets
        </p>
      </div>

      {/* Aviso */}
      <div style={{
        padding: '10px 12px',
        background: 'rgba(251, 191, 36, 0.08)',
        border: '1px solid rgba(251, 191, 36, 0.25)',
        borderRadius: '8px',
      }}>
        <p style={{ fontSize: '11px', color: '#fcd34d', margin: 0 }}>
          ⚠️ Códigos inseridos aqui serão executados na página.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 💾 BOTÃO SALVAR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div style={{ marginTop: '8px' }}>
        {/* Status */}
        {hasChanges && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(251, 191, 36, 0.12)',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#fcd34d',
            marginBottom: '10px',
          }}>
            ⚡ Alterações não salvas
          </div>
        )}

        {saveStatus === 'success' && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(16, 185, 129, 0.12)',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#10b981',
            marginBottom: '10px',
          }}>
            ✅ Configurações salvas!
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: hasChanges 
              ? 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%)'
              : 'rgba(96, 165, 250, 0.2)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: hasChanges && !isSaving ? 'pointer' : 'not-allowed',
            opacity: hasChanges ? 1 : 0.5,
            boxShadow: hasChanges ? '0 4px 12px rgba(96, 165, 250, 0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {isSaving ? '⏳ Salvando...' : '💾 Salvar Configurações'}
        </button>
      </div>

      {/* Info final */}
      <p style={{
        fontSize: '11px',
        color: '#6b7280',
        textAlign: 'center',
        margin: '8px 0 0 0',
      }}>
        💡 Salve e depois clique em ✓ no topo para aplicar
      </p>
    </div>
  );
};
