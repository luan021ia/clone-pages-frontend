export interface IntegrationConfig {
  pixelId: string;
  gtagId: string;
  whatsappNumber: string;
  clarityId: string;
  utmfyCode: string;
}

export interface IntegrationToggles {
  pixelEnabled: boolean;
  gtagEnabled: boolean;
  whatsappEnabled: boolean;
  clarityEnabled: boolean;
  utmfyEnabled: boolean;
}

export interface IntegrationField {
  key: keyof IntegrationConfig;
  label: string;
  placeholder: string;
  toggleKey: keyof IntegrationToggles;
}

export type IntegrationType = 'pixel' | 'gtag' | 'whatsapp' | 'clarity' | 'utmfy';