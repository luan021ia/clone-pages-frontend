export type ViewportMode = 'desktop' | 'mobile';

export interface ViewportDimensions {
  width: string;
  height: string;
}

export interface ViewportConfig {
  mode: ViewportMode;
  dimensions: ViewportDimensions;
}

export const VIEWPORT_CONFIGS: Record<ViewportMode, ViewportDimensions> = {
  desktop: { width: '100%', height: '600px' },
  mobile: { width: '375px', height: '600px' }
};