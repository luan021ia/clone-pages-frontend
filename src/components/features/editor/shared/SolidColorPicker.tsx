import React, { useState } from 'react';
import {
  MATERIAL_COLORS,
  TAILWIND_COLORS,
  PASTEL_COLORS,
  NEON_COLORS,
  type PaletteType,
  type ColorProperty
} from '@/constants/color-palettes';

interface SolidColorPickerProps {
  /** Propriedade CSS a ser alterada (color, backgroundColor, borderColor) */
  property: ColorProperty;
  /** Valor atual da cor */
  currentColor: string;
  /** Callback quando a cor muda */
  onColorChange: (color: string) => void;
  /** Cor de fundo para calcular contraste (opcional) */
  contrastBackgroundColor?: string;
  /** Label do campo (opcional) */
  label?: string;
}

/**
 * 🎨 SOLID COLOR PICKER
 * Componente reutilizável para seleção de cores sólidas com paletas
 */
export const SolidColorPicker: React.FC<SolidColorPickerProps> = ({
  property,
  currentColor,
  onColorChange,
  contrastBackgroundColor,
  label
}) => {
  const [activePalette, setActivePalette] = useState<PaletteType>('material');

  // Determinar paleta atual
  const currentPalette =
    activePalette === 'material' ? MATERIAL_COLORS :
    activePalette === 'tailwind' ? TAILWIND_COLORS :
    activePalette === 'pastel' ? PASTEL_COLORS :
    NEON_COLORS;

  // ===== Helpers UX =====
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  };

  const luminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const toLinear = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const contrastRatio = (hexA: string, hexB: string): number => {
    const L1 = luminance(hexA);
    const L2 = luminance(hexB);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const clamp = (n: number, min = 0, max = 255) => Math.max(min, Math.min(max, n));

  const adjustHex = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const factor = percent / 100;
    const r = clamp(Math.round(rgb.r + (percent > 0 ? (255 - rgb.r) * factor : rgb.r * factor)));
    const g = clamp(Math.round(rgb.g + (percent > 0 ? (255 - rgb.g) * factor : rgb.g * factor)));
    const b = clamp(Math.round(rgb.b + (percent > 0 ? (255 - rgb.b) * factor : rgb.b * factor)));
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error);
    }
  };

  // ===== Palette Selector Button =====
  const PaletteButton = ({
    palette,
    isNeon = false
  }: {
    palette: PaletteType;
    isNeon?: boolean;
  }) => {
    const isActive = activePalette === palette;
    const buttonLabel =
      palette === 'material' ? 'Material' :
      palette === 'tailwind' ? 'Tailwind' :
      palette === 'pastel' ? 'Pastel' :
      '⚡ Neon';

    return (
      <button
        onClick={() => setActivePalette(palette)}
        style={{
          padding: '5px 8px',
          fontSize: '11px',
          borderRadius: '4px',
          border: isActive
            ? `2px solid ${isNeon ? '#39FF14' : '#60a5fa'}`
            : '1px solid rgba(96, 165, 250, 0.3)',
          backgroundColor: isActive
            ? (isNeon ? 'rgba(57, 255, 20, 0.2)' : '#60a5fa')
            : 'rgba(45, 52, 65, 0.8)',
          color: isActive
            ? (isNeon ? '#39FF14' : '#ffffff')
            : '#d1d5db',
          cursor: 'pointer',
          flex: 1,
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
            e.currentTarget.style.borderColor = '#818cf8';
            e.currentTarget.style.color = '#e0e7ff';
          } else if (isNeon) {
            e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
            e.currentTarget.style.borderColor = '#39FF14';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
            e.currentTarget.style.color = '#d1d5db';
          } else if (isNeon) {
            e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
            e.currentTarget.style.borderColor = '#39FF14';
          }
        }}
      >
        {buttonLabel}
      </button>
    );
  };

  return (
    <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
      <label>{label || '🎨 Cor'}</label>

      {/* Color Picker + Input + Controls */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          style={{
            width: '60px',
            height: '40px',
            borderRadius: '6px',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            cursor: 'pointer'
          }}
        />
        <input
          type="text"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#f3f4f6'
          }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onColorChange(adjustHex(currentColor, 15))}
            title="Clarear 15%"
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              background: 'rgba(31, 41, 55, 0.9)',
              cursor: 'pointer',
              color: '#e5e7eb'
            }}
          >＋</button>
          <button
            onClick={() => onColorChange(adjustHex(currentColor, -15))}
            title="Escurecer 15%"
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              background: 'rgba(31, 41, 55, 0.9)',
              cursor: 'pointer',
              color: '#e5e7eb'
            }}
          >－</button>
          <button
            onClick={() => copyToClipboard(currentColor)}
            title="Copiar HEX"
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              background: 'rgba(31, 41, 55, 0.9)',
              cursor: 'pointer',
              color: '#e5e7eb'
            }}
          >📋</button>
        </div>
      </div>

      {/* Indicador de contraste AA/AAA (apenas se fornecido backgroundColor) */}
      {property === 'color' && contrastBackgroundColor && contrastBackgroundColor.startsWith('#') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '28px',
            height: '18px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            background: currentColor
          }} />
          <span style={{ fontSize: '11px', color: '#666' }}>
            Contraste: {contrastRatio(currentColor, contrastBackgroundColor).toFixed(2)}
            {(() => {
              const c = contrastRatio(currentColor, contrastBackgroundColor);
              if (c >= 7) return ' • AAA';
              if (c >= 4.5) return ' • AA';
              return ' • baixo';
            })()}
          </span>
        </div>
      )}

      {/* Seletor de Paleta */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
        <PaletteButton palette="material" />
        <PaletteButton palette="tailwind" />
        <PaletteButton palette="pastel" />
        <PaletteButton palette="neon" isNeon />
      </div>

      {/* Grid de Cores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '4px'
      }}>
        {currentPalette.map((color, index) => (
          <button
            key={`${property}-${color}-${index}`}
            onClick={() => onColorChange(color)}
            style={{
              width: '100%',
              height: '24px',
              backgroundColor: color,
              border: currentColor === color
                ? '2px solid #60a5fa'
                : '1px solid rgba(96, 165, 250, 0.3)',
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
  );
};
