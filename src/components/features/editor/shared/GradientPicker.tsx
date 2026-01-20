import React, { useState } from 'react';
import {
  CLASSIC_GRADIENTS_BICOLOR,
  CLASSIC_GRADIENTS_TRICOLOR,
  CLASSIC_GRADIENTS_MULTICOLOR,
  NEON_GRADIENTS_BICOLOR,
  NEON_GRADIENTS_TRICOLOR,
  NEON_GRADIENTS_MULTICOLOR,
  PASTEL_GRADIENTS_BICOLOR,
  PASTEL_GRADIENTS_TRICOLOR,
  PASTEL_GRADIENTS_MULTICOLOR,
  type GradientPaletteType
} from '@/constants/color-palettes';

interface GradientPickerProps {
  /** Callback quando um gradiente é aplicado */
  onGradientApply: (gradient: string) => void;
  /** Callback para remover gradiente */
  onGradientRemove: () => void;
  /** Label do campo (opcional) */
  label?: string;
  /** Tipo de aplicação: text (com background-clip) ou container (fundo normal) */
  applyType: 'text' | 'container';
}

/**
 * 🌈 GRADIENT PICKER
 * Componente reutilizável para seleção de gradientes
 */
export const GradientPicker: React.FC<GradientPickerProps> = ({
  onGradientApply,
  onGradientRemove,
  label,
  applyType
}) => {
  const [activeGradientPalette, setActiveGradientPalette] = useState<GradientPaletteType>('classic');

  // ===== Palette Selector Button =====
  const PaletteButton = ({
    palette,
    buttonLabel,
    isNeon = false
  }: {
    palette: GradientPaletteType;
    buttonLabel: string;
    isNeon?: boolean;
  }) => {
    const isActive = activeGradientPalette === palette;

    return (
      <button
        onClick={() => setActiveGradientPalette(palette)}
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

  // ===== Gradient Grid Component =====
  const GradientGrid = ({
    gradients,
    categoryLabel
  }: {
    gradients: Array<{ name: string; value: string }>;
    categoryLabel: string;
  }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#a5b4fc',
        marginBottom: '8px',
        display: 'block'
      }}>
        {categoryLabel} - {gradients.length} opções
      </label>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px'
      }}>
        {gradients.map((gradient, index) => (
          <button
            key={index}
            onClick={() => onGradientApply(gradient.value)}
            style={{
              width: '100%',
              height: '20px',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              background: gradient.value,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title={gradient.name}
          />
        ))}
      </div>
    </div>
  );

  // Determinar gradientes ativos com base na paleta selecionada
  const bicolorGradients =
    activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_BICOLOR :
    activeGradientPalette === 'neon' ? NEON_GRADIENTS_BICOLOR :
    PASTEL_GRADIENTS_BICOLOR;

  const tricolorGradients =
    activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_TRICOLOR :
    activeGradientPalette === 'neon' ? NEON_GRADIENTS_TRICOLOR :
    PASTEL_GRADIENTS_TRICOLOR;

  const multicolorGradients =
    activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_MULTICOLOR :
    activeGradientPalette === 'neon' ? NEON_GRADIENTS_MULTICOLOR :
    PASTEL_GRADIENTS_MULTICOLOR;

  return (
    <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <label style={{ margin: 0, fontWeight: 'bold' }}>
          {label || `🌈 Gradientes${applyType === 'text' ? ' para Texto' : ''}`}
        </label>
        <button
          onClick={onGradientRemove}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            color: '#d32f2f',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
          title={`Remover gradiente${applyType === 'text' ? ' de texto' : ''}`}
        >
          ❌ Remover
        </button>
      </div>

      {/* Seletor de Paleta de Gradientes */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
        <PaletteButton palette="classic" buttonLabel="Clássicos" />
        <PaletteButton palette="neon" buttonLabel="⚡ Neon" isNeon />
        <PaletteButton palette="pastel" buttonLabel="Pastéis" />
      </div>

      {/* Gradientes Bicolor */}
      <GradientGrid gradients={bicolorGradients} categoryLabel="🎨 Bicolor (2 cores)" />

      {/* Gradientes Tricolor */}
      <GradientGrid gradients={tricolorGradients} categoryLabel="🌈 Tricolor (3 cores)" />

      {/* Gradientes Multicolor */}
      <GradientGrid gradients={multicolorGradients} categoryLabel="✨ Multicolor (4+ cores)" />
    </div>
  );
};
