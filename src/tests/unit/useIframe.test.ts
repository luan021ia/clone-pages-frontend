import { renderHook, act } from '@testing-library/react';
import { useIframe } from '../../hooks/useIframe';
import { CloneService } from '../../services/cloneService';

// Mock do CloneService
jest.mock('../../services/cloneService');
const mockCloneService = CloneService as jest.Mocked<typeof CloneService>;

describe('useIframe Hook', () => {
  let mockIframe: HTMLIFrameElement;
  let mockContentDocument: Document;
  let mockContentWindow: Window;

  beforeEach(() => {
    // Mock do iframe e seu conteúdo
    mockContentDocument = {
      body: document.createElement('body'),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    } as any;

    mockContentWindow = {
      document: mockContentDocument
    } as any;

    mockIframe = {
      contentDocument: mockContentDocument,
      contentWindow: mockContentWindow,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    } as any;

    // Mock do CloneService
    mockCloneService.requestEditedHtml = jest.fn().mockResolvedValue('<html>test</html>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('deve retornar ref, requestEditedHtml e syncDOMChanges', () => {
      const { result } = renderHook(() => useIframe());

      expect(result.current.iframeRef).toBeDefined();
      expect(typeof result.current.requestEditedHtml).toBe('function');
      expect(typeof result.current.syncDOMChanges).toBe('function');
    });
  });

  describe('requestEditedHtml', () => {
    it('deve chamar CloneService.requestEditedHtml quando iframe estiver carregado', async () => {
      const { result } = renderHook(() => useIframe());

      // Simular iframe carregado
      Object.defineProperty(result.current.iframeRef, 'current', {
        value: mockIframe,
        writable: true
      });

      const html = await result.current.requestEditedHtml();

      expect(mockCloneService.requestEditedHtml).toHaveBeenCalledWith(mockContentWindow);
      expect(html).toBe('<html>test</html>');
    });

    it('deve retornar string vazia se iframe não estiver disponível', async () => {
      const { result } = renderHook(() => useIframe());

      const html = await result.current.requestEditedHtml();

      expect(html).toBe('');
      expect(mockCloneService.requestEditedHtml).not.toHaveBeenCalled();
    });

    it('deve retornar string vazia se contentWindow não estiver disponível', async () => {
      const { result } = renderHook(() => useIframe());

      // Simular iframe sem contentWindow
      Object.defineProperty(result.current.iframeRef, 'current', {
        value: { ...mockIframe, contentWindow: null },
        writable: true
      });

      const html = await result.current.requestEditedHtml();

      expect(html).toBe('');
      expect(mockCloneService.requestEditedHtml).not.toHaveBeenCalled();
    });
  });

  describe('syncDOMChanges', () => {
    let mockMutationObserver: jest.MockedClass<typeof MutationObserver>;

    beforeEach(() => {
      // Mock do MutationObserver
      mockMutationObserver = jest.fn().mockImplementation((callback) => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn()
      }));
      global.MutationObserver = mockMutationObserver;
    });

    it('deve configurar MutationObserver quando iframe estiver disponível', () => {
      const { result } = renderHook(() => useIframe());

      // Simular iframe carregado
      Object.defineProperty(result.current.iframeRef, 'current', {
        value: mockIframe,
        writable: true
      });

      act(() => {
        result.current.syncDOMChanges();
      });

      expect(mockMutationObserver).toHaveBeenCalled();
      expect(mockMutationObserver.mock.instances[0].observe).toHaveBeenCalledWith(
        mockContentDocument.body,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeOldValue: true,
          characterData: true,
          characterDataOldValue: true
        }
      );
    });

    it('não deve configurar MutationObserver se iframe não estiver disponível', () => {
      const { result } = renderHook(() => useIframe());

      act(() => {
        result.current.syncDOMChanges();
      });

      expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it('não deve configurar MutationObserver se contentDocument não estiver disponível', () => {
      const { result } = renderHook(() => useIframe());

      // Simular iframe sem contentDocument
      Object.defineProperty(result.current.iframeRef, 'current', {
        value: { ...mockIframe, contentDocument: null },
        writable: true
      });

      act(() => {
        result.current.syncDOMChanges();
      });

      expect(mockMutationObserver).not.toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    it('deve adicionar event listener de load no iframe quando disponível', () => {
      const { result } = renderHook(() => useIframe());

      // Simular iframe sendo definido
      act(() => {
        Object.defineProperty(result.current.iframeRef, 'current', {
          value: mockIframe,
          writable: true
        });
      });

      expect(mockIframe.addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
    });

    it('deve remover event listener quando componente for desmontado', () => {
      const { result, unmount } = renderHook(() => useIframe());

      // Simular iframe sendo definido
      act(() => {
        Object.defineProperty(result.current.iframeRef, 'current', {
          value: mockIframe,
          writable: true
        });
      });

      unmount();

      expect(mockIframe.removeEventListener).toHaveBeenCalledWith('load', expect.any(Function));
    });
  });
});