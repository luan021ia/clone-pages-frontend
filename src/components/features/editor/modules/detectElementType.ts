/**
 * Identificação SIMPLES de tipo de elemento
 * Retorna qual módulo de abas usar para cada elemento
 */

import type { SelectedElement } from '@/types/editor.types';

export type ElementModuleType = 'text' | 'media' | 'container' | 'advanced';

export function detectElementType(element: SelectedElement): ElementModuleType {
  // 🎯 FIX: Adicionar null safety para tagName
  const tagName = element?.tagName?.toLowerCase() || '';
  const className = (element?.className || '').toLowerCase();

  // TEXTO: p, h1-h6, span, strong, em, etc
  if (/^(p|h[1-6]|span|em|strong|small|mark|code|pre|blockquote)$/.test(tagName)) {
    return 'text';
  }

  // MÍDIA: img, video, iframe, etc
  if (/^(img|figure|video|iframe|picture)$/.test(tagName)) {
    return 'media';
  }

  // CONTAINER: div, section, article, nav, aside, header, footer, main
  if (/^(div|section|article|nav|aside|header|footer|main|button|a)$/.test(tagName)) {
    // Botões podem ter tabs especiais se necessário
    // 🎯 FIX: className.includes é seguro pois className já tem fallback vazio
    if (tagName === 'button' || className.includes('btn') || className.includes('button')) {
      return 'container'; // Ou 'advanced' se quiser abas de botão
    }
    return 'container';
  }

  // PADRÃO: advanced (todas as abas genéricas)
  return 'advanced';
}

export const MODULE_LABELS: Record<ElementModuleType, string> = {
  text: '📝 Texto',
  media: '🖼️ IMG, Vídeos e Links',
  container: '📦 Container',
  advanced: '⚙️ Avançado',
};
