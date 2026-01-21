import { useState, useCallback } from 'react';
import type { AppState } from '../types/app.types';
import { DEFAULT_STATUS } from '../constants/app.constants';

const initialState: AppState = {
  url: '',
  pixelId: '',
  gtagId: '',
  whatsappNumber: '',
  clarityId: '',
  utmfyCode: '',
  pixelEnabled: false,
  gtagEnabled: false,
  whatsappEnabled: false,
  clarityEnabled: false,
  utmfyEnabled: false,
  editMode: false,
  viewportMode: 'desktop',
  iframeSrc: '',
  status: DEFAULT_STATUS,
};

export const useCloneState = () => {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = useCallback((updates: Partial<AppState> | ((prev: AppState) => AppState)) => {
    if (typeof updates === 'function') {
      setState(updates);
    } else {
      setState(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const updateIntegration = useCallback((key: keyof AppState, value: string | boolean) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    state,
    updateState,
    resetState,
    updateIntegration
  };
};