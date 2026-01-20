import { renderHook, act } from '@testing-library/react';
import { useIframe } from '../useIframe';
import { CloneService } from '../../services/cloneService';

// Mock do CloneService
jest.mock('../../services/cloneService');
const mockCloneService = CloneService as jest.Mocked<typeof CloneService>;

// Mock do MutationObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockMutationObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  callback,
}));
global.MutationObserver = mockMutationObserver;

describe('useIframe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCloneService.requestEditedHtml.mockResolvedValue('<html>Mock HTML</html>');
  });

  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => useIframe());

    expect(result.current.iframeRef).toBeDefined();
    expect(result.current.iframeRef.current).toBeNull();
    expect(typeof result.current.requestEditedHtml).toBe('function');
    expect(typeof result.current.syncDOMChanges).toBe('function');
  });

  describe('requestEditedHtml', () => {
    it('deve retornar string vazia quando não há iframe', async () => {
      const { result } = renderHook(() => useIframe());

      const html = await result.current.requestEditedHtml();

      expect(html).toBe('');
      expect(mockCloneService.requestEditedHtml).not.toHaveBeenCalled();
    });

    it('deve chamar CloneService.requestEditedHtml com iframe válido', async () => {
      const { result } = renderHook(() => useIframe());
      
      // Simular iframe válido com contentWindow
      const mockContentWindow = {} as Window;
      const mockIframe = {
        contentWindow: mockContentWindow
      } as HTMLIFrameElement;
      result.current.iframeRef.current = mockIframe;

      const html = await result.current.requestEditedHtml();

      expect(mockCloneService.requestEditedHtml).toHaveBeenCalledWith(mockContentWindow);
      expect(html).toBe('<html>Mock HTML</html>');
    });

    it('deve lidar com erro em requestEditedHtml', async () => {
      const { result } = renderHook(() => useIframe());
      const error = new Error('Erro de teste');
      
      mockCloneService.requestEditedHtml.mockRejectedValue(error);

      // Simular iframe válido com contentWindow
      const mockContentWindow = {} as Window;
      const mockIframe = {
        contentWindow: mockContentWindow
      } as HTMLIFrameElement;
      result.current.iframeRef.current = mockIframe;

      await expect(result.current.requestEditedHtml()).rejects.toThrow('Erro de teste');
    });
  });

  describe('syncDOMChanges', () => {
    it('deve retornar função de cleanup quando não há iframe', () => {
      const { result } = renderHook(() => useIframe());

      const cleanup = result.current.syncDOMChanges();

      expect(typeof cleanup).toBe('function');
      expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it('deve configurar MutationObserver quando há iframe com contentDocument', () => {
       const { result } = renderHook(() => useIframe());
       
       // Simular iframe com contentDocument
       const mockIframe = {
         contentDocument: {
           body: document.createElement('body')
         }
       } as unknown as HTMLIFrameElement;
      result.current.iframeRef.current = mockIframe;

      const cleanup = result.current.syncDOMChanges();

      expect(mockMutationObserver).toHaveBeenCalled();
      expect(mockObserve).toHaveBeenCalledWith(mockIframe.contentDocument.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
      });

      // Testar cleanup
      cleanup();
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('deve retornar função de cleanup quando iframe não tem contentDocument', () => {
      const { result } = renderHook(() => useIframe());
      
      // Simular iframe sem contentDocument
      const mockIframe = {} as HTMLIFrameElement;
      result.current.iframeRef.current = mockIframe;

      const cleanup = result.current.syncDOMChanges();

      expect(typeof cleanup).toBe('function');
      expect(mockMutationObserver).not.toHaveBeenCalled();
    });
  });

  describe('useEffect para load event', () => {
    it('deve retornar as funções necessárias', () => {
      const { result } = renderHook(() => useIframe());
      
      // Verificar se as funções estão disponíveis
      expect(result.current.iframeRef).toBeDefined();
      expect(result.current.requestEditedHtml).toBeDefined();
      expect(result.current.syncDOMChanges).toBeDefined();
      expect(typeof result.current.requestEditedHtml).toBe('function');
      expect(typeof result.current.syncDOMChanges).toBe('function');
    });
  });

  describe('múltiplas requisições', () => {
    it('deve gerenciar múltiplas requisições concorrentes', async () => {
      const { result } = renderHook(() => useIframe());
      
      mockCloneService.requestEditedHtml
        .mockResolvedValueOnce('<html>Primeira resposta</html>')
        .mockResolvedValueOnce('<html>Segunda resposta</html>');

      // Simular iframe válido com contentWindow
      const mockContentWindow = {} as Window;
      const mockIframe = {
        contentWindow: mockContentWindow
      } as HTMLIFrameElement;
      result.current.iframeRef.current = mockIframe;

      const promises = [
        result.current.requestEditedHtml(),
        result.current.requestEditedHtml(),
      ];

      const results = await Promise.all(promises);

      expect(results[0]).toBe('<html>Primeira resposta</html>');
      expect(results[1]).toBe('<html>Segunda resposta</html>');
      expect(mockCloneService.requestEditedHtml).toHaveBeenCalledTimes(2);
    });
  });
});