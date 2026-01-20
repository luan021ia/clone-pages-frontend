import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface ShadowsTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const ShadowsTab: React.FC<ShadowsTabProps> = ({ element, onUpdate }) => {
  // Box Shadow
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(0);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(50);
  const [shadowInset, setShadowInset] = useState(false);

  // Text Shadow
  const [textShadowX, setTextShadowX] = useState(0);
  const [textShadowY, setTextShadowY] = useState(0);
  const [textShadowBlur, setTextShadowBlur] = useState(0);
  const [textShadowColor, setTextShadowColor] = useState('#000000');

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar (novo elemento selecionado)
  // Isso evita que os inputs percam foco ao digitar
  useEffect(() => {
    // Parse box-shadow (simplified)
    const boxShadow = element.styles.boxShadow || 'none';
    if (boxShadow !== 'none') {
      // Basic parsing - real implementation would be more robust
      const parts = boxShadow.split(' ');
      if (parts.length >= 4) {
        setShadowX(parseInt(parts[0]) || 0);
        setShadowY(parseInt(parts[1]) || 0);
        setShadowBlur(parseInt(parts[2]) || 0);
        setShadowSpread(parseInt(parts[3]) || 0);
      }
    }
  }, [element.xpath]); // 🎯 Mudança crítica: apenas quando elemento mudar, não quando styles mudarem

  const updateBoxShadow = () => {
    const rgba = `rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(shadowColor.slice(5, 7), 16)}, ${shadowOpacity / 100})`;
    const value = shadowX === 0 && shadowY === 0 && shadowBlur === 0 && shadowSpread === 0
      ? 'none'
      : `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgba}`;

    onUpdate({
      xpath: element.xpath,
      property: 'boxShadow',
      value,
      type: 'style'
    });
  };

  const updateTextShadow = () => {
    const value = textShadowX === 0 && textShadowY === 0 && textShadowBlur === 0
      ? 'none'
      : `${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor}`;

    onUpdate({
      xpath: element.xpath,
      property: 'textShadow',
      value,
      type: 'style'
    });
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'none':
        setShadowX(0);
        setShadowY(0);
        setShadowBlur(0);
        setShadowSpread(0);
        break;
      case 'soft':
        setShadowX(0);
        setShadowY(2);
        setShadowBlur(8);
        setShadowSpread(0);
        setShadowOpacity(20);
        break;
      case 'medium':
        setShadowX(0);
        setShadowY(4);
        setShadowBlur(12);
        setShadowSpread(0);
        setShadowOpacity(30);
        break;
      case 'strong':
        setShadowX(0);
        setShadowY(8);
        setShadowBlur(16);
        setShadowSpread(0);
        setShadowOpacity(40);
        break;
      case 'glow':
        setShadowX(0);
        setShadowY(0);
        setShadowBlur(20);
        setShadowSpread(5);
        setShadowColor('#60a5fa');
        setShadowOpacity(60);
        break;
    }
    setTimeout(updateBoxShadow, 0);
  };

  return (
    <div className="editor-tab-content">
      <div className="editor-group">
        <label>Presets de Sombra</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <button
            onClick={() => applyPreset('none')}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Nenhuma
          </button>
          <button
            onClick={() => applyPreset('soft')}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            Suave
          </button>
          <button
            onClick={() => applyPreset('medium')}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            Média
          </button>
          <button
            onClick={() => applyPreset('strong')}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
            }}
          >
            Forte
          </button>
          <button
            onClick={() => applyPreset('glow')}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              boxShadow: '0 0 20px rgba(96, 165, 250, 0.6)'
            }}
          >
            ✨ Glow
          </button>
        </div>
      </div>

      <div className="editor-group">
        <label>Sombra da Caixa (Box Shadow)</label>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Horizontal (X)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={shadowX}
              onChange={(e) => {
                setShadowX(Number(e.target.value));
                setTimeout(updateBoxShadow, 0);
              }}
              min="-100"
              max="100"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="range"
              value={shadowX}
              onChange={(e) => {
                setShadowX(Number(e.target.value));
                updateBoxShadow();
              }}
              min="-100"
              max="100"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Vertical (Y)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={shadowY}
              onChange={(e) => {
                setShadowY(Number(e.target.value));
                setTimeout(updateBoxShadow, 0);
              }}
              min="-100"
              max="100"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="range"
              value={shadowY}
              onChange={(e) => {
                setShadowY(Number(e.target.value));
                updateBoxShadow();
              }}
              min="-100"
              max="100"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Desfoque (Blur)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={shadowBlur}
              onChange={(e) => {
                setShadowBlur(Number(e.target.value));
                setTimeout(updateBoxShadow, 0);
              }}
              min="0"
              max="100"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="range"
              value={shadowBlur}
              onChange={(e) => {
                setShadowBlur(Number(e.target.value));
                updateBoxShadow();
              }}
              min="0"
              max="100"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Expansão (Spread)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={shadowSpread}
              onChange={(e) => {
                setShadowSpread(Number(e.target.value));
                setTimeout(updateBoxShadow, 0);
              }}
              min="-50"
              max="50"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="range"
              value={shadowSpread}
              onChange={(e) => {
                setShadowSpread(Number(e.target.value));
                updateBoxShadow();
              }}
              min="-50"
              max="50"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Cor da Sombra</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => {
                setShadowColor(e.target.value);
                setTimeout(updateBoxShadow, 0);
              }}
              style={{
                width: '60px',
                height: '40px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            />
            <input
              type="text"
              value={shadowColor}
              onChange={(e) => {
                setShadowColor(e.target.value);
                setTimeout(updateBoxShadow, 0);
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Opacidade</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={shadowOpacity}
              onChange={(e) => {
                setShadowOpacity(Number(e.target.value));
                setTimeout(updateBoxShadow, 0);
              }}
              min="0"
              max="100"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>%</span>
            <input
              type="range"
              value={shadowOpacity}
              onChange={(e) => {
                setShadowOpacity(Number(e.target.value));
                updateBoxShadow();
              }}
              min="0"
              max="100"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shadowInset}
              onChange={(e) => {
                setShadowInset(e.target.checked);
                setTimeout(updateBoxShadow, 0);
              }}
            />
            <span style={{ fontSize: '14px' }}>Sombra Interna (Inset)</span>
          </label>
        </div>
      </div>

      <div className="editor-group">
        <label>Sombra do Texto (Text Shadow)</label>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Horizontal (X)</label>
          <input
            type="number"
            value={textShadowX}
            onChange={(e) => {
              setTextShadowX(Number(e.target.value));
              setTimeout(updateTextShadow, 0);
            }}
            min="-50"
            max="50"
            style={{
              width: '100%',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Vertical (Y)</label>
          <input
            type="number"
            value={textShadowY}
            onChange={(e) => {
              setTextShadowY(Number(e.target.value));
              setTimeout(updateTextShadow, 0);
            }}
            min="-50"
            max="50"
            style={{
              width: '100%',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Desfoque (Blur)</label>
          <input
            type="number"
            value={textShadowBlur}
            onChange={(e) => {
              setTextShadowBlur(Number(e.target.value));
              setTimeout(updateTextShadow, 0);
            }}
            min="0"
            max="50"
            style={{
              width: '100%',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Cor</label>
          <input
            type="color"
            value={textShadowColor}
            onChange={(e) => {
              setTextShadowColor(e.target.value);
              setTimeout(updateTextShadow, 0);
            }}
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
};
