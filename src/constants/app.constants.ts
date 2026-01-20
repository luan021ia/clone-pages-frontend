import type { IntegrationField } from '../types/integration.types';

export const INTEGRATION_FIELDS: IntegrationField[] = [
  {
    key: 'pixelId',
    label: 'Pixel Meta:',
    placeholder: 'Digite o ID do Pixel Meta',
    toggleKey: 'pixelEnabled'
  },
  {
    key: 'gtagId',
    label: 'Google Tag:',
    placeholder: 'Digite o ID do Google Tag',
    toggleKey: 'gtagEnabled'
  },
  {
    key: 'utmfyCode',
    label: 'UTMFY:',
    placeholder: 'Digite o código UTMFY',
    toggleKey: 'utmfyEnabled'
  },
  {
    key: 'clarityId',
    label: 'Microsoft Clarity:',
    placeholder: 'Digite o ID do Microsoft Clarity',
    toggleKey: 'clarityEnabled'
  },
  {
    key: 'whatsappNumber',
    label: 'WhatsApp:',
    placeholder: 'Digite o número do WhatsApp',
    toggleKey: 'whatsappEnabled'
  }
];

export const DEFAULT_STATUS = 'Aguardando URL...';
export const CLONING_STATUS = 'Clonando página...';
export const SUCCESS_STATUS = 'Página clonada com sucesso!';
export const ERROR_STATUS = 'Erro ao clonar página';

export const VIEWPORT_LABELS = {
  desktop: 'Desktop',
  mobile: 'Mobile'
} as const;