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
    console.log('🔵 [updateIntegration]', key, '=', value);
    setState(prev => {
      const newState = { ...prev, [key]: value };
      console.log('🔵 [updateIntegration] novo estado:', {
        pixelId: newState.pixelId,
        pixelEnabled: newState.pixelEnabled,
        gtagId: newState.gtagId,
        gtagEnabled: newState.gtagEnabled,
        utmfyCode: newState.utmfyCode,
        utmfyEnabled: newState.utmfyEnabled,
        clarityId: newState.clarityId,
        clarityEnabled: newState.clarityEnabled,
        whatsappNumber: newState.whatsappNumber,
        whatsappEnabled: newState.whatsappEnabled
      });
      return newState;
    });
  }, []);

  return {
    state,
    updateState,
    resetState,
    updateIntegration
  };
};