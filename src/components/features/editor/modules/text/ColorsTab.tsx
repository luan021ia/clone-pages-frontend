import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface ColorsTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

// ===== PALETAS DE CORES SÓLIDAS =====

// Paleta Material Design (expandida)
const MATERIAL_COLORS = [
  // Vermelhos
  '#F44336', '#E53935', '#C62828', '#D32F2F', '#E91E63', '#C2185B',
  // Roxos/Violetas
  '#9C27B0', '#7B1FA2', '#6A1B9A', '#673AB7', '#5E35B1', '#512DA8',
  // Azuis
  '#3F51B5', '#3949AB', '#303F9F', '#2196F3', '#1976D2', '#1565C0',
  '#03A9F4', '#0288D1', '#0277BD', '#00BCD4', '#0097A7', '#00838F',
  // Verdes
  '#009688', '#00796B', '#00695C', '#4CAF50', '#388E3C', '#2E7D32',
  '#8BC34A', '#689F38', '#558B2F', '#CDDC39', '#AFB42B', '#827717',
  // Amarelos/Laranjas
  '#FFEB3B', '#FBC02D', '#F9A825', '#FFC107', '#FFA000', '#FF6F00',
  '#FF9800', '#F57C00', '#E65100', '#FF5722', '#E64A19', '#D84315',
  // Neutros
  '#795548', '#6D4C41', '#5D4037', '#9E9E9E', '#757575', '#616161',
  '#607D8B', '#546E7A', '#455A64', '#000000', '#FFFFFF'
];

// Paleta Tailwind (expandida)
const TAILWIND_COLORS = [
  // Vermelhos/Rosas
  '#EF4444', '#DC2626', '#B91C1C', '#F87171', '#FCA5A5', '#FEE2E2',
  '#EC4899', '#DB2777', '#BE185D', '#F472B6', '#F9A8D4', '#FCE7F3',
  // Laranjas/Amarelos
  '#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FCD34D', '#FEF3C7',
  // Verdes
  '#10B981', '#059669', '#047857', '#34D399', '#6EE7B7', '#D1FAE5',
  // Azuis
  '#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA', '#93C5FD', '#DBEAFE',
  // Roxos/Violetas
  '#8B5CF6', '#7C3AED', '#6D28D9', '#A78BFA', '#C4B5FD', '#EDE9FE',
  // Neutros
  '#6B7280', '#4B5563', '#374151', '#111827', '#F3F4F6', '#FFFFFF'
];

// Paleta Pastel
const PASTEL_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4',
  '#FEC8D8', '#FFDFD3', '#D4A5A5', '#9A8C98', '#C9ADA7', '#F2CC8F',
  '#81B29A', '#E07A5F', '#3D405B', '#F4F1DE', '#EAEAEA', '#BCBABB',
  '#FFE4E1', '#FFF0F5', '#F0E68C', '#E6E6FA', '#DDA0DD', '#98FB98'
];

// Paleta Neon (CORES NEONS SÓLIDAS)
const NEON_COLORS = [
  // Verde Neon
  '#39FF14', '#00FF41', '#32CD32', '#00FF7F', '#00FF00',
  // Roxo/Violeta Neon
  '#BF00FF', '#A020F0', '#8A2BE2', '#9400D3', '#9932CC',
  // Rosa Neon
  '#FF10F0', '#FF1493', '#FF00FF', '#FF69B4', '#FF00CC',
  // Azul Neon
  '#1F51FF', '#00F5FF', '#00D9FF', '#00CED1', '#00BFFF',
  '#4169E1', '#0000FF',
  // Vermelho Neon
  '#FF073A', '#FF0055', '#FF0040', '#FF0000', '#FF1C00',
  // Ciano Neon
  '#00F5FF', '#00FFFF', '#00CED1', '#40E0D0', '#00E5FF',
  // Amarelo Neon
  '#FFFF00', '#FFD700', '#FFED00', '#FFEA00', '#FFF700',
  // Laranja Neon
  '#FF6600', '#FF4500', '#FF8C00', '#FF7F00', '#FFA500',
  // Magenta Neon
  '#FF00FF', '#FF00CC', '#FF1493', '#FF00AA', '#FF0066'
];

// ===== GRADIENTES ORGANIZADOS POR TIPO =====

// Gradientes Bicolor (2 cores)
const GRADIENTS_BICOLOR = [
  { name: 'Pôr do Sol', value: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%)' },
  { name: 'Oceano', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Floresta', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Fogo', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Dourado', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Noite', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { name: 'Cereja', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
  { name: 'Céu', value: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)' },
  { name: 'Terra', value: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  
  // Gradientes Bicolor Neon
  { name: 'Neon Verde-Azul', value: 'linear-gradient(135deg, #39FF14 0%, #00F5FF 100%)' },
  { name: 'Neon Roxo-Rosa', value: 'linear-gradient(135deg, #BF00FF 0%, #FF10F0 100%)' },
  { name: 'Neon Azul-Verde', value: 'linear-gradient(135deg, #1F51FF 0%, #00FF41 100%)' },
  { name: 'Neon Rosa-Vermelho', value: 'linear-gradient(135deg, #FF1493 0%, #FF073A 100%)' },
  { name: 'Neon Ciano-Roxo', value: 'linear-gradient(135deg, #00F5FF 0%, #BF00FF 100%)' },
  { name: 'Neon Verde-Roxo', value: 'linear-gradient(135deg, #39FF14 0%, #BF00FF 100%)' },
  { name: 'Neon Azul-Rosa', value: 'linear-gradient(135deg, #1F51FF 0%, #FF10F0 100%)' },
  { name: 'Neon Vermelho-Azul', value: 'linear-gradient(135deg, #FF073A 0%, #1F51FF 100%)' },
  { name: 'Neon Verde-Ciano', value: 'linear-gradient(135deg, #00FF41 0%, #00F5FF 100%)' },
  { name: 'Neon Roxo-Vermelho', value: 'linear-gradient(135deg, #BF00FF 0%, #FF073A 100%)' },
  { name: 'Neon Rosa-Azul', value: 'linear-gradient(135deg, #FF10F0 0%, #1F51FF 100%)' },
  { name: 'Neon Ciano-Verde', value: 'linear-gradient(135deg, #00F5FF 0%, #39FF14 100%)' },
  { name: 'Neon Amarelo-Roxo', value: 'linear-gradient(135deg, #FFFF00 0%, #BF00FF 100%)' },
  { name: 'Neon Magenta-Azul', value: 'linear-gradient(135deg, #FF00FF 0%, #1F51FF 100%)' },
  { name: 'Neon Laranja-Rosa', value: 'linear-gradient(135deg, #FF6600 0%, #FF10F0 100%)' },
];

// Gradientes Tricolor (3 cores)
const GRADIENTS_TRICOLOR = [
  { name: 'Pôr do Sol', value: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #93c5fd 100%)' },
  { name: 'Oceano', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)' },
  { name: 'Fogo', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fa709a 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #89f7fe 0%, #60a5fa 50%, #06b6d4 100%)' },
  { name: 'Floresta', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #30cfd0 100%)' },
  { name: 'Terra', value: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 50%, #F9D423 100%)' },
  { name: 'Céu', value: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 50%, #1e3c72 100%)' },
  { name: 'Noite Estrelada', value: 'linear-gradient(135deg, #30cfd0 0%, #1e40af 50%, #06b6d4 100%)' },
  { name: 'Cereja', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 50%, #f093fb 100%)' },
  { name: 'Dourado', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #f59e0b 100%)' },
  
  // Gradientes Tricolor Neon
  { name: 'Neon Arco-íris 1', value: 'linear-gradient(135deg, #39FF14 0%, #BF00FF 50%, #FF10F0 100%)' },
  { name: 'Neon Arco-íris 2', value: 'linear-gradient(135deg, #1F51FF 0%, #FF1493 50%, #FF073A 100%)' },
  { name: 'Neon Ciano-Rosa-Azul', value: 'linear-gradient(135deg, #00F5FF 0%, #FF10F0 50%, #1F51FF 100%)' },
  { name: 'Neon Verde-Roxo-Vermelho', value: 'linear-gradient(135deg, #39FF14 0%, #BF00FF 50%, #FF073A 100%)' },
  { name: 'Neon Azul-Verde-Rosa', value: 'linear-gradient(135deg, #1F51FF 0%, #00FF41 50%, #FF10F0 100%)' },
  { name: 'Neon Verde-Roxo-Rosa', value: 'linear-gradient(135deg, #00FF41 0%, #BF00FF 50%, #FF10F0 100%)' },
  { name: 'Neon Azul-Ciano-Verde', value: 'linear-gradient(135deg, #1F51FF 0%, #00F5FF 50%, #39FF14 100%)' },
  { name: 'Neon Roxo-Rosa-Vermelho', value: 'linear-gradient(135deg, #BF00FF 0%, #FF1493 50%, #FF073A 100%)' },
  { name: 'Neon Ciano-Azul-Roxo', value: 'linear-gradient(135deg, #00F5FF 0%, #1F51FF 50%, #BF00FF 100%)' },
  { name: 'Neon Verde-Azul-Rosa', value: 'linear-gradient(135deg, #39FF14 0%, #00F5FF 50%, #FF10F0 100%)' },
];

// Gradientes Multicolor (4+ cores)
const GRADIENTS_MULTICOLOR = [
  { name: 'Neon Completo', value: 'linear-gradient(135deg, #39FF14 0%, #BF00FF 25%, #FF10F0 50%, #1F51FF 75%, #FF073A 100%)' },
  { name: 'Arco-íris Neon', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 20%, #BF00FF 40%, #1F51FF 60%, #00FF41 80%, #39FF14 100%)' },
  { name: 'Neon Vibrante', value: 'linear-gradient(135deg, #39FF14 0%, #00F5FF 20%, #BF00FF 40%, #FF10F0 60%, #FF073A 80%, #1F51FF 100%)' },
  { name: 'Neon Ciano-Arco', value: 'linear-gradient(135deg, #00F5FF 0%, #39FF14 25%, #FF10F0 50%, #FF073A 75%, #1F51FF 100%)' },
  { name: 'Neon Fusão', value: 'linear-gradient(135deg, #BF00FF 0%, #1F51FF 25%, #00FF41 50%, #FF10F0 75%, #FF073A 100%)' },
  { name: 'Neon Explosão', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 16.66%, #BF00FF 33.33%, #1F51FF 50%, #00F5FF 66.66%, #39FF14 83.33%, #FF073A 100%)' },
  { name: 'Neon Arco Total', value: 'linear-gradient(135deg, #FF073A 0%, #FF6600 14.28%, #FFFF00 28.56%, #39FF14 42.84%, #00F5FF 57.12%, #1F51FF 71.4%, #BF00FF 85.68%, #FF10F0 100%)' },
  { name: 'Neon Spectrum', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 16.66%, #BF00FF 33.33%, #1F51FF 50%, #00F5FF 66.66%, #39FF14 83.33%, #FF073A 100%)' },
  { name: 'Neon Ultra', value: 'linear-gradient(135deg, #39FF14 0%, #00FF41 20%, #00F5FF 40%, #1F51FF 60%, #BF00FF 80%, #FF10F0 100%)' },
  { name: 'Neon Rainbow', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 20%, #BF00FF 40%, #1F51FF 60%, #00F5FF 80%, #39FF14 100%)' },
];


export const ColorsTab: React.FC<ColorsTabProps> = ({ element, onUpdate }) => {
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [borderColor, setBorderColor] = useState('#000000');
  const [opacity, setOpacity] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [activePalette, setActivePalette] = useState<'material' | 'tailwind' | 'pastel' | 'neon'>('material');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 🎯 REMOVIDO: gradientTarget - sistema agora detecta automaticamente

  // Função helper para detectar botões (usada em múltiplos lugares)
  const isButtonElement = () => {
    // 🎯 FIX: Adicionar null safety checks para evitar erros de undefined
    const tagName = element?.tagName?.toLowerCase() || '';
    const className = element?.className?.toLowerCase() || '';
    const role = element?.attributes?.role?.toLowerCase() || '';
    const type = element?.attributes?.type?.toLowerCase() || '';

    return tagName === 'button' ||
           role === 'button' ||
           type === 'button' ||
           className.includes('btn') ||
           className.includes('button') ||
           className.includes('elementor-button') ||
           className.includes('elementor-widget-container') ||
           (tagName === 'a' && (
             className.includes('elementor-button') ||
             className.includes('elementor-widget-container')
           ));
  };

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar (novo elemento selecionado)
  // Isso evita que os inputs percam foco ao digitar
  useEffect(() => {
    // 🛡️ Null safety check
    if (!element?.styles) {
      console.warn('⚠️ [ColorsTab] element.styles is undefined');
      return;
    }

    // Parse colors
    const parseColor = (color: string): string => {
      if (!color || color === 'transparent') return '#ffffff';
      if (color?.startsWith('#')) return color;
      if (color?.startsWith('rgb')) {
        // Convert rgb to hex (simplified)
        return '#000000';
      }
      return '#000000';
    };

    setTextColor(parseColor(element?.styles?.color as string || ''));
    setBackgroundColor(element?.styles?.backgroundColor === 'transparent' ? '#ffffff' : parseColor(element?.styles?.backgroundColor as string || ''));
    setBorderColor(parseColor(element?.styles?.borderColor as string || ''));
    setOpacity(parseFloat(element?.styles?.opacity as string || '1') * 100);
  }, [element.xpath]); // 🎯 Mudança crítica: apenas quando elemento mudar, não quando styles mudarem

  const handleColorChange = (property: string, value: string) => {
    // 🎯 DETECÇÃO INTELIGENTE: Aplicar cor automaticamente no local correto
    const isButton = isButtonElement();
    // 🎯 FIX: Adicionar null safety para tagName
    const tagName = element?.tagName?.toLowerCase() || '';
    const isTextElement = tagName.match(/^(h1|h2|h3|h4|h5|h6|p|span|a|strong|em|li|label|legend)$/);

    console.log('🎨 [handleColorChange] Detecção INTELIGENTE:', {
      property,
      value,
      tagName: element?.tagName,
      className: element?.className,
      isButton,
      isTextElement,
      autoTarget: isButton ? 'background' : isTextElement ? 'color' : 'background'
    });

    // 🎯 SOLUÇÃO DEFINITIVA: Aplicar APENAS a propriedade correta
    if (isButton) {
      // BOTÕES: aplicar no background
      console.log('✅ [handleColorChange] Botão - aplicando background');
      onUpdate({ xpath: element.xpath, property: 'background', value, type: 'style' });
    } else if (isTextElement) {
      // TEXTO: aplicar na cor do texto
      console.log('✅ [handleColorChange] Texto - aplicando color');
      onUpdate({ xpath: element.xpath, property: 'color', value, type: 'style' });
    } else {
      // CONTAINERS: aplicar no background
      console.log('✅ [handleColorChange] Container - aplicando background');
      onUpdate({ xpath: element.xpath, property: 'background', value, type: 'style' });
    }
  };

  const handleGradientChange = (gradient: string) => {
    // Usar função helper unificada para detectar botões
    const isButton = isButtonElement();

    // 🎯 FIX: Adicionar null safety para className
    const className = element?.className?.toLowerCase() || '';

    // Função específica para detectar botões Elementor (para debug)
    const isElementorButton = () => {
      const classList = className.split(' ');
      return classList.some(cls =>
        cls === 'elementor-button' ||
        cls.includes('elementor-button') ||
        cls === 'elementor-btn' ||
        cls.includes('elementor-btn')
      );
    };

    // 🎯 FIX: Adicionar null safety para tagName
    const tagNameLower = element?.tagName?.toLowerCase() || '';
    const textContent = element?.textContent || '';

    // Verificar se é um elemento de texto
    const isText = tagNameLower === 'p' ||
                   tagNameLower === 'span' ||
                   tagNameLower === 'h1' ||
                   tagNameLower === 'h2' ||
                   tagNameLower === 'h3' ||
                   tagNameLower === 'h4' ||
                   tagNameLower === 'h5' ||
                   tagNameLower === 'h6' ||
                   tagNameLower === 'strong' ||
                   tagNameLower === 'em' ||
                   tagNameLower === 'b' ||
                   tagNameLower === 'i' ||
                   tagNameLower === 'u' ||
                   tagNameLower === 'small' ||
                   tagNameLower === 'label' ||
                   tagNameLower === 'legend' ||
                   (textContent && textContent.trim().length > 0 &&
                    !isButton && !tagNameLower.match(/^(div|section|article|header|footer|main|nav|aside)$/));

    // 🎯 FIX: Adicionar null safety para styles
    const styles = element?.styles || {};

    // Debug para verificar detecção
    console.log('🎨 [handleGradientChange] Detecção INTELIGENTE de elemento:', {
      tagName: element?.tagName,
      className: element?.className,
      isButton: isButton,
      isText: isText,
      isElementorButton: isElementorButton(),
      autoDetect: isButton ? 'FUNDO' : isText ? 'TEXTO' : 'FUNDO (default)',
      elementStyles: {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        color: styles.color
      }
    });

    // 🎯 SOLUÇÃO DEFINITIVA: Aplicar APENAS background com gradiente
    console.log('🎨 [handleGradientChange] Aplicando gradiente:', {
      isButton,
      isText,
      gradient: gradient.substring(0, 50)
    });

    // TODOS OS TIPOS: aplicar apenas background com gradiente
    // O servidor já sabe lidar com isso corretamente
    onUpdate({ xpath: element.xpath, property: 'background', value: gradient, type: 'style' });
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

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const AdvancedColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    property: string;
  }> = ({ label, value, onChange, property }) => {
    const rgb = hexToRgb(value);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };

    return (
      <div className="editor-group">
        <label>{label}</label>

        {/* Visualização principal */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '6px',
            border: '2px solid rgba(96, 165, 250, 0.3)',
            backgroundColor: value,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {value === 'transparent' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)',
                backgroundSize: '12px 12px',
                backgroundPosition: '0 0, 6px 6px'
              }} />
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'center' }}>
            <input
              type="color"
              value={value === 'transparent' ? '#ffffff' : value}
              onChange={(e) => {
                const newColor = e.target.value;
                onChange(newColor);
                handleColorChange(property, newColor);
                addToRecentColors(newColor);
              }}
              style={{
                width: '50px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                cursor: 'pointer',
                flexShrink: 0
              }}
            />

            <input
              type="text"
              value={value}
              onChange={(e) => {
                const newColor = e.target.value;
                onChange(newColor);
                handleColorChange(property, newColor);
                if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                  addToRecentColors(newColor);
                }
              }}
              placeholder="#000000"
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontFamily: 'monospace',
                fontSize: '13px'
              }}
            />

            <button
              onClick={() => {
                onChange('transparent');
                handleColorChange(property, 'transparent');
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                flexShrink: 0
              }}
              title="Transparente"
            >
              ∅
            </button>
          </div>
        </div>

        {/* Controles HSL */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>HSL (Matiz, Saturação, Luminosidade)</div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '10px', color: '#666', minWidth: '50px' }}>Matiz: {hsl.h}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => {
                  const newHue = Number(e.target.value);
                  const newHex = `hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`;
                  // Converter HSL para Hex (simplificado)
                  const tempDiv = document.createElement('div');
                  tempDiv.style.color = newHex;
                  document.body.appendChild(tempDiv);
                  const computedColor = window.getComputedStyle(tempDiv).color;
                  document.body.removeChild(tempDiv);

                  if (computedColor && computedColor.startsWith('rgb')) {
                    const match = computedColor.match(/\d+/g);
                    if (match) {
                      const r = parseInt(match[0]);
                      const g = parseInt(match[1]);
                      const b = parseInt(match[2]);
                      const hex = '#' + [r, g, b].map(x => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                      }).join('');
                      onChange(hex);
                      handleColorChange(property, hex);
                      addToRecentColors(hex);
                    }
                  }
                }}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '10px', color: '#666', minWidth: '50px' }}>Sat: {hsl.s}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => {
                  const newSat = Number(e.target.value);
                  const newHex = `hsl(${hsl.h}, ${newSat}%, ${hsl.l}%)`;
                  const tempDiv = document.createElement('div');
                  tempDiv.style.color = newHex;
                  document.body.appendChild(tempDiv);
                  const computedColor = window.getComputedStyle(tempDiv).color;
                  document.body.removeChild(tempDiv);

                  if (computedColor && computedColor.startsWith('rgb')) {
                    const match = computedColor.match(/\d+/g);
                    if (match) {
                      const r = parseInt(match[0]);
                      const g = parseInt(match[1]);
                      const b = parseInt(match[2]);
                      const hex = '#' + [r, g, b].map(x => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                      }).join('');
                      onChange(hex);
                      handleColorChange(property, hex);
                      addToRecentColors(hex);
                    }
                  }
                }}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '10px', color: '#666', minWidth: '50px' }}>Lum: {hsl.l}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => {
                  const newLight = Number(e.target.value);
                  const newHex = `hsl(${hsl.h}, ${hsl.s}%, ${newLight}%)`;
                  const tempDiv = document.createElement('div');
                  tempDiv.style.color = newHex;
                  document.body.appendChild(tempDiv);
                  const computedColor = window.getComputedStyle(tempDiv).color;
                  document.body.removeChild(tempDiv);

                  if (computedColor && computedColor.startsWith('rgb')) {
                    const match = computedColor.match(/\d+/g);
                    if (match) {
                      const r = parseInt(match[0]);
                      const g = parseInt(match[1]);
                      const b = parseInt(match[2]);
                      const hex = '#' + [r, g, b].map(x => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                      }).join('');
                      onChange(hex);
                      handleColorChange(property, hex);
                      addToRecentColors(hex);
                    }
                  }
                }}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Paletas de cores */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Paletas de Cores</div>

          <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
            <button
              onClick={() => setActivePalette('material')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activePalette === 'material' 
                  ? '2px solid #60a5fa'
                  : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activePalette === 'material' 
                  ? '#60a5fa' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activePalette === 'material' 
                  ? '#ffffff' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activePalette === 'material' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activePalette !== 'material') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (activePalette !== 'material') {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
            >
              Material
            </button>
            <button
              onClick={() => setActivePalette('tailwind')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activePalette === 'tailwind' 
                  ? '2px solid #60a5fa'
                  : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activePalette === 'tailwind' 
                  ? '#60a5fa' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activePalette === 'tailwind' 
                  ? '#ffffff' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activePalette === 'tailwind' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activePalette !== 'tailwind') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (activePalette !== 'tailwind') {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
            >
              Tailwind
            </button>
            <button
              onClick={() => setActivePalette('pastel')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activePalette === 'pastel' 
                  ? '2px solid #60a5fa'
                  : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activePalette === 'pastel' 
                  ? '#60a5fa' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activePalette === 'pastel' 
                  ? '#ffffff' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activePalette === 'pastel' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activePalette !== 'pastel') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (activePalette !== 'pastel') {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
            >
              Pastel
            </button>
            <button
              onClick={() => setActivePalette('neon')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activePalette === 'neon' 
                  ? '2px solid #39FF14' 
                  : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activePalette === 'neon' 
                  ? 'rgba(57, 255, 20, 0.2)' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activePalette === 'neon' 
                  ? '#39FF14' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activePalette === 'neon' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activePalette !== 'neon') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
                  e.currentTarget.style.borderColor = '#39FF14';
                }
              }}
              onMouseLeave={(e) => {
                if (activePalette !== 'neon') {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.color = '#d1d5db';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
                  e.currentTarget.style.borderColor = '#39FF14';
                }
              }}
            >
              ⚡ Neon
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2px'
          }}>
            {(activePalette === 'material' ? MATERIAL_COLORS :
              activePalette === 'tailwind' ? TAILWIND_COLORS :
              activePalette === 'pastel' ? PASTEL_COLORS : NEON_COLORS).map(color => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  handleColorChange(property, color);
                  addToRecentColors(color);
                }}
                style={{
                  width: '100%',
                  height: '18px',
                  backgroundColor: color,
                  border: value === color ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '2px',
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

        {/* Cores recentes */}
        {recentColors.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
              Cores Recentes
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2px'
            }}>
              {recentColors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    handleColorChange(property, color);
                  }}
                  style={{
                    width: '100%',
                    height: '16px',
                    backgroundColor: color,
                    border: value === color ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="editor-tab-content">
      {/* Toggle para modo avançado */}
      <div className="editor-group" style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: showAdvanced
              ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)'
              : 'rgba(45, 52, 65, 0.8)',
            border: `1px solid ${showAdvanced ? 'rgba(96, 165, 250, 0.6)' : 'rgba(96, 165, 250, 0.2)'}`,
            borderRadius: '12px',
            color: showAdvanced ? '#e0e7ff' : '#9ca3af',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(5px)',
            boxShadow: showAdvanced
              ? '0 4px 16px rgba(96, 165, 250, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.3) inset'
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
            transform: showAdvanced ? 'translateY(-1px)' : 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = showAdvanced
              ? '0 8px 24px rgba(96, 165, 250, 0.5), 0 0 0 1px rgba(96, 165, 250, 0.4) inset'
              : '0 4px 12px rgba(96, 165, 250, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = showAdvanced ? 'translateY(-1px)' : 'translateY(0)';
            e.currentTarget.style.boxShadow = showAdvanced
              ? '0 4px 16px rgba(96, 165, 250, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.3) inset'
              : '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          {showAdvanced ? '🎨' : '🚀'} Modo {showAdvanced ? 'Simples' : 'Avançado'}
        </button>
      </div>

      {showAdvanced ? (
        // Modo Avançado com todos os recursos
        <>
          <AdvancedColorPicker
            label="Cor do Texto"
            value={textColor}
            onChange={setTextColor}
            property="color"
          />

          <AdvancedColorPicker
            label="Cor de Fundo"
            value={backgroundColor}
            onChange={setBackgroundColor}
            property="backgroundColor"
          />

          <AdvancedColorPicker
            label="Cor da Borda"
            value={borderColor}
            onChange={setBorderColor}
            property="borderColor"
          />
        </>
      ) : (
        // Modo Simplificado (o original melhorado)
        <>
          <div className="editor-group">
            <label>Cor do Texto</label>
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
                  border: '1px solid rgba(96, 165, 250, 0.3)',
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
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div className="editor-group">
            <label>Cor de Fundo</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setBackgroundColor(newColor);

                  // Lógica especial para botões - usar 'background' em vez de 'backgroundColor'
                  if (isButtonElement()) {
                    // Para botões, forçar aplicação com !important para sobrescrever CSS do Elementor
                    handleColorChange('background', newColor + ' !important');
                    handleColorChange('background-color', newColor + ' !important'); // Dupla garantia
                    handleColorChange('opacity', '1 !important');
                    handleColorChange('visibility', 'visible !important');
                    console.log('🎨 [ColorsTab] Aplicando cor sólida forçada no botão:', newColor);
                  } else {
                    handleColorChange('backgroundColor', newColor);
                  }
                  addToRecentColors(newColor);
                }}
                style={{
                  width: '60px',
                  height: '40px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setBackgroundColor(newColor);

                  // Lógica especial para botões - usar 'background' em vez de 'backgroundColor'
                  if (isButtonElement()) {
                    // Para botões, forçar aplicação com !important para sobrescrever CSS do Elementor
                    handleColorChange('background', newColor + ' !important');
                    handleColorChange('background-color', newColor + ' !important'); // Dupla garantia
                    handleColorChange('opacity', '1 !important');
                    handleColorChange('visibility', 'visible !important');
                    console.log('🎨 [ColorsTab] Aplicando cor sólida forçada no botão:', newColor);
                  } else {
                    handleColorChange('backgroundColor', newColor);
                  }
                  if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                    addToRecentColors(newColor);
                  }
                }}
                placeholder="#ffffff"
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  fontFamily: 'monospace',
                  fontSize: '14px'
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
                  border: '1px solid rgba(96, 165, 250, 0.3)',
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

          <div className="editor-group">
            <label>Cor da Borda</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setBorderColor(newColor);
                  handleColorChange('borderColor', newColor);
                  addToRecentColors(newColor);
                }}
                style={{
                  width: '60px',
                  height: '40px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setBorderColor(newColor);
                  handleColorChange('borderColor', newColor);
                  if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                    addToRecentColors(newColor);
                  }
                }}
                placeholder="#000000"
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Cores recentes primeiro no modo simples */}
          {recentColors.length > 0 && (
            <div className="editor-group">
              <label>Cores Recentes</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '3px'
              }}>
                {recentColors.slice(0, 12).map(color => (
                  <button
                    key={`recent-${color}`}
                    onClick={() => {
                      setTextColor(color);
                      handleColorChange('color', color);
                    }}
                    style={{
                      width: '100%',
                      height: '20px',
                      backgroundColor: color,
                      border: textColor === color ? '2px solid #60a5fa' : '1px solid #ddd',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cores rápidas no modo simples */}
          <div className="editor-group">
            <label>Cores Rápidas</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
              justifyItems: 'stretch'
            }}>
              {MATERIAL_COLORS.slice(0, 18).map((color, index) => (
                <button
                  key={`quick-${color}-${index}`}
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
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: color === '#FFFFFF' || color === '#FFEB3B' || color === '#FFFFBA' || color === '#FEE2E2' || color === '#FEF3C7' || color === '#D1FAE5' || color === '#DBEAFE' || color === '#EDE9FE' || color === '#FCE7F3' ? '#000' : '#fff',
                    fontWeight: 'bold'
                  }}
                  title={color}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Controles comuns para ambos os modos */}
      <div className="editor-group">
        <label>Opacidade</label>
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
          <div style={{
            width: '32px',
            height: '18px',
            borderRadius: '3px',
            border: '1px solid #ddd',
            backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`,
            backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)',
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 3px 3px',
            flexShrink: 0
          }} />
        </div>
      </div>

      {/* 🎯 INDICADOR INTELIGENTE - Mostra onde a cor será aplicada */}
      <div className="editor-group">
        <div style={{
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>
              Detecção Automática
            </span>
          </div>
          <p style={{
            fontSize: '11px',
            color: '#6ee7b7',
            margin: '0',
            lineHeight: '1.4'
          }}>
            {isButtonElement() ? (
              <>✅ <strong>Botão detectado</strong> - Cores aplicadas no fundo</>
            ) : (
              element.tagName.toLowerCase().match(/^(h1|h2|h3|h4|h5|h6|p|span|a|strong|em|li|label|legend)$/) ? (
                <>✅ <strong>Texto detectado</strong> - Cores aplicadas no texto</>
              ) : (
                <>✅ <strong>Container detectado</strong> - Cores aplicadas no fundo</>
              )
            )}
          </p>
        </div>
      </div>

      {/* Gradientes Profissionais - Organizados por Tipo */}
      <div className="editor-group">
        <label style={{ fontWeight: 'bold', marginBottom: '12px', display: 'block' }}>🌈 Gradientes Profissionais</label>
        
        {/* Gradientes Bicolor */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
            🎨 Bicolor (2 cores) - {GRADIENTS_BICOLOR.length} opções
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px'
          }}>
            {GRADIENTS_BICOLOR.map((gradient, index) => (
              <button
                key={index}
                onClick={() => handleGradientChange(gradient.value)}
                style={{
                  padding: '8px 6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  background: gradient.value,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {gradient.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gradientes Tricolor */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
            🌈 Tricolor (3 cores) - {GRADIENTS_TRICOLOR.length} opções
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px'
          }}>
            {GRADIENTS_TRICOLOR.map((gradient, index) => (
              <button
                key={index}
                onClick={() => handleGradientChange(gradient.value)}
                style={{
                  padding: '8px 6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  background: gradient.value,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {gradient.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gradientes Multicolor */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
            ✨ Multicolor (4+ cores) - {GRADIENTS_MULTICOLOR.length} opções
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px'
          }}>
            {GRADIENTS_MULTICOLOR.map((gradient, index) => (
              <button
                key={index}
                onClick={() => handleGradientChange(gradient.value)}
                style={{
                  padding: '8px 6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  background: gradient.value,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {gradient.name}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="editor-group" style={{ marginBottom: '0' }}>
        <label>💡 Dicas</label>
        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.3' }}>
          <p style={{ margin: '0 0 4px 0' }}>
            {showAdvanced
              ? '🎨 Use HSL para ajustar matiz, saturação e luminosidade.'
              : '🚀 Clique em "Modo Avançado" para HSL e mais paletas.'}
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            🎯 Cores usadas ficam salvas em "Cores Recentes".
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            🌈 Botões: Texto/Gradiente aplica gradiente no fundo com texto branco.
          </p>
          <p style={{ margin: 0 }}>
            ✨ Grid harmonioso: múltiplos de 6/12 para alinhamento perfeito.
          </p>
        </div>
      </div>
    </div>
  );
};
