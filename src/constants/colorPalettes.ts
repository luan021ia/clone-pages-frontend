// ===== PALETAS DE CORES SÓLIDAS =====

// Paleta Material Design (expandida)
export const MATERIAL_COLORS = [
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
export const TAILWIND_COLORS = [
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
export const PASTEL_COLORS = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4',
    '#FEC8D8', '#FFDFD3', '#D4A5A5', '#9A8C98', '#C9ADA7', '#F2CC8F',
    '#81B29A', '#E07A5F', '#3D405B', '#F4F1DE', '#EAEAEA', '#BCBABB',
    '#FFE4E1', '#FFF0F5', '#F0E68C', '#E6E6FA', '#DDA0DD', '#98FB98'
];

// Paleta Neon (CORES NEONS SÓLIDAS)
export const NEON_COLORS = [
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

export interface Gradient {
    name: string;
    value: string;
}

// ===== PALETA: CLÁSSICOS (Gradientes Profissionais Tradicionais) =====
export const CLASSIC_GRADIENTS_BICOLOR: Gradient[] = [
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

export const CLASSIC_GRADIENTS_TRICOLOR: Gradient[] = [
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

export const CLASSIC_GRADIENTS_MULTICOLOR: Gradient[] = [
    { name: 'Arco-íris Clássico', value: 'linear-gradient(135deg, #FF073A 0%, #FF8C00 20%, #FFD700 40%, #32CD32 60%, #1E90FF 80%, #9932CC 100%)' },
    { name: 'Oceano Profundo', value: 'linear-gradient(135deg, #001f3f 0%, #0074d9 25%, #7fdbff 50%, #39cccc 75%, #2ecc40 100%)' },
    { name: 'Pôr do Sol Completo', value: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 20%, #ffa94d 40%, #ffd93d 60%, #feca57 80%, #ff9ff3 100%)' },
];

// ===== PALETA: NEON (Gradientes Neon) =====
export const NEON_GRADIENTS_BICOLOR: Gradient[] = [
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

export const NEON_GRADIENTS_TRICOLOR: Gradient[] = [
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

export const NEON_GRADIENTS_MULTICOLOR: Gradient[] = [
    { name: 'Neon Completo', value: 'linear-gradient(135deg, #39FF14 0%, #BF00FF 25%, #FF10F0 50%, #1F51FF 75%, #FF073A 100%)' },
    { name: 'Arco-íris Neon', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 20%, #BF00FF 40%, #1F51FF 60%, #00FF41 80%, #39FF14 100%)' },
    { name: 'Neon Vibrante', value: 'linear-gradient(135deg, #39FF14 0%, #00F5FF 20%, #BF00FF 40%, #FF10F0 60%, #FF073A 80%, #1F51FF 100%)' },
    { name: 'Neon Ciano-Arco', value: 'linear-gradient(135deg, #00F5FF 0%, #39FF14 25%, #FF10F0 50%, #FF073A 75%, #1F51FF 100%)' },
    { name: 'Neon Fusão', value: 'linear-gradient(135deg, #BF00FF 0%, #1F51FF 25%, #00FF41 50%, #FF10F0 75%, #FF073A 100%)' },
    { name: 'Neon Explosão', value: 'linear-gradient(135deg, #FF073A 0%, #FF14 93 16.66%, #BF00FF 33.33%, #1F51FF 50%, #00F5FF 66.66%, #39FF14 83.33%, #FF073A 100%)' },
    { name: 'Neon Arco Total', value: 'linear-gradient(135deg, #FF073A 0%, #FF6600 14.28%, #FFFF00 28.56%, #39FF14 42.84%, #00F5FF 57.12%, #1F51FF 71.4%, #BF00FF 85.68%, #FF10F0 100%)' },
    { name: 'Neon Spectrum', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 16.66%, #BF00FF 33.33%, #1F51FF 50%, #00F5FF 66.66%, #39FF14 83.33%, #FF073A 100%)' },
    { name: 'Neon Ultra', value: 'linear-gradient(135deg, #39FF14 0%, #00FF41 20%, #00F5FF 40%, #1F51FF 60%, #BF00FF 80%, #FF10F0 100%)' },
    { name: 'Neon Rainbow', value: 'linear-gradient(135deg, #FF073A 0%, #FF1493 20%, #BF00FF 40%, #1F51FF 60%, #00F5FF 80%, #39FF14 100%)' },
];

// ===== PALETA: PASTÉIS (Gradientes Suaves) =====
export const PASTEL_GRADIENTS_BICOLOR: Gradient[] = [
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

export const PASTEL_GRADIENTS_TRICOLOR: Gradient[] = [
    { name: 'Arco-íris Pastel', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFFFBA 50%, #BAFFC9 100%)' },
    { name: 'Céu Pastel', value: 'linear-gradient(135deg, #BAE1FF 0%, #E0BBE4 50%, #FEC8D8 100%)' },
    { name: 'Primavera Pastel', value: 'linear-gradient(135deg, #BAFFC9 0%, #FFFFBA 50%, #FFDFBA 100%)' },
    { name: 'Lavanda Doce', value: 'linear-gradient(135deg, #E0BBE4 0%, #DDA0DD 50%, #FEC8D8 100%)' },
    { name: 'Oceano Pastel', value: 'linear-gradient(135deg, #BAE1FF 0%, #BAFFC9 50%, #FFFFBA 100%)' },
];

export const PASTEL_GRADIENTS_MULTICOLOR: Gradient[] = [
    { name: 'Pastel Completo', value: 'linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 20%, #FFFFBA 40%, #BAFFC9 60%, #BAE1FF 80%, #E0BBE4 100%)' },
    { name: 'Suave Arco-íris', value: 'linear-gradient(135deg, #FFE4E1 0%, #FFF0F5 25%, #F0E68C 50%, #E6E6FA 75%, #DDA0DD 100%)' },
];
