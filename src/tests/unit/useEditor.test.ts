import { renderHook, act } from '@testing-library/react';
import { useEditor } from '../../hooks/useEditor';
import { createRef } from 'react';

// Mock do postMessage
const mockPostMessage = jest.fn();
const mockContentWindow = {
  postMessage: mockPostMessage
};

describe('useEditor Hook', () => {
  let iframeRef: React.RefObject<HTMLIFrameElement>;

  beforeEach(() => {
    iframeRef = createRef<HTMLIFrameElement>();
    // Mock do iframe
    Object.defineProperty(iframeRef, 'current', {
      value: {
        contentWindow: mockContentWindow
      },
      writable: true
    });
    mockPostMessage.mockClear();
  });

  afterEach(() => {
    // Limpar event listeners
    window.removeEventListener('message', jest.fn());
  });

  describe('Inicialização', () => {
    it('deve inicializar com estado padrão', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      expect(result.current.selectedElement).toBeNull();
      expect(result.current.hasEdits).toBe(false);
      expect(result.current.hasSavedEdits).toBe(false);
    });
  });

  describe('Comunicação com iframe', () => {
    it('deve processar mensagem ELEMENT_SELECTED corretamente', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      const mockElement = {
        xpath: '/html/body/div[1]',
        tagName: 'DIV',
        textContent: 'Test content',
        className: 'test-class',
        id: 'test-id',
        styles: {},
        attributes: {},
        boundingRect: { top: 0, left: 0, right: 100, bottom: 50, width: 100, height: 50 }
      };

      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'ELEMENT_SELECTED',
            data: mockElement
          }
        }));
      });

      expect(result.current.selectedElement).toEqual(mockElement);
    });

    it('deve ignorar mensagens de sources não autorizadas', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'UNKNOWN_SOURCE',
            type: 'ELEMENT_SELECTED',
            data: {}
          }
        }));
      });

      expect(result.current.selectedElement).toBeNull();
    });

    it('deve marcar hasEdits como true quando elemento é atualizado', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'ELEMENT_UPDATED'
          }
        }));
      });

      expect(result.current.hasEdits).toBe(true);
    });
  });

  describe('updateElement', () => {
    it('deve enviar mensagem UPDATE_ELEMENT para iframe', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      const update = {
        type: 'style' as const,
        property: 'color',
        value: 'red',
        viewport: 'desktop' as const
      };

      act(() => {
        result.current.updateElement(update);
      });

      expect(mockPostMessage).toHaveBeenCalledWith({
        source: 'EDITOR_PARENT',
        type: 'UPDATE_ELEMENT',
        data: update
      }, '*');
    });

    it('não deve enviar mensagem se iframe não estiver disponível', () => {
      const emptyRef = createRef<HTMLIFrameElement>();
      const { result } = renderHook(() => useEditor(emptyRef));

      const update = {
        type: 'style' as const,
        property: 'color',
        value: 'red',
        viewport: 'desktop' as const
      };

      act(() => {
        result.current.updateElement(update);
      });

      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });

  describe('getEditedHtml', () => {
    it('deve solicitar HTML do iframe e retornar resposta', async () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      const htmlPromise = result.current.getEditedHtml();

      // Simular resposta do iframe
      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'HTML_CONTENT',
            data: '<html><body>Test HTML</body></html>'
          }
        }));
      });

      const html = await htmlPromise;
      expect(html).toBe('<html><body>Test HTML</body></html>');
      expect(mockPostMessage).toHaveBeenCalledWith({
        source: 'EDITOR_PARENT',
        type: 'GET_HTML'
      }, '*');
    });

    it('deve retornar string vazia se iframe não estiver disponível', async () => {
      const emptyRef = createRef<HTMLIFrameElement>();
      const { result } = renderHook(() => useEditor(emptyRef));

      const html = await result.current.getEditedHtml();
      expect(html).toBe('');
    });
  });

  describe('restoreOriginalHtml', () => {
    it('deve enviar mensagem RESTORE_HTML quando confirmado', () => {
      // Mock do confirm
      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => true);

      const { result } = renderHook(() => useEditor(iframeRef));

      act(() => {
        result.current.restoreOriginalHtml();
      });

      expect(mockPostMessage).toHaveBeenCalledWith({
        source: 'EDITOR_PARENT',
        type: 'RESTORE_HTML'
      }, '*');

      // Restaurar confirm original
      window.confirm = originalConfirm;
    });

    it('não deve enviar mensagem se usuário cancelar', () => {
      // Mock do confirm
      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => false);

      const { result } = renderHook(() => useEditor(iframeRef));

      act(() => {
        result.current.restoreOriginalHtml();
      });

      expect(mockPostMessage).not.toHaveBeenCalled();

      // Restaurar confirm original
      window.confirm = originalConfirm;
    });
  });

  describe('saveEdits', () => {
    it('deve marcar hasSavedEdits como true', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      act(() => {
        result.current.saveEdits();
      });

      expect(result.current.hasSavedEdits).toBe(true);
    });
  });

  describe('clearSelection', () => {
    it('deve limpar elemento selecionado', () => {
      const { result } = renderHook(() => useEditor(iframeRef));

      // Primeiro selecionar um elemento
      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'ELEMENT_SELECTED',
            data: { tagName: 'DIV' }
          }
        }));
      });

      expect(result.current.selectedElement).not.toBeNull();

      // Depois limpar seleção
      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedElement).toBeNull();
    });
  });
});