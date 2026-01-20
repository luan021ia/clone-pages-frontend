import type { IntegrationConfig, IntegrationToggles } from '../types/integration.types';

interface QueryParams {
  url: string;
  integrations: IntegrationConfig;
  toggles: IntegrationToggles;
  editMode: boolean;
}

export const buildQuery = ({ url, integrations, toggles, editMode }: QueryParams): string => {
  console.log('🟢 [buildQuery] chamado com:', {
    integrations,
    toggles,
    editMode
  });

  const params = new URLSearchParams();

  if (url) {
    params.append('url', url);
  }
  
  // ✅ Determinar se deve injetar códigos customizados
  const hasAnyCode = Boolean(
    (integrations.pixelId && toggles.pixelEnabled) ||
    (integrations.gtagId && toggles.gtagEnabled) ||
    (integrations.whatsappNumber && toggles.whatsappEnabled) ||
    (integrations.clarityId && toggles.clarityEnabled) ||
    (integrations.utmfyCode && toggles.utmfyEnabled)
  );
  
  if (hasAnyCode) {
    params.append('injectCustom', 'true');
  }
  
  // Pixel Facebook - enviar apenas o ID quando toggle está ativo
  if (integrations.pixelId && toggles.pixelEnabled) {
    params.append('pixelId', integrations.pixelId);
  }
  
  // Google Analytics - enviar apenas o ID quando toggle está ativo
  if (integrations.gtagId && toggles.gtagEnabled) {
    params.append('gtagId', integrations.gtagId);
  }
  
  // WhatsApp - enviar apenas o número quando toggle está ativo
  if (integrations.whatsappNumber && toggles.whatsappEnabled) {
    params.append('whatsappNumber', integrations.whatsappNumber);
  }
  
  // Microsoft Clarity - enviar apenas o ID quando toggle está ativo
  if (integrations.clarityId && toggles.clarityEnabled) {
    params.append('clarityId', integrations.clarityId);
  }
  
  // UTMFY - enviar apenas o código quando toggle está ativo
  if (integrations.utmfyCode && toggles.utmfyEnabled) {
    params.append('utmfyCode', integrations.utmfyCode);
  }
  
  if (editMode) {
    params.append('editMode', 'true');
  }

  console.log('🔍 [buildQuery] Parâmetros finais:', {
    injectCustom: hasAnyCode,
    pixelId: integrations.pixelId && toggles.pixelEnabled ? '***' : undefined,
    gtagId: integrations.gtagId && toggles.gtagEnabled ? '***' : undefined,
    whatsappNumber: integrations.whatsappNumber && toggles.whatsappEnabled ? '***' : undefined,
    clarityId: integrations.clarityId && toggles.clarityEnabled ? '***' : undefined,
    utmfyCode: integrations.utmfyCode && toggles.utmfyEnabled ? '(preenchido)' : undefined,
  });
  
  return params.toString();
};