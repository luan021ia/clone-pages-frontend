import React, { useState } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import '../../EditorTabs.css';

interface StyleTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const StyleTab: React.FC<StyleTabProps> = ({ element, onUpdate }) => {
  const [bgColor, setBgColor] = useState(element.styles.backgroundColor || '#ffffff');
  const [textColor, setTextColor] = useState(element.styles.color || '#000000');
  const [borderColor, setBorderColor] = useState(element.styles.borderColor || '#000000');
  const [borderRadius, setBorderRadius] = useState(parseInt(element.styles.borderRadius) || 0);
  const [borderWidth, setBorderWidth] = useState(parseInt(element.styles.borderWidth) || 0);
  const [padding, setPadding] = useState(parseInt(element.styles.padding) || 0);
  const [opacity, setOpacity] = useState(parseFloat(element.styles.opacity) || 1);

  const applyStyle = (property: string, value: string) => {
    onUpdate({
      xpath: element.xpath,
      property,
      value,
      type: 'style'
    });
  };

  return (
    <div className="editor-tab-content">
      {/* CORES */}
      <div className="editor-section">
        <h4 className="editor-section-title">🎨 Cores</h4>

        <div className="editor-field">
          <label className="editor-label">Cor de Fundo</label>
          <div className="color-picker-group">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                applyStyle('backgroundColor', e.target.value);
              }}
              className="editor-color-input"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="editor-input editor-input-small"
            />
          </div>
        </div>

        <div className="editor-field">
          <label className="editor-label">Cor do Texto</label>
          <div className="color-picker-group">
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                applyStyle('color', e.target.value);
              }}
              className="editor-color-input"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="editor-input editor-input-small"
            />
          </div>
        </div>

        <div className="editor-field">
          <label className="editor-label">Cor da Borda</label>
          <div className="color-picker-group">
            <input
              type="color"
              value={borderColor}
              onChange={(e) => {
                setBorderColor(e.target.value);
                applyStyle('borderColor', e.target.value);
              }}
              className="editor-color-input"
            />
            <input
              type="text"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="editor-input editor-input-small"
            />
          </div>
        </div>
      </div>

      {/* DIMENSÕES */}
      <div className="editor-section">
        <h4 className="editor-section-title">📏 Dimensões</h4>

        <div className="editor-field">
          <label className="editor-label">Padding (Espaçamento Interno)</label>
          <div className="slider-group">
            <input
              type="range"
              min="0"
              max="100"
              value={padding}
              onChange={(e) => {
                setPadding(parseInt(e.target.value));
                applyStyle('padding', `${e.target.value}px`);
              }}
              className="editor-slider"
            />
            <span className="slider-value">{padding}px</span>
          </div>
        </div>
      </div>

      {/* BORDAS */}
      <div className="editor-section">
        <h4 className="editor-section-title">🔲 Bordas</h4>

        <div className="editor-field">
          <label className="editor-label">Arredondamento</label>
          <div className="slider-group">
            <input
              type="range"
              min="0"
              max="50"
              value={borderRadius}
              onChange={(e) => {
                setBorderRadius(parseInt(e.target.value));
                applyStyle('borderRadius', `${e.target.value}px`);
              }}
              className="editor-slider"
            />
            <span className="slider-value">{borderRadius}px</span>
          </div>
        </div>

        <div className="editor-field">
          <label className="editor-label">Espessura da Borda</label>
          <div className="slider-group">
            <input
              type="range"
              min="0"
              max="10"
              value={borderWidth}
              onChange={(e) => {
                setBorderWidth(parseInt(e.target.value));
                applyStyle('borderWidth', `${e.target.value}px`);
                applyStyle('borderStyle', 'solid');
              }}
              className="editor-slider"
            />
            <span className="slider-value">{borderWidth}px</span>
          </div>
        </div>
      </div>

      {/* EFEITOS */}
      <div className="editor-section">
        <h4 className="editor-section-title">🌈 Efeitos</h4>

        <div className="editor-field">
          <label className="editor-label">Opacidade</label>
          <div className="slider-group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => {
                setOpacity(parseFloat(e.target.value));
                applyStyle('opacity', e.target.value);
              }}
              className="editor-slider"
            />
            <span className="slider-value">{(opacity * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="editor-field">
          <button
            className="editor-effect-btn"
            onClick={() => applyStyle('boxShadow', '0 4px 6px rgba(0,0,0,0.1)')}
          >
            ➕ Adicionar Sombra Suave
          </button>
          <button
            className="editor-effect-btn"
            onClick={() => applyStyle('boxShadow', '0 10px 25px rgba(0,0,0,0.2)')}
          >
            ➕ Adicionar Sombra Forte
          </button>
          <button
            className="editor-effect-btn"
            onClick={() => applyStyle('boxShadow', 'none')}
          >
            ➖ Remover Sombra
          </button>
        </div>
      </div>
    </div>
  );
};
