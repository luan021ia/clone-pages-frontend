import { CloneService } from '../cloneService';

// Mock do fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('CloneService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOriginalHtml', () => {
    it('deve buscar HTML de uma URL válida', async () => {
      const mockHtml = '<html><body>Test content</body></html>';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHtml),
      } as Response);

      const result = await CloneService.getOriginalHtml('https://example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/download-html?url=https%3A%2F%2Fexample.com'
      );
      expect(result).toBe(mockHtml);
    });

    it('deve incluir query params na requisição', async () => {
      const mockHtml = '<html><body>Test</body></html>';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHtml),
      } as Response);

      await CloneService.getOriginalHtml('https://example.com', 'param1=value1&param2=value2');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/download-html?url=https%3A%2F%2Fexample.com&param1=value1&param2=value2'
      );
    });

    it('deve tratar erro de resposta HTTP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(CloneService.getOriginalHtml('https://example.com'))
        .rejects.toThrow('HTTP error! status: 404');
    });

    it('deve tratar erro de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(CloneService.getOriginalHtml('https://example.com'))
        .rejects.toThrow('Network error');
    });
  });

  describe('cleanTrackingCodes', () => {
    it('deve remover Google Analytics', () => {
      const htmlWithGA = `
        <html>
          <head>
            <!-- Google Analytics -->
            <script>gtag('config', 'GA_TRACKING_ID');</script>
            <!-- End Google Analytics -->
          </head>
          <body>Content</body>
        </html>
      `;

      const result = CloneService.cleanTrackingCodes(htmlWithGA);

      expect(result).not.toContain('Google Analytics');
      expect(result).not.toContain('gtag');
      expect(result).toContain('Content');
    });

    it('deve remover Facebook Pixel', () => {
      const htmlWithFB = `
        <html>
          <head>
            <!-- Facebook Pixel -->
            <script>fbq('init', 'PIXEL_ID');</script>
            <!-- End Facebook Pixel -->
          </head>
          <body>Content</body>
        </html>
      `;

      const result = CloneService.cleanTrackingCodes(htmlWithFB);

      expect(result).not.toContain('Facebook Pixel');
      expect(result).not.toContain('fbq');
      expect(result).toContain('Content');
    });

    it('deve remover Microsoft Clarity', () => {
      const htmlWithClarity = `
        <html>
          <head>
            <!-- Microsoft Clarity -->
            <script>clarity('set', 'CLARITY_ID');</script>
            <!-- End Microsoft Clarity -->
          </head>
          <body>Content</body>
        </html>
      `;

      const result = CloneService.cleanTrackingCodes(htmlWithClarity);

      expect(result).not.toContain('Microsoft Clarity');
      expect(result).not.toContain('clarity');
      expect(result).toContain('Content');
    });

    it('deve preservar conteúdo não relacionado a tracking', () => {
      const cleanHtml = `
        <html>
          <head><title>Test Page</title></head>
          <body>
            <h1>Welcome</h1>
            <p>This is clean content</p>
          </body>
        </html>
      `;

      const result = CloneService.cleanTrackingCodes(cleanHtml);

      expect(result).toBe(cleanHtml);
    });
  });

  describe('sanitizeHtml', () => {
    it('deve retornar HTML como está (sanitização básica)', () => {
      const html = '<div>Test content</div>';
      const result = CloneService.sanitizeHtml(html);
      
      expect(result).toBe(html);
    });

    it('deve lidar com HTML vazio', () => {
      const result = CloneService.sanitizeHtml('');
      expect(result).toBe('');
    });

    it('deve lidar com HTML complexo', () => {
      const complexHtml = `
        <html>
          <head><title>Test</title></head>
          <body>
            <div class="container">
              <p>Content with <a href="link">link</a></p>
            </div>
          </body>
        </html>
      `;
      
      const result = CloneService.sanitizeHtml(complexHtml);
      expect(result).toBe(complexHtml);
    });
  });

  describe('requestEditedHtml', () => {
    let mockIframe: HTMLIFrameElement;
    let mockContentWindow: any;

    beforeEach(() => {
      mockContentWindow = {
        postMessage: jest.fn(),
      };

      mockIframe = {
        contentWindow: mockContentWindow,
        src: 'http://localhost:3001/render?url=example.com',
      } as any;

      // Mock do addEventListener e removeEventListener
      global.addEventListener = jest.fn();
      global.removeEventListener = jest.fn();
    });

    it('deve solicitar HTML editado via postMessage', async () => {
      const mockHtml = '<div>Edited content</div>';
      
      // Mock do evento de resposta
      setTimeout(() => {
        const mockEvent = {
          origin: window.location.origin,
          data: {
            source: 'CLONEPAGES_IFRAME',
            type: 'POST_HTML',
            html: mockHtml,
          },
        };
        
        // Simular o evento de message
        const messageHandler = (global.addEventListener as jest.Mock).mock.calls
          .find(call => call[0] === 'message')?.[1];
        
        if (messageHandler) {
          messageHandler(mockEvent);
        }
      }, 100);

      const result = await CloneService.requestEditedHtml(mockContentWindow);

      expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
        { source: 'EDITOR_PARENT', type: 'GET_HTML' },
        '*'
      );
    });

    it('deve retornar string vazia em caso de timeout', async () => {
      // Não simular resposta para testar timeout
      const result = await CloneService.requestEditedHtml(mockContentWindow);
      expect(result).toBe('');
    }, 6000);

    it('deve ignorar mensagens de origem não autorizada', async () => {
      setTimeout(() => {
        const mockEvent = {
          origin: 'https://malicious-site.com',
          data: {
            source: 'CLONEPAGES_IFRAME',
            type: 'POST_HTML',
            html: '<script>alert("xss")</script>',
          },
        };
        
        const messageHandler = (global.addEventListener as jest.Mock).mock.calls
          .find(call => call[0] === 'message')?.[1];
        
        if (messageHandler) {
          messageHandler(mockEvent);
        }
      }, 100);

      const result = await CloneService.requestEditedHtml(mockContentWindow);
      expect(result).toBe(''); // Deve retornar vazio por timeout, não o HTML malicioso
    }, 6000);
  });
});