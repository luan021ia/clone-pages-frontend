import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import { SolidColorPicker } from '@/components/features/editor/shared/SolidColorPicker';

interface BordersTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const BordersTab: React.FC<BordersTabProps> = ({ element, onUpdate }) => {
  // Border Width
  const [borderTopWidth, setBorderTopWidth] = useState(0);
  const [borderRightWidth, setBorderRightWidth] = useState(0);
  const [borderBottomWidth, setBorderBottomWidth] = useState(0);
  const [borderLeftWidth, setBorderLeftWidth] = useState(0);
  const [borderWidthLinked, setBorderWidthLinked] = useState(true);

  // Border Radius
  const [borderTopLeftRadius, setBorderTopLeftRadius] = useState(0);
  const [borderTopRightRadius, setBorderTopRightRadius] = useState(0);
  const [borderBottomRightRadius, setBorderBottomRightRadius] = useState(0);
  const [borderBottomLeftRadius, setBorderBottomLeftRadius] = useState(0);
  const [borderRadiusLinked, setBorderRadiusLinked] = useState(true);

  // Border Style
  const [borderStyle, setBorderStyle] = useState('solid');

  // Border Color
  const [borderColor, setBorderColor] = useState('#000000');

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar (novo elemento selecionado)
  // Isso evita que os inputs percam foco ao digitar
  useEffect(() => {
    // 🛡️ Null safety checks
    if (!element?.styles) {
      console.warn('⚠️ [BordersTab] element.styles is undefined');
      return;
    }

    // Parse border width
    const width = parseInt(element.styles?.borderWidth as string) || 0;
    setBorderTopWidth(width);
    setBorderRightWidth(width);
    setBorderBottomWidth(width);
    setBorderLeftWidth(width);

    // Parse border radius
    const radius = parseInt(element.styles?.borderRadius as string) || 0;
    setBorderTopLeftRadius(radius);
    setBorderTopRightRadius(radius);
    setBorderBottomRightRadius(radius);
    setBorderBottomLeftRadius(radius);

    setBorderStyle(element.styles?.borderStyle || 'solid');
    setBorderColor(element.styles?.borderColor || '#000000');
  }, [element.xpath]); // 🎯 Mudança crítica: apenas quando elemento mudar, não quando styles mudarem

  const updateBorderWidth = (top: number, right: number, bottom: number, left: number) => {
    onUpdate({
      xpath: element.xpath,
      property: 'borderWidth',
      value: `${top}px ${right}px ${bottom}px ${left}px`,
      type: 'style'
    });
  };

  const handleBorderWidthChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    if (borderWidthLinked) {
      setBorderTopWidth(value);
      setBorderRightWidth(value);
      setBorderBottomWidth(value);
      setBorderLeftWidth(value);
      updateBorderWidth(value, value, value, value);
    } else {
      switch (side) {
        case 'top':
          setBorderTopWidth(value);
          updateBorderWidth(value, borderRightWidth, borderBottomWidth, borderLeftWidth);
          break;
        case 'right':
          setBorderRightWidth(value);
          updateBorderWidth(borderTopWidth, value, borderBottomWidth, borderLeftWidth);
          break;
        case 'bottom':
          setBorderBottomWidth(value);
          updateBorderWidth(borderTopWidth, borderRightWidth, value, borderLeftWidth);
          break;
        case 'left':
          setBorderLeftWidth(value);
          updateBorderWidth(borderTopWidth, borderRightWidth, borderBottomWidth, value);
          break;
      }
    }
  };

  const updateBorderRadius = (topLeft: number, topRight: number, bottomRight: number, bottomLeft: number) => {
    onUpdate({
      xpath: element.xpath,
      property: 'borderRadius',
      value: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
      type: 'style'
    });
  };

  const handleBorderRadiusChange = (corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', value: number) => {
    if (borderRadiusLinked) {
      setBorderTopLeftRadius(value);
      setBorderTopRightRadius(value);
      setBorderBottomRightRadius(value);
      setBorderBottomLeftRadius(value);
      updateBorderRadius(value, value, value, value);
    } else {
      switch (corner) {
        case 'topLeft':
          setBorderTopLeftRadius(value);
          updateBorderRadius(value, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
          break;
        case 'topRight':
          setBorderTopRightRadius(value);
          updateBorderRadius(borderTopLeftRadius, value, borderBottomRightRadius, borderBottomLeftRadius);
          break;
        case 'bottomRight':
          setBorderBottomRightRadius(value);
          updateBorderRadius(borderTopLeftRadius, borderTopRightRadius, value, borderBottomLeftRadius);
          break;
        case 'bottomLeft':
          setBorderBottomLeftRadius(value);
          updateBorderRadius(borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, value);
          break;
      }
    }
  };

  const handleBorderColorChange = (value: string) => {
    setBorderColor(value);
    onUpdate({
      xpath: element.xpath,
      property: 'borderColor',
      value,
      type: 'style'
    });
  };

  return (
    <div className="editor-tab-content">
      {/* Border Width */}
      <div className="editor-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ margin: 0 }}>Largura da Borda</label>
          <button
            onClick={() => setBorderWidthLinked(!borderWidthLinked)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: borderWidthLinked ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: borderWidthLinked ? 'white' : '#f3f4f6',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title={borderWidthLinked ? 'Desvincular valores' : 'Vincular valores'}
          >
            {borderWidthLinked ? '🔗' : '🔓'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↑ Top</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={borderTopWidth}
                onChange={(e) => handleBorderWidthChange('top', Number(e.target.value))}
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
                minWidth: '35px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderTopWidth}px
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>→ Right</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={borderRightWidth}
                onChange={(e) => handleBorderWidthChange('right', Number(e.target.value))}
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
                minWidth: '35px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderRightWidth}px
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↓ Bottom</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={borderBottomWidth}
                onChange={(e) => handleBorderWidthChange('bottom', Number(e.target.value))}
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
                minWidth: '35px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderBottomWidth}px
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>← Left</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={borderLeftWidth}
                onChange={(e) => handleBorderWidthChange('left', Number(e.target.value))}
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
                minWidth: '35px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderLeftWidth}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Border Style */}
      <div className="editor-group">
        <label>Estilo da Borda</label>
        <select
          value={borderStyle}
          onChange={(e) => {
            setBorderStyle(e.target.value);
            onUpdate({
              xpath: element.xpath,
              property: 'borderStyle',
              value: e.target.value,
              type: 'style'
            });
          }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        >
          <option value="none">Nenhuma</option>
          <option value="solid">Sólida (―――)</option>
          <option value="dashed">Tracejada (- - -)</option>
          <option value="dotted">Pontilhada (· · ·)</option>
          <option value="double">Dupla (═══)</option>
          <option value="groove">Groove</option>
          <option value="ridge">Ridge</option>
          <option value="inset">Inset</option>
          <option value="outset">Outset</option>
        </select>
      </div>

      {/* Border Radius */}
      <div className="editor-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ margin: 0 }}>Arredondamento (Border Radius)</label>
          <button
            onClick={() => setBorderRadiusLinked(!borderRadiusLinked)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: borderRadiusLinked ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
              color: borderRadiusLinked ? 'white' : '#f3f4f6',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title={borderRadiusLinked ? 'Desvincular cantos' : 'Vincular cantos'}
          >
            {borderRadiusLinked ? '🔗' : '🔓'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↖ Top Left</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="500"
                value={borderTopLeftRadius}
                onChange={(e) => handleBorderRadiusChange('topLeft', Number(e.target.value))}
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
                minWidth: '40px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderTopLeftRadius}px
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↗ Top Right</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="500"
                value={borderTopRightRadius}
                onChange={(e) => handleBorderRadiusChange('topRight', Number(e.target.value))}
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
                minWidth: '40px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderTopRightRadius}px
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↙ Bottom Left</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="500"
                value={borderBottomLeftRadius}
                onChange={(e) => handleBorderRadiusChange('bottomLeft', Number(e.target.value))}
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
                minWidth: '40px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderBottomLeftRadius}px
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↘ Bottom Right</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="500"
                value={borderBottomRightRadius}
                onChange={(e) => handleBorderRadiusChange('bottomRight', Number(e.target.value))}
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
                minWidth: '40px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#e0e7ff',
                background: 'rgba(79, 70, 229, 0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(96, 165, 250, 0.4)'
              }}>
                {borderBottomRightRadius}px
              </span>
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            onClick={() => {
              setBorderTopLeftRadius(0);
              setBorderTopRightRadius(0);
              setBorderBottomRightRadius(0);
              setBorderBottomLeftRadius(0);
              updateBorderRadius(0, 0, 0, 0);
            }}
            style={{
              padding: '8px',
              borderRadius: '0px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#f3f4f6'
            }}
          >
            □ Quadrado
          </button>
          <button
            onClick={() => {
              setBorderTopLeftRadius(8);
              setBorderTopRightRadius(8);
              setBorderBottomRightRadius(8);
              setBorderBottomLeftRadius(8);
              updateBorderRadius(8, 8, 8, 8);
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#f3f4f6'
            }}
          >
            ▢ Suave
          </button>
          <button
            onClick={() => {
              setBorderTopLeftRadius(999);
              setBorderTopRightRadius(999);
              setBorderBottomRightRadius(999);
              setBorderBottomLeftRadius(999);
              updateBorderRadius(999, 999, 999, 999);
            }}
            style={{
              padding: '8px',
              borderRadius: '999px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#f3f4f6'
            }}
          >
            ● Círculo
          </button>
        </div>
      </div>

      {/* 🎨 SISTEMA COMPLETO DE CORES SÓLIDAS */}
      <SolidColorPicker
        property="borderColor"
        currentColor={borderColor}
        onColorChange={handleBorderColorChange}
        label="🎨 Cor da Borda"
      />
    </div>
  );
};
