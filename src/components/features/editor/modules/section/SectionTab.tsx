import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface SectionTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const SectionTab: React.FC<SectionTabProps> = ({ element, onUpdate }) => {
  const sectionInfo = element.sectionInfo;

  // Estado bloqueado quando não é uma seção
  if (!sectionInfo) {
    return (
      <div style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        opacity: '0.6'
      }}>
        {/* Ícone de cadeado */}
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          opacity: '0.5'
        }}>
          🔒
        </div>

        {/* Mensagem principal */}
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Funcionalidade Bloqueada
        </div>

        {/* Instrução */}
        <div style={{
          fontSize: '13px',
          color: '#999',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '280px'
        }}>
          Selecione uma <strong>seção detectada</strong> (DIV grande, &lt;header&gt;, &lt;footer&gt;, &lt;section&gt;) para habilitar a identificação e edição de ID.
        </div>

        {/* Badge informativo */}
        <div style={{
          marginTop: '20px',
          padding: '8px 16px',
          backgroundColor: '#f0f0f0',
          borderRadius: '20px',
          fontSize: '11px',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>💡</span>
          <span>Detecta automaticamente Hero, Header, Footer e mais</span>
        </div>
      </div>
    );
  }

  const [sectionId, setSectionId] = useState(sectionInfo.id);
  const [error, setError] = useState('');

  useEffect(() => {
    setSectionId(sectionInfo.id);
    setError('');
  }, [element.xpath]);

  const validateId = (value: string): boolean => {
    // ID válido: apenas letras, números, hífen e underscore
    // Deve começar com letra
    const idPattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
    return idPattern.test(value);
  };

  const handleIdChange = (value: string) => {
    setSectionId(value);

    if (!value.trim()) {
      setError('O ID não pode estar vazio');
      return;
    }

    if (!validateId(value)) {
      setError('ID inválido. Use apenas letras, números, hífen e underscore. Deve começar com letra.');
      return;
    }

    setError('');

    // Atualizar o ID no elemento
    onUpdate({
      xpath: element.xpath,
      property: 'id',
      value,
      type: 'attribute'
    });
  };

  const badges: Record<string, string> = {
    'header': '🏠 HEADER',
    'hero': '🎯 HERO',
    'features': '⭐ RECURSOS',
    'about': '👥 SOBRE',
    'services': '🛠️ SERVIÇOS',
    'testimonials': '💬 DEPOIMENTOS',
    'pricing': '💰 PREÇOS',
    'cta': '📣 CTA',
    'contact': '📧 CONTATO',
    'footer': '🏁 RODAPÉ',
    'other': '📄 SEÇÃO'
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Categoria detectada */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          Categoria Detectada:
        </label>
        <div style={{
          backgroundColor: '#60a5fa',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {badges[sectionInfo.category] || '📄 SEÇÃO'}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#999',
          marginTop: '4px',
          textAlign: 'center'
        }}>
          Confiança: {sectionInfo.confidence}%
        </div>
      </div>

      {/* Campo editável de ID */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          ID da Seção:
        </label>
        <input
          type="text"
          value={sectionId}
          onChange={(e) => handleIdChange(e.target.value)}
          placeholder="ex: hero-1, header, footer"
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
        {error && (
          <div style={{
            marginTop: '6px',
            fontSize: '12px',
            color: '#e53e3e',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        <div style={{
          marginTop: '6px',
          fontSize: '11px',
          color: '#999'
        }}>
          Use apenas letras, números, hífen (-) e underscore (_)
        </div>
      </div>

      {/* Informações adicionais */}
      <div style={{
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '4px' }}>
          <strong>Tag:</strong> &lt;{element.tagName.toLowerCase()}&gt;
        </div>
        {element.className && (
          <div style={{ marginBottom: '4px' }}>
            <strong>Classes:</strong> {element.className}
          </div>
        )}
      </div>
    </div>
  );
};
