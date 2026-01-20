import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface TypographyTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

// Paletas de cores profissionais
const MATERIAL_COLORS = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
  '#607D8B', '#000000', '#FFFFFF'
];

export const TypographyTab: React.FC<TypographyTabProps> = ({ element, onUpdate }) => {
  // 🛡️ Null safety: Ensure element and styles exist
  const styles = element?.styles || {};

  // ========== TIPOGRAFIA ==========
  const [textContent, setTextContent] = useState(element?.textContent || '');
  const [fontSize, setFontSize] = useState(parseInt(styles?.fontSize as string) || 16);
  const [fontWeight, setFontWeight] = useState(styles?.fontWeight as string || 'normal');
  const [textAlign, setTextAlign] = useState(styles?.textAlign as string || 'left');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [letterSpacing, setLetterSpacing] = useState('0');
  const [textTransform, setTextTransform] = useState('none');
  const [isBold, setIsBold] = useState(styles?.fontWeight === 'bold' || styles?.fontWeight === '700');
  const [isItalic, setIsItalic] = useState(styles?.fontStyle === 'italic');
  const [isUnderline, setIsUnderline] = useState((styles?.textDecoration as string)?.includes('underline') || false);

  // ========== CORES ==========
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [opacity, setOpacity] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar
  useEffect(() => {
    // 🛡️ Null safety check
    if (!element?.styles) {
      console.warn('⚠️ [TypographyTab] element.styles is undefined');
      return;
    }

    // Tipografia
    setTextContent(element?.textContent || '');
    setFontSize(parseInt(styles?.fontSize as string) || 16);
    setFontWeight(styles?.fontWeight as string || 'normal');
    setTextAlign(styles?.textAlign as string || 'left');
    setIsBold(styles?.fontWeight === 'bold' || styles?.fontWeight === '700');
    setIsItalic(styles?.fontStyle === 'italic');
    setIsUnderline((styles?.textDecoration as string)?.includes('underline') || false);

    // Cores
    const parseColor = (color: string): string => {
      if (!color || color === 'transparent') return '#ffffff';
      if (color?.startsWith('#')) return color;
      return '#000000';
    };

    setTextColor(parseColor(styles?.color as string || ''));
    setBackgroundColor(styles?.backgroundColor === 'transparent' ? '#ffffff' : parseColor(styles?.backgroundColor as string || ''));
    setOpacity(parseFloat(styles?.opacity as string || '1') * 100);
  }, [element.xpath]);

  // ========== HANDLERS TIPOGRAFIA ==========
  const handleTextChange = (value: string) => {
    setTextContent(value);
    onUpdate({
      xpath: element.xpath,
      property: 'textContent',
      value,
      type: 'content'
    });
  };

  const handleFontSizeChange = (value: number) => {
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

  const handleBoldToggle = () => {
    const newBoldState = !isBold;
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
    setIsUnderline(newUnderlineState);
    onUpdate({
      xpath: element.xpath,
      property: 'textDecoration',
      value: newUnderlineState ? 'underline' : 'none',
      type: 'style'
    });
  };

  // ========== HANDLERS CORES ==========
  const isButtonElement = () => {
    // 🎯 FIX: Adicionar null safety checks
    const tagName = element?.tagName?.toLowerCase() || '';
    const className = element?.className?.toLowerCase() || '';
    const role = element?.attributes?.role?.toLowerCase() || '';
    const type = element?.attributes?.type?.toLowerCase() || '';

    return tagName === 'button' ||
           role === 'button' ||
           type === 'button' ||
           className.includes('btn') ||
           className.includes('button') ||
           className.includes('elementor-button');
  };

  const handleColorChange = (_property: string, value: string) => {
    const isButton = isButtonElement();
    // 🎯 FIX: Adicionar null safety para tagName
    const tagName = element?.tagName?.toLowerCase() || '';
    const isTextElement = tagName.match(/^(h1|h2|h3|h4|h5|h6|p|span|a|strong|em|li|label|legend)$/);

    if (isButton) {
      onUpdate({ xpath: element.xpath, property: 'background', value, type: 'style' });
    } else if (isTextElement) {
      onUpdate({ xpath: element.xpath, property: 'color', value, type: 'style' });
    } else {
      onUpdate({ xpath: element.xpath, property: 'background', value, type: 'style' });
    }
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    onUpdate({
      xpath: element.xpath,
      property: 'opacity',
      value: (value / 100).toString(),
      type: 'style'
    });
  };

  const addToRecentColors = (color: string) => {
    if (!recentColors.includes(color) && color !== 'transparent') {
      const newRecentColors = [color, ...recentColors.filter(c => c !== color)].slice(0, 12);
      setRecentColors(newRecentColors);
    }
  };

  return (
    <div className="editor-tab-content">
      {/* ========== SEÇÃO: CONTEÚDO DO TEXTO ========== */}
      <div className="editor-group">
        <label>📝 Conteúdo do Texto</label>
        <textarea
          value={textContent}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={3}
          placeholder="Digite o texto..."
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontFamily: 'inherit',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* ========== SEÇÃO: FORMATAÇÃO RÁPIDA ========== */}
      <div className="editor-group">
        <label>✨ Formatação Rápida</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            onClick={handleBoldToggle}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '2px solid #ddd',
              backgroundColor: isBold ? '#60a5fa' : 'white',
              color: isBold ? 'white' : '#333',
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
              border: '2px solid #ddd',
              backgroundColor: isItalic ? '#60a5fa' : 'white',
              color: isItalic ? 'white' : '#333',
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
              border: '2px solid #ddd',
              backgroundColor: isUnderline ? '#60a5fa' : 'white',
              color: isUnderline ? 'white' : '#333',
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

      {/* ========== SEÇÃO: COR DO TEXTO ========== */}
      <div className="editor-group">
        <label>🎨 Cor do Texto</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setTextColor(newColor);
              handleColorChange('color', newColor);
              addToRecentColors(newColor);
            }}
            style={{
              width: '60px',
              height: '40px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          />
          <input
            type="text"
            value={textColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setTextColor(newColor);
              handleColorChange('color', newColor);
              if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                addToRecentColors(newColor);
              }
            }}
            placeholder="#000000"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      {/* ========== SEÇÃO: TAMANHO DA FONTE ========== */}
      <div className="editor-group">
        <label>📏 Tamanho da Fonte</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            min="8"
            max="200"
            style={{
              width: '80px',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>px</span>
          <input
            type="range"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            min="8"
            max="200"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* ========== SEÇÃO: PESO DA FONTE ========== */}
      <div className="editor-group">
        <label>⚖️ Peso da Fonte</label>
        <select
          value={fontWeight}
          onChange={(e) => handleFontWeightChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
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

      {/* ========== SEÇÃO: ALINHAMENTO ========== */}
      <div className="editor-group">
        <label>↔️ Alinhamento</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          <button
            onClick={() => handleTextAlignChange('left')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: textAlign === 'left' ? '#60a5fa' : 'white',
              color: textAlign === 'left' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Alinhar à esquerda"
          >
            ⬅️
          </button>
          <button
            onClick={() => handleTextAlignChange('center')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: textAlign === 'center' ? '#60a5fa' : 'white',
              color: textAlign === 'center' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Centralizar"
          >
            ↔️
          </button>
          <button
            onClick={() => handleTextAlignChange('right')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: textAlign === 'right' ? '#60a5fa' : 'white',
              color: textAlign === 'right' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Alinhar à direita"
          >
            ➡️
          </button>
          <button
            onClick={() => handleTextAlignChange('justify')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: textAlign === 'justify' ? '#60a5fa' : 'white',
              color: textAlign === 'justify' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Justificar"
          >
            ⬌
          </button>
        </div>
      </div>

      {/* ========== SEÇÃO: ESPAÇAMENTO ========== */}
      <div className="editor-group">
        <label>📏 Altura da Linha</label>
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
            border: '1px solid #ddd'
          }}
        />
      </div>

      <div className="editor-group">
        <label>📏 Espaçamento entre Letras</label>
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
              border: '1px solid #ddd'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>px</span>
        </div>
      </div>

      {/* ========== SEÇÃO: TRANSFORMAÇÃO ========== */}
      <div className="editor-group">
        <label>🔤 Transformação de Texto</label>
        <select
          value={textTransform}
          onChange={(e) => handleTextTransformChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <option value="none">Nenhuma</option>
          <option value="uppercase">MAIÚSCULAS</option>
          <option value="lowercase">minúsculas</option>
          <option value="capitalize">Primeira Letra Maiúscula</option>
        </select>
      </div>

      {/* ========== SEÇÃO: COR DE FUNDO ========== */}
      <div className="editor-group">
        <label>🎨 Cor de Fundo</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setBackgroundColor(newColor);
              handleColorChange('backgroundColor', newColor);
              addToRecentColors(newColor);
            }}
            style={{
              width: '60px',
              height: '40px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setBackgroundColor(newColor);
              handleColorChange('backgroundColor', newColor);
              if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                addToRecentColors(newColor);
              }
            }}
            placeholder="#ffffff"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
          <button
            onClick={() => {
              setBackgroundColor('transparent');
              handleColorChange('backgroundColor', 'transparent');
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Transparente"
          >
            ∅
          </button>
        </div>
      </div>

      {/* ========== SEÇÃO: OPACIDADE ========== */}
      <div className="editor-group">
        <label>👁️ Opacidade</label>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="number"
            value={opacity}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            min="0"
            max="100"
            style={{
              width: '60px',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '12px'
            }}
          />
          <span style={{ fontSize: '11px', color: '#666' }}>%</span>
          <input
            type="range"
            value={opacity}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            min="0"
            max="100"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* ========== SEÇÃO: CORES RÁPIDAS ========== */}
      {recentColors.length > 0 && (
        <div className="editor-group">
          <label>🎨 Cores Recentes</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px'
          }}>
            {recentColors.slice(0, 6).map(color => (
              <button
                key={`recent-${color}`}
                onClick={() => {
                  setTextColor(color);
                  handleColorChange('color', color);
                }}
                style={{
                  width: '100%',
                  height: '24px',
                  backgroundColor: color,
                  border: textColor === color ? '2px solid #60a5fa' : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========== SEÇÃO: PALETA DE CORES ========== */}
      <div className="editor-group">
        <label>🎨 Paleta Material Design</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '3px'
        }}>
          {MATERIAL_COLORS.slice(0, 18).map((color, index) => (
            <button
              key={`color-${color}-${index}`}
              onClick={() => {
                setTextColor(color);
                handleColorChange('color', color);
                addToRecentColors(color);
              }}
              style={{
                width: '100%',
                height: '24px',
                backgroundColor: color,
                border: textColor === color ? '2px solid #60a5fa' : '1px solid #ddd',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'transform 0.1s'
              }}
              title={color}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          ))}
        </div>
      </div>

      {/* ========== DICAS ========== */}
      <div className="editor-group" style={{ marginBottom: '0' }}>
        <label>💡 Dicas</label>
        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.3' }}>
          <p style={{ margin: '0 0 4px 0' }}>
            📝 Tudo de tipografia em um único lugar!
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            🎨 Cores, tamanho, peso, alinhamento e espaçamento.
          </p>
          <p style={{ margin: 0 }}>
            ✨ Edite um elemento de texto inteiro sem trocar de abas.
          </p>
        </div>
      </div>
    </div>
  );
};
