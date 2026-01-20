export interface AppState {
  url: string;
  pixelId: string;
  gtagId: string;
  whatsappNumber: string;
  clarityId: string;
  utmfyCode: string;
  pixelEnabled: boolean;
  gtagEnabled: boolean;
  whatsappEnabled: boolean;
  clarityEnabled: boolean;
  utmfyEnabled: boolean;
  editMode: boolean;
  viewportMode: 'desktop' | 'mobile';
  iframeSrc: string;
  status: string;
}

export interface Integration {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  enabled: boolean;
}

export interface ViewportConfig {
  mode: 'desktop' | 'mobile';
  width: string;
  height: string;
}

export interface CloneResult {
  originalHtml: string;
  editedHtml: string;
  success: boolean;
  error?: string;
}