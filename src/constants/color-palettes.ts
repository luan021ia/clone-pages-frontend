/**
 * 🎨 PALETAS DE CORES E GRADIENTES
 * Constantes compartilhadas para o sistema de cores do editor visual
 */

// ===== PALETA: MATERIAL COLORS =====
// Organizada por tonalidade: Vermelhos → Rosas → Roxos → Azuis → Cianos → Verdes → Amarelos → Laranjas → Marrons → Neutros
export const MATERIAL_COLORS = [
  // Vermelhos
  '#F44336', '#EF5350', '#FF5722', '#FF7043',
  // Rosas
  '#E91E63', '#EC407A',
  // Roxos
  '#9C27B0', '#AB47BC', '#673AB7', '#7E57C2',
  // Azuis (Indigo/Blue)
  '#3F51B5', '#5C6BC0', '#2196F3', '#42A5F5',
  // Azuis Claros (Light Blue)
  '#03A9F4', '#29B6F6',
  // Cianos
  '#00BCD4', '#26C6DA',
  // Verde-Azulados (Teal)
  '#009688', '#26A69A',
  // Verdes
  '#4CAF50', '#66BB6A', '#8BC34A', '#9CCC65',
  // Verde-Amarelos (Lime)
  '#CDDC39', '#D4E157',
  // Amarelos
  '#FFEB3B', '#FFEE58', '#FFC107', '#FFCA28',
  // Laranjas
  '#FF9800', '#FFA726',
  // Marrons
  '#795548', '#8D6E63',
  // Azul-Acinzentados
  '#607D8B', '#B0BEC5', '#78909C', '#CFD8DC', '#546E7A', '#37474F', '#263238',
  // Neutros (Cinzas/Preto/Branco)
  '#000000', '#424242', '#757575', '#9E9E9E', '#BDBDBD', '#EEEEEE', '#FFFFFF',
];

// ===== PALETA: TAILWIND COLORS =====
// Organizada por tonalidade: Vermelhos → Rosas → Magentas → Roxos → Azuis → Cianos → Verdes → Amarelos → Laranjas
export const TAILWIND_COLORS = [
  // Vermelhos (Red/Rose)
  '#EF4444', '#DC2626', '#991B1B', '#F43F5E', '#E11D48',
  // Rosas (Pink)
  '#EC4899', '#DB2777',
  // Magentas (Fuchsia)
  '#D946EF', '#C026D3', '#701A75',
  // Roxos (Purple/Violet)
  '#A855F7', '#9333EA', '#581C87', '#8B5CF6', '#7C3AED', '#4C1D95',
  '#6366F1', '#4F46E5', '#312E81',
  // Azuis (Blue)
  '#3B82F6', '#2563EB', '#1E3A8A',
  // Azuis Claros (Sky)
  '#0EA5E9', '#0284C7',
  // Cianos (Cyan)
  '#06B6D4', '#0891B2', '#164E63',
  // Verde-Azulados (Teal)
  '#14B8A6', '#0D9488', '#134E4A',
  // Verdes (Emerald/Green)
  '#10B981', '#059669', '#064E3B', '#22C55E', '#16A34A', '#14532D',
  // Verde-Amarelos (Lime)
  '#84CC16', '#65A30D', '#3F6212',
  // Amarelos (Yellow)
  '#EAB308', '#CA8A04', '#854D0E',
  // Laranjas (Orange/Amber)
  '#F97316', '#EA580C', '#9A3412', '#F59E0B', '#D97706', '#92400E',
];

// ===== PALETA: PASTEL COLORS =====
// Organizada por tonalidade: Rosas → Pêssegos → Amarelos → Verdes → Azuis → Roxos → Marrons
export const PASTEL_COLORS = [
  // Rosas
  '#FFB3BA', '#FEC8D8', '#F7CAC9', '#D291BC',
  // Pêssegos/Corais
  '#FFDFBA', '#FFDFD3',
  // Amarelos
  '#FFFFBA',
  // Verdes
  '#BAFFC9', '#88B04B', '#009B77',
  // Azuis
  '#BAE1FF', '#92A8D1',
  // Roxos/Lavandas
  '#E0BBE4', '#957DAD', '#B565A7',
  // Marrons
  '#955251',
];

// ===== PALETA: NEON COLORS =====
// Organizada por tonalidade: Vermelhos → Rosas → Magentas → Roxos → Azuis → Cianos → Verdes → Amarelos → Laranjas
export const NEON_COLORS = [
  // Vermelhos/Carmim
  '#FF073A', '#FF0000', '#DC143C', '#FF3864', '#C71585',
  // Rosas
  '#FF1493', '#FF69B4',
  // Magentas
  '#FF00FF', '#FF10F0',
  // Roxos
  '#BF00FF', '#9400D3', '#8A2BE2', '#DA70D6', '#BA55D3',
  // Azuis Escuros
  '#0000FF', '#0000CD', '#1F51FF', '#4169E1',
  // Azuis Médios
  '#1E90FF', '#00BFFF',
  // Cianos
  '#00F5FF', '#00FFFF', '#00CED1',
  // Verde-Azulados
  '#00FA9A', '#00FF7F',
  // Verdes
  '#39FF14', '#00FF41', '#00FF00', '#32CD32', '#7FFF00', '#7CFC00',
  // Verde-Amarelos
  '#ADFF2F',
  // Amarelos
  '#FFFF00', '#FFD700', '#FFFFE0',
  // Laranjas
  '#FF6600', '#FF8C00', '#FFA500', '#FF4500', '#FF6347',
];

// ===== GRADIENTES CLÁSSICOS =====
export const CLASSIC_GRADIENTS_BICOLOR = [
  { name: 'Púrpura Profundo', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Oceano', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Pôr do Sol', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Aurora Boreal', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  { name: 'Floresta Tropical', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Fogo', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Céu Noturno', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { name: 'Rosa Suave', value: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)' },
  { name: 'Profundo Azul', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
  { name: 'Verde Limão', value: 'linear-gradient(135deg, #7f7fd5 0%, #91eae4 100%)' },
  { name: 'Roxo & Rosa', value: 'linear-gradient(135deg, #A770EF 0%, #FDB99B 100%)' },
  { name: 'Laranja & Vermelho', value: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)' },
  { name: 'Azul Elétrico', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Verde & Azul', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Vermelho & Branco', value: 'linear-gradient(135deg, #EF4444 0%, #FFFFFF 100%)' },
  { name: 'Amarelo & Azul Marinho', value: 'linear-gradient(135deg, #F59E0B 0%, #1F2937 100%)' },
  { name: 'Magenta & Azul', value: 'linear-gradient(135deg, #DB2777 0%, #3B82F6 100%)' },
  { name: 'Preto & Dourado', value: 'linear-gradient(135deg, #0D0D0D 0%, #FACC15 100%)' },
];

export const CLASSIC_GRADIENTS_TRICOLOR = [
  { name: 'Pôr do Sol', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
  { name: 'Oceano', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)' },
  { name: 'Fogo', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fa709a 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 50%, #764ba2 100%)' },
  { name: 'Floresta', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #30cfd0 100%)' },
  { name: 'Terra', value: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 50%, #F9D423 100%)' },
  { name: 'Céu', value: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 50%, #1e3c72 100%)' },
  { name: 'Noite Estrelada', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 50%, #764ba2 100%)' },
  { name: 'Cereja', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 50%, #f093fb 100%)' },
  { name: 'Dourado', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #f59e0b 100%)' },
];

export const CLASSIC_GRADIENTS_MULTICOLOR = [
  { name: 'Arco-íris Clássico', value: 'linear-gradient(135deg, #FF073A 0%, #FF8C00 20%, #FFD700 40%, #32CD32 60%, #1E90FF 80%, #9932CC 100%)' },
  { name: 'Oceano Profundo', value: 'linear-gradient(135deg, #001f3f 0%, #0074d9 25%, #7fdbff 50%, #39cccc 75%, #2ecc40 100%)' },
  { name: 'Pôr do Sol Completo', value: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 20%, #ffa94d 40%, #ffd93d 60%, #feca57 80%, #ff9ff3 100%)' },
];

// ===== GRADIENTES NEON =====
export const NEON_GRADIENTS_BICOLOR = [
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

export const NEON_GRADIENTS_TRICOLOR = [
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

export const NEON_GRADIENTS_MULTICOLOR = [
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

// ===== GRADIENTES PASTÉIS =====
export const PASTEL_GRADIENTS_BICOLOR = [
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

export const PASTEL_GRADIENTS_TRICOLOR = [
  { name: 'Arco-íris Pastel', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFFFBA 50%, #BAFFC9 100%)' },
  { name: 'Céu Pastel', value: 'linear-gradient(135deg, #BAE1FF 0%, #E0BBE4 50%, #FEC8D8 100%)' },
  { name: 'Primavera Pastel', value: 'linear-gradient(135deg, #BAFFC9 0%, #FFFFBA 50%, #FFDFBA 100%)' },
  { name: 'Lavanda Doce', value: 'linear-gradient(135deg, #E0BBE4 0%, #DDA0DD 50%, #FEC8D8 100%)' },
  { name: 'Oceano Pastel', value: 'linear-gradient(135deg, #BAE1FF 0%, #BAFFC9 50%, #FFFFBA 100%)' },
];

export const PASTEL_GRADIENTS_MULTICOLOR = [
  { name: 'Pastel Completo', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 20%, #FFFFBA 40%, #BAFFC9 60%, #BAE1FF 80%, #E0BBE4 100%)' },
  { name: 'Suave Arco-íris', value: 'linear-gradient(135deg, #FFE4E1 0%, #FFF0F5 25%, #F0E68C 50%, #E6E6FA 75%, #DDA0DD 100%)' },
];

// ===== TIPOS =====
export type PaletteType = 'material' | 'tailwind' | 'pastel' | 'neon';
export type GradientPaletteType = 'classic' | 'neon' | 'pastel';
export type ColorProperty = 'color' | 'backgroundColor' | 'borderColor';
