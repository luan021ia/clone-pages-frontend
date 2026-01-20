import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface LinkTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
  allSections?: Array<{ id: string; category: string; name: string }>;
}

export const LinkTab: React.FC<LinkTabProps> = ({ element, onUpdate, allSections = [] }) => {
  const [linkType, setLinkType] = useState<'external' | 'internal'>('external');
  const [externalUrl, setExternalUrl] = useState('');
  const [internalAnchor, setInternalAnchor] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [error, setError] = useState('');
  const [hasLink, setHasLink] = useState(false);

  // Debug: Log quando allSections muda
  useEffect(() => {
    console.log('🔗 [LinkTab] allSections recebido:', allSections);
    console.log('🔗 [LinkTab] Quantidade de secoes:', allSections?.length || 0);
  }, [allSections]);

  useEffect(() => {
    // Detectar se o elemento ja tem link
    const isAnchor = element.tagName.toLowerCase() === 'a';
    setHasLink(isAnchor);

    if (isAnchor) {
      // Extrair informacoes do link existente
      const href = element.attributes?.href || '';
      const target = element.attributes?.target || '';

      setOpenInNewTab(target === '_blank');
      setLinkText(element.textContent || '');

      if (href.startsWith('#')) {
        setLinkType('internal');
        setInternalAnchor(href);
      } else {
        setLinkType('external');
        setExternalUrl(href);
      }
    } else {
      // Resetar valores
      setExternalUrl('');
      setInternalAnchor('');
      setOpenInNewTab(false);
      setLinkText(element.textContent || '');
    }

    setError('');
  }, [element.xpath]);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setError('A URL nao pode estar vazia');
      return false;
    }

    // Permitir URLs relativas ou absolutas
    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+(\/.*)?$|^\/[\w\d\/.-]*$/i;

    if (!urlPattern.test(url) && !url.startsWith('/')) {
      setError('URL invalida. Use formato: https://example.com ou /page');
      return false;
    }

    setError('');
    return true;
  };

  const validateAnchor = (anchor: string): boolean => {
    if (!anchor.trim()) {
      setError('Selecione uma secao para navegacao interna');
      return false;
    }

    setError('');
    return true;
  };

  const handleApplyLink = () => {
    let href = '';

    if (linkType === 'external') {
      if (!validateUrl(externalUrl)) return;
      href = externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`;
    } else {
      if (!validateAnchor(internalAnchor)) return;
      href = internalAnchor;
    }

    // Enviar update para o backend
    onUpdate({
      xpath: element.xpath,
      property: 'href',
      value: href,
      type: 'link',
      metadata: {
        target: openInNewTab ? '_blank' : '_self',
        rel: openInNewTab ? 'noopener noreferrer' : undefined
      }
    });

    setHasLink(true);
    setError('');
  };

  const handleRemoveLink = () => {
    onUpdate({
      xpath: element.xpath,
      property: 'href',
      value: '',
      type: 'remove-link'
    });

    setHasLink(false);
    setExternalUrl('');
    setInternalAnchor('');
    setOpenInNewTab(false);
    setError('');
  };

  const badges: Record<string, string> = {
    'header': '🏠 HEADER',
    'hero': '🎯 HERO',
    'features': '⭐ RECURSOS',
    'about': '👥 SOBRE',
    'services': '🛠️ SERVICOS',
    'testimonials': '💬 DEPOIMENTOS',
    'pricing': '💰 PRECOS',
    'cta': '📣 CTA',
    'contact': '📧 CONTATO',
    'footer': '🏁 RODAPE',
    'other': '📄 SECAO'
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Status do link */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          Status:
        </label>
        <div style={{
          backgroundColor: hasLink ? '#48bb78' : '#e2e8f0',
          color: hasLink ? 'white' : '#666',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {hasLink ? '🔗 Elemento com Link' : '⛓️ Sem Link'}
        </div>
      </div>

      {/* Tipo de link */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          Tipo de Link:
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setLinkType('external')}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: linkType === 'external' ? '#60a5fa' : '#f0f0f0',
              color: linkType === 'external' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🌐 Externo
          </button>
          <button
            onClick={() => setLinkType('internal')}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: linkType === 'internal' ? '#60a5fa' : '#f0f0f0',
              color: linkType === 'internal' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🎯 Interno
          </button>
        </div>
      </div>

      {/* Link externo */}
      {linkType === 'external' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px'
          }}>
            URL Externa:
          </label>
          <input
            type="text"
            value={externalUrl}
            onChange={(e) => {
              setExternalUrl(e.target.value);
              setError('');
            }}
            placeholder="https://exemplo.com ou /pagina"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: error ? '2px solid #e53e3e' : '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'monospace'
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = '#60a5fa';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }
            }}
          />
          <div style={{
            marginTop: '6px',
            fontSize: '11px',
            color: '#999'
          }}>
            Ex: https://google.com ou /contato
          </div>
        </div>
      )}

      {/* Link interno (ancoras) */}
      {linkType === 'internal' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px'
          }}>
            Navegar para Secao:
          </label>
          {allSections.length === 0 ? (
            <div style={{
              padding: '16px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#856404',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '8px' }}>⚠️</div>
              Nenhuma secao detectada na pagina. Use a aba "Identificacao" para criar secoes.
            </div>
          ) : (
            <>
              <select
                value={internalAnchor}
                onChange={(e) => {
                  setInternalAnchor(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: error ? '2px solid #e53e3e' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.currentTarget.style.borderColor = '#60a5fa';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }
                }}
              >
                <option value="">Selecione uma secao...</option>
                {allSections.map((section) => (
                  <option key={section.id} value={`#${section.id}`}>
                    {badges[section.category] || '📄'} {section.name}
                  </option>
                ))}
              </select>
              <div style={{
                marginTop: '6px',
                fontSize: '11px',
                color: '#999'
              }}>
                Navegacao suave com scroll automatico
              </div>
            </>
          )}
        </div>
      )}

      {/* Opcao de abrir em nova aba */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: '500',
          color: '#666',
          cursor: 'pointer',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={openInNewTab}
            onChange={(e) => setOpenInNewTab(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          Abrir em nova aba
        </label>
        <div style={{
          marginTop: '4px',
          marginLeft: '26px',
          fontSize: '11px',
          color: '#999'
        }}>
          {openInNewTab ? 'Link abrira em nova janela (_blank)' : 'Link abrira na mesma janela (_self)'}
        </div>
      </div>

      {/* Texto do Link */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          Texto do Link:
        </label>
        <input
          type="text"
          value={linkText}
          onChange={(e) => {
            setLinkText(e.target.value);
            // Aplicar mudanca imediatamente
            onUpdate({
              xpath: element.xpath,
              property: 'textContent',
              value: e.target.value,
              type: 'content'
            });
          }}
          placeholder="Clique aqui"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#60a5fa';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        />
        <div style={{
          marginTop: '6px',
          fontSize: '11px',
          color: '#999'
        }}>
          O texto visivel do link (botao ou ancora)
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#fee',
          border: '1px solid #e53e3e',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#e53e3e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Botoes de acao */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleApplyLink}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: '#60a5fa',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(96, 165, 250, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5568d3';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#60a5fa';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(96, 165, 250, 0.3)';
          }}
        >
          {hasLink ? '✏️ Atualizar Link' : '🔗 Aplicar Link'}
        </button>

        {hasLink && (
          <button
            onClick={handleRemoveLink}
            style={{
              padding: '12px 16px',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(229, 62, 62, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c53030';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(229, 62, 62, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e53e3e';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(229, 62, 62, 0.3)';
            }}
          >
            🗑️ Remover
          </button>
        )}
      </div>

      {/* Informacoes adicionais */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '4px' }}>
          <strong>Elemento:</strong> &lt;{element.tagName.toLowerCase()}&gt;
        </div>
        {element.className && (
          <div style={{ marginBottom: '4px' }}>
            <strong>Classes:</strong> {element.className}
          </div>
        )}
        <div style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #e0e0e0',
          fontSize: '11px',
          color: '#999'
        }}>
          💡 Qualquer elemento pode ser transformado em link
        </div>
      </div>
    </div>
  );
};
