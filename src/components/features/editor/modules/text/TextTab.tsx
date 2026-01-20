import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import { SolidColorPicker } from '@/components/features/editor/shared/SolidColorPicker';
import { GradientPicker } from '@/components/features/editor/shared/GradientPicker';

interface TextTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const TextTab: React.FC<TextTabProps> = ({ element, onUpdate }) => {
  // 🎯 FIX: Usar operador opcional seguro para styles
  const styles = element.styles || {};

  const [textContent, setTextContent] = useState(element.textContent || '');
  const [fontSize, setFontSize] = useState(parseInt(styles.fontSize) || 16);
  const [fontWeight, setFontWeight] = useState(styles.fontWeight || 'normal');
  const [textAlign, setTextAlign] = useState(styles.textAlign || 'left');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [letterSpacing, setLetterSpacing] = useState('0');
  const [textTransform, setTextTransform] = useState('none');
  const [isBold, setIsBold] = useState(styles.fontWeight === 'bold' || styles.fontWeight === '700');
  const [isItalic, setIsItalic] = useState(styles.fontStyle === 'italic');
  const [isUnderline, setIsUnderline] = useState(styles.textDecoration?.includes('underline') || false);
  const [textColor, setTextColor] = useState(styles.color || '#000000');

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar (novo elemento selecionado)
  // Isso evita que os inputs percam foco ao digitar
  useEffect(() => {
    setTextContent(element.textContent || '');
    setFontSize(parseInt(styles.fontSize) || 16);
    setFontWeight(styles.fontWeight || 'normal');
    setTextAlign(styles.textAlign || 'left');
    setIsBold(styles.fontWeight === 'bold' || styles.fontWeight === '700');
    setIsItalic(styles.fontStyle === 'italic');
    setIsUnderline(styles.textDecoration?.includes('underline') || false);
    setTextColor(styles.color || '#000000');
  }, [element.xpath]); // 🎯 Mudança crítica: apenas quando elemento mudar, não quando styles mudarem

  const handleTextChange = (value: string) => {
    console.log('📝 [TextTab] handleTextChange CHAMADO', { value });
    setTextContent(value);
    onUpdate({
      xpath: element.xpath,
      property: 'textContent',
      value,
      type: 'content'
    });
  };

  const handleFontSizeChange = (value: number) => {
    console.log('📏 [TextTab] handleFontSizeChange CHAMADO', { value });
    setFontSize(value);
    onUpdate({
      xpath: element.xpath,
      property: 'fontSize',
      value: `${value}px`,
      type: 'style'
    });
  };

  const handleFontWeightChange = (value: string) => {
    setFontWeight(value);
    onUpdate({
      xpath: element.xpath,
      property: 'fontWeight',
      value,
      type: 'style'
    });
  };

  const handleTextAlignChange = (value: string) => {
    setTextAlign(value);
    onUpdate({
      xpath: element.xpath,
      property: 'textAlign',
      value,
      type: 'style'
    });
  };

  const handleLineHeightChange = (value: string) => {
    setLineHeight(value);
    onUpdate({
      xpath: element.xpath,
      property: 'lineHeight',
      value,
      type: 'style'
    });
  };

  const handleLetterSpacingChange = (value: string) => {
    setLetterSpacing(value);
    onUpdate({
      xpath: element.xpath,
      property: 'letterSpacing',
      value: `${value}px`,
      type: 'style'
    });
  };

  const handleTextTransformChange = (value: string) => {
    setTextTransform(value);
    onUpdate({
      xpath: element.xpath,
      property: 'textTransform',
      value,
      type: 'style'
    });
  };

  const handleTextColorChange = (value: string) => {
    setTextColor(value);

    // 🎯 FIX: Limpar gradiente de TEXTO automaticamente ao aplicar cor sólida
    // Texto com gradiente usa: background + background-clip: text + color: transparent
    // Precisamos remover todas essas propriedades para a cor sólida funcionar
    onUpdate({
      xpath: element.xpath,
      property: 'background',
      value: 'none',
      type: 'style'
    });
    onUpdate({
      xpath: element.xpath,
      property: 'webkitBackgroundClip',
      value: 'unset',
      type: 'style'
    });
    onUpdate({
      xpath: element.xpath,
      property: 'backgroundClip',
      value: 'unset',
      type: 'style'
    });
    onUpdate({
      xpath: element.xpath,
      property: 'webkitTextFillColor',
      value: 'unset',
      type: 'style'
    });

    // Aplicar a cor do texto
    onUpdate({
      xpath: element.xpath,
      property: 'color',
      value,
      type: 'style'
    });
  };

  // 🌈 Função para aplicar gradiente em texto
  const applyTextGradient = (gradient: string) => {
    // Para gradiente em texto, precisa de 4 propriedades:
    // 1. background: gradient
    // 2. -webkit-background-clip: text
    // 3. -webkit-text-fill-color: transparent
    // 4. background-clip: text

    // Aplicar as 4 propriedades separadamente
    onUpdate({
      xpath: element.xpath,
      property: 'background',
      value: gradient,
      type: 'style'
    });

    // Aguardar um pouco e aplicar as propriedades de clipping
    setTimeout(() => {
      onUpdate({
        xpath: element.xpath,
        property: '-webkit-background-clip',
        value: 'text',
        type: 'style'
      });

      onUpdate({
        xpath: element.xpath,
        property: '-webkit-text-fill-color',
        value: 'transparent',
        type: 'style'
      });

      onUpdate({
        xpath: element.xpath,
        property: 'background-clip',
        value: 'text',
        type: 'style'
      });

      // Garantir que seja display inline-block para funcionar
      onUpdate({
        xpath: element.xpath,
        property: 'display',
        value: 'inline-block',
        type: 'style'
      });
    }, 100);
  };

  // 🌈 Função para remover gradiente de texto
  const removeTextGradient = () => {
    // Remover as propriedades de gradiente
    onUpdate({
      xpath: element.xpath,
      property: 'background',
      value: 'none',
      type: 'style'
    });

    setTimeout(() => {
      onUpdate({
        xpath: element.xpath,
        property: '-webkit-background-clip',
        value: 'unset',
        type: 'style'
      });

      onUpdate({
        xpath: element.xpath,
        property: '-webkit-text-fill-color',
        value: 'unset',
        type: 'style'
      });

      onUpdate({
        xpath: element.xpath,
        property: 'background-clip',
        value: 'unset',
        type: 'style'
      });

      onUpdate({
        xpath: element.xpath,
        property: 'display',
        value: 'inherit',
        type: 'style'
      });

      // Restaurar cor de texto original
      onUpdate({
        xpath: element.xpath,
        property: 'color',
        value: textColor,
        type: 'style'
      });
    }, 100);
  };

  const handleBoldToggle = () => {
    const newBoldState = !isBold;
    console.log('🔤 [TextTab] handleBoldToggle CHAMADO', { newBoldState });
    setIsBold(newBoldState);
    onUpdate({
      xpath: element.xpath,
      property: 'fontWeight',
      value: newBoldState ? 'bold' : 'normal',
      type: 'style'
    });
  };

  const handleItalicToggle = () => {
    const newItalicState = !isItalic;
    console.log('🔤 [TextTab] handleItalicToggle CHAMADO', { newItalicState });
    setIsItalic(newItalicState);
    onUpdate({
      xpath: element.xpath,
      property: 'fontStyle',
      value: newItalicState ? 'italic' : 'normal',
      type: 'style'
    });
  };

  const handleUnderlineToggle = () => {
    const newUnderlineState = !isUnderline;
    console.log('🔤 [TextTab] handleUnderlineToggle CHAMADO', { newUnderlineState });
    setIsUnderline(newUnderlineState);
    onUpdate({
      xpath: element.xpath,
      property: 'textDecoration',
      value: newUnderlineState ? 'underline' : 'none',
      type: 'style'
    });
  };

  return (
    <div className="editor-tab-content">
      <div className="editor-group">
        <label>Conteúdo do Texto</label>
        <textarea
          value={textContent}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={4}
          placeholder="Digite o texto..."
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            fontFamily: 'inherit',
            fontSize: '14px',
            color: '#f3f4f6',
            resize: 'vertical',
            background: 'rgba(31, 41, 55, 0.9)',
          }}
        />
      </div>

      <div className="editor-group">
        <label>Formatação Rápida</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            onClick={handleBoldToggle}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '2px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: isBold ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: isBold ? 'white' : '#e5e7eb',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            title="Negrito (Ctrl+B)"
          >
            B
          </button>
          <button
            onClick={handleItalicToggle}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '2px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: isItalic ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: isItalic ? 'white' : '#e5e7eb',
              cursor: 'pointer',
              fontStyle: 'italic',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            title="Itálico (Ctrl+I)"
          >
            I
          </button>
          <button
            onClick={handleUnderlineToggle}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '2px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: isUnderline ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: isUnderline ? 'white' : '#e5e7eb',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            title="Sublinhado (Ctrl+U)"
          >
            U
          </button>
        </div>
      </div>

      <div className="editor-group">
        <label style={{ color: '#c7d2fc', fontWeight: '600', marginBottom: '8px' }}>Tamanho da Fonte</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            min="8"
            max="200"
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(31, 41, 55, 0.8)',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <span style={{
            minWidth: '50px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#e0e7ff',
            background: 'rgba(79, 70, 229, 0.2)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.4)'
          }}>
            {fontSize}px
          </span>
        </div>
      </div>

      <div className="editor-group">
        <label style={{ color: '#c7d2fc', fontWeight: '600', marginBottom: '8px' }}>Peso da Fonte</label>
        <select
          value={fontWeight}
          onChange={(e) => handleFontWeightChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        >
          <option value="100">Thin (100)</option>
          <option value="200">Extra Light (200)</option>
          <option value="300">Light (300)</option>
          <option value="normal">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi Bold (600)</option>
          <option value="bold">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      <div className="editor-group">
        <label>Alinhamento</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <button
            onClick={() => handleTextAlignChange('left')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: textAlign === 'left' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: textAlign === 'left' ? 'white' : '#e5e7eb',
              cursor: 'pointer'
            }}
          >
            ⬅️
          </button>
          <button
            onClick={() => handleTextAlignChange('center')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: textAlign === 'center' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: textAlign === 'center' ? 'white' : '#e5e7eb',
              cursor: 'pointer'
            }}
          >
            ↔️
          </button>
          <button
            onClick={() => handleTextAlignChange('right')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: textAlign === 'right' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: textAlign === 'right' ? 'white' : '#e5e7eb',
              cursor: 'pointer'
            }}
          >
            ➡️
          </button>
          <button
            onClick={() => handleTextAlignChange('justify')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: textAlign === 'justify' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: textAlign === 'justify' ? 'white' : '#e5e7eb',
              cursor: 'pointer'
            }}
          >
            ⬌
          </button>
        </div>
      </div>

      <div className="editor-group">
        <label>Altura da Linha</label>
        <input
          type="number"
          value={lineHeight}
          onChange={(e) => handleLineHeightChange(e.target.value)}
          min="0.5"
          max="3"
          step="0.1"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        />
      </div>

      <div className="editor-group">
        <label>Espaçamento entre Letras</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            value={letterSpacing}
            onChange={(e) => handleLetterSpacingChange(e.target.value)}
            min="-10"
            max="50"
            step="0.5"
            style={{
              width: '80px',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>px</span>
        </div>
      </div>

      <div className="editor-group">
        <label>Transformação de Texto</label>
        <select
          value={textTransform}
          onChange={(e) => handleTextTransformChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        >
          <option value="none">Nenhuma</option>
          <option value="uppercase">MAIÚSCULAS</option>
          <option value="lowercase">minúsculas</option>
          <option value="capitalize">Primeira Letra Maiúscula</option>
        </select>
      </div>

      {/* 🎨 SISTEMA COMPLETO DE CORES SÓLIDAS */}
      <SolidColorPicker
        property="color"
        currentColor={textColor}
        onColorChange={handleTextColorChange}
        label="📝 Cor do Texto"
      />

      {/* 🌈 SISTEMA COMPLETO DE GRADIENTES */}
      <GradientPicker
        applyType="text"
        onGradientApply={applyTextGradient}
        onGradientRemove={removeTextGradient}
      />
    </div>
  );
};
