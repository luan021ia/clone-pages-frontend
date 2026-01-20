import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import { detectElementType } from '../detectElementType';

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

// ===== PALETAS DE GRADIENTES ORGANIZADAS =====

// ===== PALETA: CLÁSSICOS (Gradientes Profissionais Tradicionais) =====
const CLASSIC_GRADIENTS_BICOLOR = [
  { name: 'Noite & Neve', value: 'linear-gradient(135deg, #0D0D0D 0%, #FFFFFF 100%)' },
  { name: 'Azul & Amarelo', value: 'linear-gradient(135deg, #1E3A8A 0%, #F59E0B 100%)' },
  { name: 'Roxo & Laranja', value: 'linear-gradient(135deg, #6D28D9 0%, #FB923C 100%)' },
  { name: 'Verde & Magenta', value: 'linear-gradient(135deg, #10B981 0%, #DB2777 100%)' },
  { name: 'Teal & Vermelho', value: 'linear-gradient(135deg, #14B8A6 0%, #DC2626 100%)' },
  { name: 'Céu & Carvão', value: 'linear-gradient(135deg, #60A5FA 0%, #111827 100%)' },
  { name: 'Lime & Roxo', value: 'linear-gradient(135deg, #84CC16 0%, #7C3AED 100%)' },
  { name: 'Turquesa & Preto', value: 'linear-gradient(135deg, #06B6D4 0%, #000000 100%)' },
  { name: 'Coral & Azul', value: 'linear-gradient(135deg, #F97316 0%, #2563EB 100%)' },
  { name: 'Amarelo & Vinho', value: 'linear-gradient(135deg, #FACC15 0%, #7F1D1D 100%)' },
  { name: 'Branco & Azul Escuro', value: 'linear-gradient(135deg, #FFFFFF 0%, #1F2937 100%)' },
  { name: 'Cinza & Rosa', value: 'linear-gradient(135deg, #374151 0%, #EC4899 100%)' },
  { name: 'Azul & Branco', value: 'linear-gradient(135deg, #0EA5E9 0%, #FFFFFF 100%)' },
  { name: 'Verde & Preto', value: 'linear-gradient(135deg, #22C55E 0%, #000000 100%)' },
  { name: 'Laranja & Roxo Escuro', value: 'linear-gradient(135deg, #FB923C 0%, #312E81 100%)' },
  { name: 'Ciano & Roxo', value: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)' },
  { name: 'Vermelho & Branco', value: 'linear-gradient(135deg, #EF4444 0%, #FFFFFF 100%)' },
  { name: 'Amarelo & Azul Marinho', value: 'linear-gradient(135deg, #F59E0B 0%, #1F2937 100%)' },
  { name: 'Magenta & Azul', value: 'linear-gradient(135deg, #DB2777 0%, #3B82F6 100%)' },
  { name: 'Preto & Dourado', value: 'linear-gradient(135deg, #0D0D0D 0%, #FACC15 100%)' },
];

const CLASSIC_GRADIENTS_TRICOLOR = [
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
];

const CLASSIC_GRADIENTS_MULTICOLOR = [
  { name: 'Arco-íris Clássico', value: 'linear-gradient(135deg, #FF073A 0%, #FF8C00 20%, #FFD700 40%, #32CD32 60%, #1E90FF 80%, #9932CC 100%)' },
  { name: 'Oceano Profundo', value: 'linear-gradient(135deg, #001f3f 0%, #0074d9 25%, #7fdbff 50%, #39cccc 75%, #2ecc40 100%)' },
  { name: 'Pôr do Sol Completo', value: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 20%, #ffa94d 40%, #ffd93d 60%, #feca57 80%, #ff9ff3 100%)' },
];

// ===== PALETA: NEON (Gradientes Neon) =====
const NEON_GRADIENTS_BICOLOR = [
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

const NEON_GRADIENTS_TRICOLOR = [
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

const NEON_GRADIENTS_MULTICOLOR = [
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

// ===== PALETA: PASTÉIS (Gradientes Suaves) =====
const PASTEL_GRADIENTS_BICOLOR = [
  { name: 'Rosa & Azul Pastel', value: 'linear-gradient(135deg, #FFB3BA 0%, #BAE1FF 100%)' },
  { name: 'Lavanda & Pêssego', value: 'linear-gradient(135deg, #E0BBE4 0%, #FFDFBA 100%)' },
  { name: 'Menta & Céu', value: 'linear-gradient(135deg, #BAFFC9 0%, #BAE1FF 100%)' },
  { name: 'Pêssego & Amarelo', value: 'linear-gradient(135deg, #FFDFBA 0%, #FFFFBA 100%)' },
  { name: 'Rosa & Roxo', value: 'linear-gradient(135deg, #FEC8D8 0%, #DDA0DD 100%)' },
  { name: 'Céu & Verde', value: 'linear-gradient(135deg, #BAE1FF 0%, #BAFFC9 100%)' },
  { name: 'Coral & Pêssego', value: 'linear-gradient(135deg, #FFE4E1 0%, #FFDFBA 100%)' },
  { name: 'Lavanda & Azul', value: 'linear-gradient(135deg, #E0BBE4 0%, #BAE1FF 100%)' },
  { name: 'Verde & Amarelo Pastel', value: 'linear-gradient(135deg, #BAFFC9 0%, #FFFFBA 100%)' },
  { name: 'Rosa & Amarelo', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFFFBA 100%)' },
];

const PASTEL_GRADIENTS_TRICOLOR = [
  { name: 'Arco-íris Pastel', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFFFBA 50%, #BAFFC9 100%)' },
  { name: 'Céu Pastel', value: 'linear-gradient(135deg, #BAE1FF 0%, #E0BBE4 50%, #FEC8D8 100%)' },
  { name: 'Primavera Pastel', value: 'linear-gradient(135deg, #BAFFC9 0%, #FFFFBA 50%, #FFDFBA 100%)' },
  { name: 'Lavanda Doce', value: 'linear-gradient(135deg, #E0BBE4 0%, #DDA0DD 50%, #FEC8D8 100%)' },
  { name: 'Oceano Pastel', value: 'linear-gradient(135deg, #BAE1FF 0%, #BAFFC9 50%, #FFFFBA 100%)' },
];

const PASTEL_GRADIENTS_MULTICOLOR = [
  { name: 'Pastel Completo', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 20%, #FFFFBA 40%, #BAFFC9 60%, #BAE1FF 80%, #E0BBE4 100%)' },
  { name: 'Suave Arco-íris', value: 'linear-gradient(135deg, #FFE4E1 0%, #FFF0F5 25%, #F0E68C 50%, #E6E6FA 75%, #DDA0DD 100%)' },
];

// ===== COMPATIBILIDADE: Arrays combinados (mantidos para não quebrar código existente) =====
// const GRADIENTS_BICOLOR = [...CLASSIC_GRADIENTS_BICOLOR, ...NEON_GRADIENTS_BICOLOR];
// const GRADIENTS_TRICOLOR = [...CLASSIC_GRADIENTS_TRICOLOR, ...NEON_GRADIENTS_TRICOLOR];
// const GRADIENTS_MULTICOLOR = [...CLASSIC_GRADIENTS_MULTICOLOR, ...NEON_GRADIENTS_MULTICOLOR];
// const PROFESSIONAL_GRADIENTS = [...GRADIENTS_BICOLOR, ...GRADIENTS_TRICOLOR, ...GRADIENTS_MULTICOLOR];

export const ColorsTab: React.FC<ColorsTabProps> = ({ element, onUpdate }) => {
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [borderColor, setBorderColor] = useState('#000000');
  const [opacity, setOpacity] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [activePalette, setActivePalette] = useState<'material' | 'tailwind' | 'pastel' | 'neon'>('material');
  const [activeGradientPalette, setActiveGradientPalette] = useState<'classic' | 'neon' | 'pastel'>('classic');

  // Detectar tipo de elemento para saber qual seção mostrar
  const elementType = detectElementType(element);
  const isText = elementType === 'text';
  const isContainer = elementType === 'container';
  // 🎯 FIX: Adicionar null safety checks
  const isButton = (element?.tagName?.toLowerCase() === 'button') || (element?.className?.toLowerCase()?.includes('btn') || false);

  // Carregar cores recentes do localStorage
  useEffect(() => {
    const savedColors = localStorage.getItem('cp-recent-colors');
    if (savedColors) {
      try {
        setRecentColors(JSON.parse(savedColors).slice(0, 6));
      } catch (e) {
        console.error('Erro ao carregar cores recentes:', e);
      }
    }
  }, []);

  useEffect(() => {
    const parseColor = (color: string): string => {
      if (!color || color === 'transparent') return '#ffffff';
      if (color.startsWith('#')) return color;
      return '#000000';
    };

    // 🎯 FIX: Adicionar null safety checks para element.styles
    const styles = element?.styles || {};
    setTextColor(parseColor(styles.color || ''));
    setBackgroundColor(styles.backgroundColor === 'transparent' ? '#ffffff' : parseColor(styles.backgroundColor || ''));
    setBorderColor(parseColor(styles.borderColor || ''));
    setOpacity(parseFloat(styles.opacity || '1') * 100);
  }, [element.xpath]);

  // ===== Helpers UX Seletor de Cores =====
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
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  // Função para aplicar gradiente em texto
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

    addToRecentColors(gradient);
  };

  // Função para aplicar gradiente em container/button
  const applyContainerGradient = (gradient: string) => {
    onUpdate({
      xpath: element.xpath,
      property: 'background',
      value: gradient,
      type: 'style'
    });

    // Para botões: garantir que o texto seja branco para bom contraste com gradiente
    if (isButton) {
      setTimeout(() => {
        onUpdate({
          xpath: element.xpath,
          property: 'color',
          value: '#ffffff',
          type: 'style'
        });
      }, 50);
    }

    addToRecentColors(gradient);
  };

  // Função para remover gradiente e voltar ao transparente
  const removeGradient = () => {
    onUpdate({
      xpath: element.xpath,
      property: 'background',
      value: 'transparent',
      type: 'style'
    });

    // Se for botão, remover o override de cor branca
    if (isButton) {
      setTimeout(() => {
        onUpdate({
          xpath: element.xpath,
          property: 'color',
          value: 'inherit',
          type: 'style'
        });
      }, 50);
    }
  };

  // Função para remover gradiente de texto
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

  const handleColorChange = (property: string, value: string) => {
    if (property === 'color') {
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
    } else if (property === 'backgroundColor') {
      setBackgroundColor(value);

      // 🎯 FIX: Limpar gradiente de FUNDO automaticamente ao aplicar cor sólida
      // Se o elemento tem um gradiente em 'background', remover antes de aplicar cor sólida
      onUpdate({
        xpath: element.xpath,
        property: 'background',
        value: 'none',
        type: 'style'
      });
    } else if (property === 'borderColor') {
      setBorderColor(value);
    }

    onUpdate({
      xpath: element.xpath,
      property,
      value,
      type: 'style'
    });

    addToRecentColors(value);
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
    // Não adicionar gradientes muito longos nem duplicatas
    if (color.length > 100 || recentColors.includes(color)) return;

    const updated = [color, ...recentColors].slice(0, 6);
    setRecentColors(updated);

    // Salvar no localStorage
    localStorage.setItem('cp-recent-colors', JSON.stringify(updated));
  };

  const ColorPalette = ({ property = 'color' }: { property?: 'color' | 'backgroundColor' | 'borderColor' }) => {
    const currentColor = property === 'color' ? textColor : property === 'backgroundColor' ? backgroundColor : borderColor;
    const currentPalette = activePalette === 'material' ? MATERIAL_COLORS :
      activePalette === 'tailwind' ? TAILWIND_COLORS :
      activePalette === 'pastel' ? PASTEL_COLORS : NEON_COLORS;

    return (
      <div>
        {/* Seletor de Paleta */}
        <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
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
                e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.2)';
                e.currentTarget.style.borderColor = '#60a5fa';
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
                e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.2)';
                e.currentTarget.style.borderColor = '#60a5fa';
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
                e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.2)';
                e.currentTarget.style.borderColor = '#60a5fa';
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
                e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.2)';
                e.currentTarget.style.borderColor = '#60a5fa';
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
        
        {/* Grid de Cores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '4px'
        }}>
          {currentPalette.map((color, index) => (
            <button
              key={`${property}-${color}-${index}`}
              onClick={() => handleColorChange(property, color)}
              style={{
                width: '100%',
                height: '24px',
                backgroundColor: color,
                border: currentColor === color ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
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

  return (
    <div className="editor-tab-content">
      {/* SEÇÃO: COR DO TEXTO (para elementos texto) */}
      {isText && (
        <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
          <label>📝 Cor do Texto</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange('color', e.target.value)}
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
              value={textColor}
              onChange={(e) => handleColorChange('color', e.target.value)}
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
                onClick={() => handleColorChange('color', adjustHex(textColor, 15))}
                title="Clarear 15%"
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(96, 165, 250, 0.5)', background: 'rgba(31, 41, 55, 0.9)', cursor: 'pointer', color: '#e5e7eb' }}
              >＋</button>
              <button
                onClick={() => handleColorChange('color', adjustHex(textColor, -15))}
                title="Escurecer 15%"
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(96, 165, 250, 0.5)', background: 'rgba(31, 41, 55, 0.9)', cursor: 'pointer', color: '#e5e7eb' }}
              >－</button>
              <button
                onClick={() => copyToClipboard(textColor)}
                title="Copiar HEX"
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(96, 165, 250, 0.5)', background: 'rgba(31, 41, 55, 0.9)', cursor: 'pointer', color: '#e5e7eb' }}
              >📋</button>
            </div>
          </div>
          {/* Indicador de contraste AA/AAA */}
          {backgroundColor && backgroundColor.startsWith('#') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '18px', borderRadius: '4px', border: '1px solid rgba(96, 165, 250, 0.5)', background: textColor }} />
              <span style={{ fontSize: '11px', color: '#666' }}>
                Contraste: {contrastRatio(textColor, backgroundColor).toFixed(2)}
                {(() => {
                  const c = contrastRatio(textColor, backgroundColor);
                  if (c >= 7) return ' • AAA';
                  if (c >= 4.5) return ' • AA';
                  return ' • baixo';
                })()}
              </span>
            </div>
          )}
          <ColorPalette />
        </div>
      )}

      {/* SEÇÃO: GRADIENTES PARA TEXTO (mesma organização de subseções do container) */}
      {isText && (
        <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ margin: 0, fontWeight: 'bold' }}>🌈 Gradientes para Texto</label>
            <button
              onClick={removeTextGradient}
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
              title="Remover gradiente de texto"
            >
              ❌ Remover
            </button>
          </div>

          {/* Seletor de Paleta de Gradientes (compartilha o mesmo padrão do container) */}
          <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
            <button
              onClick={() => setActiveGradientPalette('classic')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activeGradientPalette === 'classic' 
                ? '2px solid #60a5fa'
                : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activeGradientPalette === 'classic' 
                  ? '#60a5fa' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activeGradientPalette === 'classic' 
                  ? '#ffffff' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activeGradientPalette === 'classic' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeGradientPalette !== 'classic') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeGradientPalette !== 'classic') {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
            >
              Clássicos
            </button>
            <button
              onClick={() => setActiveGradientPalette('neon')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activeGradientPalette === 'neon' 
                  ? '2px solid #39FF14' 
                  : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activeGradientPalette === 'neon' 
                  ? 'rgba(57, 255, 20, 0.2)' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activeGradientPalette === 'neon' 
                  ? '#39FF14' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activeGradientPalette === 'neon' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeGradientPalette !== 'neon') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
                  e.currentTarget.style.borderColor = '#39FF14';
                }
              }}
              onMouseLeave={(e) => {
                if (activeGradientPalette !== 'neon') {
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
            <button
              onClick={() => setActiveGradientPalette('pastel')}
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                border: activeGradientPalette === 'pastel' 
                ? '2px solid #60a5fa'
                : '1px solid rgba(96, 165, 250, 0.3)',
                backgroundColor: activeGradientPalette === 'pastel' 
                  ? '#60a5fa' 
                  : 'rgba(45, 52, 65, 0.8)',
                color: activeGradientPalette === 'pastel' 
                  ? '#ffffff' 
                  : '#d1d5db',
                cursor: 'pointer',
                flex: 1,
                fontWeight: activeGradientPalette === 'pastel' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeGradientPalette !== 'pastel') {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.borderColor = '#818cf8';
                  e.currentTarget.style.color = '#e0e7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeGradientPalette !== 'pastel') {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
            >
              Pastéis
            </button>
          </div>

          {/* Gradientes Bicolor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
              🎨 Bicolor (2 cores) - {activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_BICOLOR.length : activeGradientPalette === 'neon' ? NEON_GRADIENTS_BICOLOR.length : PASTEL_GRADIENTS_BICOLOR.length} opções
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px'
            }}>
              {(activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_BICOLOR : 
                activeGradientPalette === 'neon' ? NEON_GRADIENTS_BICOLOR : PASTEL_GRADIENTS_BICOLOR).map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => applyTextGradient(gradient.value)}
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

          {/* Gradientes Tricolor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
              🌈 Tricolor (3 cores) - {activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_TRICOLOR.length : activeGradientPalette === 'neon' ? NEON_GRADIENTS_TRICOLOR.length : PASTEL_GRADIENTS_TRICOLOR.length} opções
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px'
            }}>
              {(activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_TRICOLOR : 
                activeGradientPalette === 'neon' ? NEON_GRADIENTS_TRICOLOR : PASTEL_GRADIENTS_TRICOLOR).map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => applyTextGradient(gradient.value)}
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

          {/* Gradientes Multicolor */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
              ✨ Multicolor (4+ cores) - {activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_MULTICOLOR.length : activeGradientPalette === 'neon' ? NEON_GRADIENTS_MULTICOLOR.length : PASTEL_GRADIENTS_MULTICOLOR.length} opções
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px'
            }}>
              {(activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_MULTICOLOR : 
                activeGradientPalette === 'neon' ? NEON_GRADIENTS_MULTICOLOR : PASTEL_GRADIENTS_MULTICOLOR).map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => applyTextGradient(gradient.value)}
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
        </div>
      )}

      {/* SEÇÃO: COR DE FUNDO (para containers) */}
      {isContainer && (
        <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
          <label>🎨 Cor de Fundo</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="color"
              value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
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
              value={backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              placeholder="#ffffff"
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
                onClick={() => handleColorChange('backgroundColor', adjustHex(backgroundColor === 'transparent' ? '#ffffff' : backgroundColor, 15))}
                title="Clarear 15%"
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(96, 165, 250, 0.5)', background: 'rgba(31, 41, 55, 0.9)', cursor: 'pointer', color: '#e5e7eb' }}
              >＋</button>
              <button
                onClick={() => handleColorChange('backgroundColor', adjustHex(backgroundColor === 'transparent' ? '#ffffff' : backgroundColor, -15))}
                title="Escurecer 15%"
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(96, 165, 250, 0.5)', background: 'rgba(31, 41, 55, 0.9)', cursor: 'pointer', color: '#e5e7eb' }}
              >－</button>
              <button
                onClick={() => copyToClipboard(backgroundColor)}
                title="Copiar HEX"
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(96, 165, 250, 0.5)', background: 'rgba(31, 41, 55, 0.9)', cursor: 'pointer', color: '#e5e7eb' }}
              >📋</button>
            </div>
            <button
              onClick={() => handleColorChange('backgroundColor', 'transparent')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(96, 165, 250, 0.5)',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#f3f4f6'
              }}
              title="Transparente"
            >
              ∅
            </button>
          </div>
          <ColorPalette />
        </div>
      )}

      {/* SEÇÃO: GRADIENTES PARA CONTAINER/BOTÃO - ORGANIZADOS POR TIPO */}
      {isContainer && (
        <>
          <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ margin: 0, fontWeight: 'bold' }}>🌈 Gradientes para {isButton ? 'Botão' : 'Container'}</label>
              <button
                onClick={removeGradient}
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
                title="Remover gradiente"
              >
                ❌ Remover
              </button>
            </div>

            {/* Seletor de Paleta de Gradientes */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
              <button
                onClick={() => setActiveGradientPalette('classic')}
                style={{
                  padding: '5px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: activeGradientPalette === 'classic' 
                ? '2px solid #60a5fa'
                : '1px solid rgba(96, 165, 250, 0.3)',
                  backgroundColor: activeGradientPalette === 'classic' 
                    ? '#60a5fa' 
                    : 'rgba(45, 52, 65, 0.8)',
                  color: activeGradientPalette === 'classic' 
                    ? '#ffffff' 
                    : '#d1d5db',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: activeGradientPalette === 'classic' ? 600 : 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeGradientPalette !== 'classic') {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                    e.currentTarget.style.borderColor = '#818cf8';
                    e.currentTarget.style.color = '#e0e7ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeGradientPalette !== 'classic') {
                    e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                Clássicos
              </button>
              <button
                onClick={() => setActiveGradientPalette('neon')}
                style={{
                  padding: '5px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: activeGradientPalette === 'neon' 
                    ? '2px solid #39FF14' 
                    : '1px solid rgba(96, 165, 250, 0.3)',
                  backgroundColor: activeGradientPalette === 'neon' 
                    ? 'rgba(57, 255, 20, 0.2)' 
                    : 'rgba(45, 52, 65, 0.8)',
                  color: activeGradientPalette === 'neon' 
                    ? '#39FF14' 
                    : '#d1d5db',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: activeGradientPalette === 'neon' ? 600 : 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeGradientPalette !== 'neon') {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                    e.currentTarget.style.borderColor = '#818cf8';
                    e.currentTarget.style.color = '#e0e7ff';
                  } else {
                    e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
                    e.currentTarget.style.borderColor = '#39FF14';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeGradientPalette !== 'neon') {
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
              <button
                onClick={() => setActiveGradientPalette('pastel')}
                style={{
                  padding: '5px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: activeGradientPalette === 'pastel' 
                ? '2px solid #60a5fa'
                : '1px solid rgba(96, 165, 250, 0.3)',
                  backgroundColor: activeGradientPalette === 'pastel' 
                    ? '#60a5fa' 
                    : 'rgba(45, 52, 65, 0.8)',
                  color: activeGradientPalette === 'pastel' 
                    ? '#ffffff' 
                    : '#d1d5db',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: activeGradientPalette === 'pastel' ? 600 : 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeGradientPalette !== 'pastel') {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                    e.currentTarget.style.borderColor = '#818cf8';
                    e.currentTarget.style.color = '#e0e7ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeGradientPalette !== 'pastel') {
                    e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                Pastéis
              </button>
            </div>

            {/* Gradientes Bicolor */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
                🎨 Bicolor (2 cores) - {activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_BICOLOR.length : activeGradientPalette === 'neon' ? NEON_GRADIENTS_BICOLOR.length : PASTEL_GRADIENTS_BICOLOR.length} opções
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px'
              }}>
                {(activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_BICOLOR : 
                  activeGradientPalette === 'neon' ? NEON_GRADIENTS_BICOLOR : PASTEL_GRADIENTS_BICOLOR).map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => applyContainerGradient(gradient.value)}
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

            {/* Gradientes Tricolor */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
                🌈 Tricolor (3 cores) - {activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_TRICOLOR.length : activeGradientPalette === 'neon' ? NEON_GRADIENTS_TRICOLOR.length : PASTEL_GRADIENTS_TRICOLOR.length} opções
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px'
              }}>
                {(activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_TRICOLOR : 
                  activeGradientPalette === 'neon' ? NEON_GRADIENTS_TRICOLOR : PASTEL_GRADIENTS_TRICOLOR).map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => applyContainerGradient(gradient.value)}
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

            {/* Gradientes Multicolor */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
                ✨ Multicolor (4+ cores) - {activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_MULTICOLOR.length : activeGradientPalette === 'neon' ? NEON_GRADIENTS_MULTICOLOR.length : PASTEL_GRADIENTS_MULTICOLOR.length} opções
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px'
              }}>
                {(activeGradientPalette === 'classic' ? CLASSIC_GRADIENTS_MULTICOLOR : 
                  activeGradientPalette === 'neon' ? NEON_GRADIENTS_MULTICOLOR : PASTEL_GRADIENTS_MULTICOLOR).map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => applyContainerGradient(gradient.value)}
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
          </div>
        </>
      )}

      {/* SEÇÃO: BORDAS (para todos) */}
      <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
        <label>🖼️ Cor da Borda</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => handleColorChange('borderColor', e.target.value)}
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
            value={borderColor}
            onChange={(e) => handleColorChange('borderColor', e.target.value)}
            placeholder="#000000"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              fontFamily: 'monospace',
              fontSize: '12px', color: '#f3f4f6'
            }}
          />
        </div>
        <ColorPalette />
      </div>

      {/* SEÇÃO: OPACIDADE (para todos) */}
      <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
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
              border: '1px solid rgba(96, 165, 250, 0.5)',
              fontSize: '12px', color: '#f3f4f6'
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

      {/* SEÇÃO: CORES RECENTES */}
      {recentColors.length > 0 && (
        <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
          <label>⏱️ Cores Recentes</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px'
          }}>
            {recentColors.slice(0, 6).map(color => (
              <button
                key={`recent-${color}`}
                onClick={() => {
                  if (color.includes('gradient')) {
                    isContainer ? applyContainerGradient(color) : applyTextGradient(color);
                  } else {
                    handleColorChange('color', color);
                  }
                }}
                style={{
                  width: '100%',
                  height: '24px',
                  backgroundColor: color.includes('gradient') ? '#60a5fa' : color,
                  border: '1px solid rgba(96, 165, 250, 0.5)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: color.includes('gradient') ? '8px' : '0px',
                  fontWeight: 'bold',
                  overflow: 'hidden'
                }}
                title={color.includes('gradient') ? 'Gradiente' : color}
              >
                {color.includes('gradient') ? '🌈' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DICAS */}
      <div className="editor-group" style={{ marginBottom: '0' }}>
        <label>💡 Dicas</label>
        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>
          <p style={{ margin: '0 0 4px 0' }}>
            🌈 Clique em qualquer gradiente para aplicar
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            ⏱️ Suas cores usadas aparecem aqui automaticamente
          </p>
          <p style={{ margin: 0 }}>
            ✨ Gradientes em texto precisam de display inline-block
          </p>
        </div>
      </div>
    </div>
  );
};
