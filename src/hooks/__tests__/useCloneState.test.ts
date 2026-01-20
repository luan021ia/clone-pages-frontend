import { renderHook, act } from '@testing-library/react';
import { useCloneState } from '../useCloneState';

describe('useCloneState', () => {
  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useCloneState());

    expect(result.current.state).toEqual({
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
      iframeSrc: '',
      status: 'Aguardando URL...',
      viewportMode: 'desktop'
    });
  });

  it('deve atualizar URL', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('url', 'https://example.com');
    });

    expect(result.current.state.url).toBe('https://example.com');
  });

  it('deve atualizar pixel ID', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('pixelId', '123456789');
    });

    expect(result.current.state.pixelId).toBe('123456789');
  });

  it('deve atualizar gtag ID', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('gtagId', 'GA-123456789');
    });

    expect(result.current.state.gtagId).toBe('GA-123456789');
  });

  it('deve atualizar número do WhatsApp', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('whatsappNumber', '+5511999999999');
    });

    expect(result.current.state.whatsappNumber).toBe('+5511999999999');
  });

  it('deve atualizar clarity ID', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('clarityId', 'clarity123');
    });

    expect(result.current.state.clarityId).toBe('clarity123');
  });

  it('deve atualizar utmfy ID', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('utmfyCode', 'utmfy123');
    });

    expect(result.current.state.utmfyCode).toBe('utmfy123');
  });

  it('deve alternar pixel enabled', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('pixelEnabled', true);
    });

    expect(result.current.state.pixelEnabled).toBe(true);

    act(() => {
      result.current.updateIntegration('pixelEnabled', false);
    });

    expect(result.current.state.pixelEnabled).toBe(false);
  });

  it('deve alternar gtag enabled', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('gtagEnabled', true);
    });

    expect(result.current.state.gtagEnabled).toBe(true);

    act(() => {
      result.current.updateIntegration('gtagEnabled', false);
    });

    expect(result.current.state.gtagEnabled).toBe(false);
  });

  it('deve alternar whatsapp enabled', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('whatsappEnabled', true);
    });

    expect(result.current.state.whatsappEnabled).toBe(true);

    act(() => {
      result.current.updateIntegration('whatsappEnabled', false);
    });

    expect(result.current.state.whatsappEnabled).toBe(false);
  });

  it('deve alternar clarity enabled', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('clarityEnabled', true);
    });

    expect(result.current.state.clarityEnabled).toBe(true);

    act(() => {
      result.current.updateIntegration('clarityEnabled', false);
    });

    expect(result.current.state.clarityEnabled).toBe(false);
  });

  it('deve alternar utmfy enabled', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('utmfyEnabled', true);
    });

    expect(result.current.state.utmfyEnabled).toBe(true);

    act(() => {
      result.current.updateIntegration('utmfyEnabled', false);
    });

    expect(result.current.state.utmfyEnabled).toBe(false);
  });

  it('deve alternar edit mode', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('editMode', true);
    });

    expect(result.current.state.editMode).toBe(true);

    act(() => {
      result.current.updateIntegration('editMode', false);
    });

    expect(result.current.state.editMode).toBe(false);
  });

  it('deve atualizar viewport mode', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('viewportMode', 'mobile');
    });

    expect(result.current.state.viewportMode).toBe('mobile');

    act(() => {
      result.current.updateIntegration('viewportMode', 'desktop');
    });

    expect(result.current.state.viewportMode).toBe('desktop');
  });

  it('deve atualizar iframe src', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('iframeSrc', 'https://example.com');
    });

    expect(result.current.state.iframeSrc).toBe('https://example.com');
  });

  it('deve atualizar status', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('status', 'loading');
    });

    expect(result.current.state.status).toBe('loading');

    act(() => {
      result.current.updateIntegration('status', 'success');
    });

    expect(result.current.state.status).toBe('success');

    act(() => {
      result.current.updateIntegration('status', 'error');
    });

    expect(result.current.state.status).toBe('error');

    act(() => {
      result.current.updateIntegration('status', 'idle');
    });

    expect(result.current.state.status).toBe('idle');
  });

  it('deve resetar estado para valores padrão', () => {
    const { result } = renderHook(() => useCloneState());

    // Modificar alguns valores
    act(() => {
      result.current.updateIntegration('url', 'https://example.com');
      result.current.updateIntegration('pixelId', '123456');
      result.current.updateIntegration('pixelEnabled', true);
      result.current.updateIntegration('editMode', true);
      result.current.updateIntegration('viewportMode', 'mobile');
      result.current.updateIntegration('status', 'loading');
    });

    // Verificar que os valores foram alterados
    expect(result.current.state.url).toBe('https://example.com');
    expect(result.current.state.pixelId).toBe('123456');
    expect(result.current.state.pixelEnabled).toBe(true);
    expect(result.current.state.editMode).toBe(true);
    expect(result.current.state.viewportMode).toBe('mobile');
    expect(result.current.state.status).toBe('loading');

    // Resetar estado
    act(() => {
      result.current.resetState();
    });

    // Verificar que voltou ao estado inicial
    expect(result.current.state).toEqual({
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
      iframeSrc: '',
      status: 'Aguardando URL...',
      viewportMode: 'desktop'
    });
  });

  it('deve manter estado consistente após múltiplas atualizações', () => {
    const { result } = renderHook(() => useCloneState());

    act(() => {
      result.current.updateIntegration('url', 'https://test.com');
      result.current.updateIntegration('pixelId', 'pixel123');
      result.current.updateIntegration('gtagId', 'gtag123');
      result.current.updateIntegration('pixelEnabled', true);
      result.current.updateIntegration('gtagEnabled', true);
    });

    expect(result.current.state.url).toBe('https://test.com');
    expect(result.current.state.pixelId).toBe('pixel123');
    expect(result.current.state.gtagId).toBe('gtag123');
    expect(result.current.state.pixelEnabled).toBe(true);
    expect(result.current.state.gtagEnabled).toBe(true);
    expect(result.current.state.whatsappEnabled).toBe(false); // Não alterado
  });

  it('deve permitir atualizações independentes de cada campo', () => {
    const { result } = renderHook(() => useCloneState());

    // Atualizar apenas URL
    act(() => {
      result.current.updateIntegration('url', 'https://example1.com');
    });

    expect(result.current.state.url).toBe('https://example1.com');
    expect(result.current.state.pixelId).toBe(''); // Outros campos inalterados

    // Atualizar apenas pixel
    act(() => {
      result.current.updateIntegration('pixelId', 'newpixel');
    });

    expect(result.current.state.url).toBe('https://example1.com'); // URL mantida
    expect(result.current.state.pixelId).toBe('newpixel');
  });
});