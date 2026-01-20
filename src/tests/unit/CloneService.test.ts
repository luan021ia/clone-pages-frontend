import { CloneService } from '../../services/cloneService';

// Mock do fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('CloneService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestEditedHtml', () => {
    let mockContentWindow: Window;

    beforeEach(() => {
      mockContentWindow = {
        postMessage: jest.fn()
      } as any;
    });

    it('deve enviar mensagem para iframe e retornar HTML editado', async () => {
      const expectedHtml = '<html><body>Edited content</body></html>';

      // Simular resposta do iframe
      setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'HTML_CONTENT',
            data: expectedHtml
          }
        }));
      }, 10);

      const htmlPromise = CloneService.requestEditedHtml(mockContentWindow);
      const html = await htmlPromise;

      expect(mockContentWindow.postMessage).toHaveBeenCalledWith({
        source: 'EDITOR_PARENT',
        type: 'GET_HTML'
      }, '*');
      expect(html).toBe(expectedHtml);
    });

    it('deve sanitizar HTML recebido removendo scripts maliciosos', async () => {
      const maliciousHtml = '<html><body><script>alert("xss")</script>Content</body></html>';
      const expectedSanitizedHtml = '<html><body>Content</body></html>';

      setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'HTML_CONTENT',
            data: maliciousHtml
          }
        }));
      }, 10);

      const html = await CloneService.requestEditedHtml(mockContentWindow);

      // Verificar se scripts foram removidos
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('alert("xss")');
    });

    it('deve ignorar mensagens de sources não autorizadas', async () => {
      const unauthorizedHtml = '<html><body>Unauthorized</body></html>';

      setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'MALICIOUS_SOURCE',
            type: 'HTML_CONTENT',
            data: unauthorizedHtml
          }
        }));
      }, 10);

      // Aguardar um tempo para garantir que a mensagem não autorizada seja ignorada
      setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'HTML_CONTENT',
            data: '<html><body>Authorized</body></html>'
          }
        }));
      }, 20);

      const html = await CloneService.requestEditedHtml(mockContentWindow);
      expect(html).toBe('<html><body>Authorized</body></html>');
    });

    it('deve validar origem da mensagem', async () => {
      const validHtml = '<html><body>Valid content</body></html>';

      setTimeout(() => {
        const event = new MessageEvent('message', {
          data: {
            source: 'EDITOR_IFRAME',
            type: 'HTML_CONTENT',
            data: validHtml
          },
          origin: 'http://localhost:3001'
        });
        window.dispatchEvent(event);
      }, 10);

      const html = await CloneService.requestEditedHtml(mockContentWindow);
      expect(html).toBe(validHtml);
    });
  });

  describe('getOriginalHtml', () => {
    it('deve buscar HTML original do backend', async () => {
      const mockHtml = '<html><body>Original content</body></html>';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockHtml)
      } as Response);

      const html = await CloneService.getOriginalHtml('https://example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/download-html?url=https://example.com&editMode=false'
      );
      expect(html).toBe(mockHtml);
    });

    it('deve lançar erro se requisição falhar', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response);

      await expect(CloneService.getOriginalHtml('https://example.com'))
        .rejects.toThrow('Erro ao buscar HTML original: 404 Not Found');
    });

    it('deve lançar erro se fetch falhar', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(CloneService.getOriginalHtml('https://example.com'))
        .rejects.toThrow('Erro ao buscar HTML original: Network error');
    });
  });

  describe('cleanTrackingCodes', () => {
    it('deve remover Google Tag Manager (script e noscript)', () => {
      const htmlWithGtm = `
        <html>
          <head>
            <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"></script>
          </head>
          <body>
            <noscript>
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"></iframe>
            </noscript>
            <p>Content</p>
          </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithGtm);

      expect(cleanedHtml).not.toContain('googletagmanager.com');
      expect(cleanedHtml).toContain('<p>Content</p>');
    });

    it('deve remover Facebook Pixel', () => {
      const htmlWithPixel = `
        <html>
          <body>
            <script>
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            </script>
            <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=123456789&ev=PageView&noscript=1"/></noscript>
            <p>Content</p>
          </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithPixel);

      expect(cleanedHtml).not.toContain('fbq');
      expect(cleanedHtml).not.toContain('facebook.com/tr');
      expect(cleanedHtml).toContain('<p>Content</p>');
    });

    it('deve remover scripts de connect.facebook.net (fbevents.js e signals/config)', () => {
      const htmlWithFbScripts = `
        <html>
          <head>
            <script async src="https://connect.facebook.net/fbevents.js"></script>
            <script src="https://connect.facebook.net/signals/config/1015847943124592?v=2.9.241"></script>
          </head>
          <body>
            <p>Content</p>
          </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithFbScripts);
      expect(cleanedHtml).not.toContain('connect.facebook.net');
      expect(cleanedHtml).toContain('<p>Content</p>');
    });

    it('deve remover Microsoft Clarity', () => {
      const htmlWithClarity = `
        <html>
          <body>
            <script type="text/javascript">
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              })(window,document,"clarity","script","ABC123");
            </script>
            <p>Content</p>
          </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithClarity);

      expect(cleanedHtml).not.toContain('clarity.ms');
      expect(cleanedHtml).not.toContain('clarity');
      expect(cleanedHtml).toContain('<p>Content</p>');
    });

    it('deve remover UTMFY', () => {
      const htmlWithUtmfy = `
        <html>
          <body>
            <script src="https://cdn.utmfy.com/script.js"></script>
            <script>utmfy.init('UTMFY123');</script>
            <p>Content</p>
          </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithUtmfy);

      expect(cleanedHtml).not.toContain('utmfy.com');
      expect(cleanedHtml).not.toContain('utmfy.init');
      expect(cleanedHtml).toContain('<p>Content</p>');
    });

    it('deve preservar conteúdo não relacionado a tracking', () => {
      const htmlWithMixedContent = `
        <html>
          <head>
            <title>Test Page</title>
            <script src="https://cdn.utmfy.com/script.js"></script>
          </head>
          <body>
            <h1>Title</h1>
            <script>
              !function(f,b,e,v,n,t,s){if(f.fbq)return;}
            </script>
            <p>Important content</p>
            <script>
              // Legitimate script
              console.log('This should remain');
            </script>
          </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithMixedContent);

      expect(cleanedHtml).toContain('<title>Test Page</title>');
      expect(cleanedHtml).toContain('<h1>Title</h1>');
      expect(cleanedHtml).toContain('<p>Important content</p>');
      expect(cleanedHtml).toContain('This should remain');
      expect(cleanedHtml).not.toContain('utmfy.com');
      expect(cleanedHtml).not.toContain('fbq');
    });

    it('deve retornar HTML inalterado se não houver tracking codes', () => {
      const cleanHtml = `
        <html>
          <head><title>Clean Page</title></head>
          <body>
            <h1>Title</h1>
            <p>Content</p>
            <script>console.log('legitimate script');</script>
          </body>
        </html>
      `;

      const result = CloneService.cleanTrackingCodes(cleanHtml);
      expect(result).toBe(cleanHtml);
    });
  });

  describe('cleanEditorArtifacts', () => {
    it('remove navigation-blocker e scripts/styles do editor', () => {
      const input = `
        <html data-clonepages-edit="true">
          <head>
            <script id="navigation-blocker">console.log('block');</script>
            <script id="cp-editor-script">/* editor */</script>
            <style id="cp-editor-style">/* styles */</style>
          </head>
          <body class="cp-hover-highlight cp-selected other">
            <div id="cp-help">helper</div>
            <div data-clonepages-editing="true" class="cp-selected x">content</div>
          </body>
        </html>
      `;

      const out = CloneService.cleanEditorArtifacts(input);
      expect(out).not.toContain('navigation-blocker');
      expect(out).not.toContain('cp-editor-script');
      expect(out).not.toContain('cp-editor-style');
      expect(out).not.toContain('id="cp-help"');
      expect(out).not.toContain('data-clonepages-edit=');
      expect(out).not.toContain('data-clonepages-editing');
      // Classes de edição removidas, outras mantidas
      expect(out).toContain('class="other"');
      expect(out).toContain('class="x"');
      expect(out).not.toContain('cp-hover-highlight');
      expect(out).not.toContain('cp-selected');
    });

    it('mantém scripts legítimos', () => {
      const input = `
        <html>
          <head>
            <script id="legit">console.log('ok');</script>
          </head>
          <body>
            <p>content</p>
          </body>
        </html>
      `;
      const out = CloneService.cleanEditorArtifacts(input);
      expect(out).toContain('id="legit"');
      expect(out).toContain('<p>content</p>');
    });

    it('preserva GTM, Facebook, Google Fonts, meta viewport/robots e RSS/Feed', () => {
      const input = `
        <html>
          <head>
            <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"></script>
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"></iframe></noscript>
            <script async src="https://connect.facebook.net/en_US/fbevents.js"></script>
            <script>fbq('init','123');</script>
            <noscript><img src="https://www.facebook.com/tr?id=123&noscript=1" /></noscript>
            <link rel="preload" as="style" href="https://fonts.googleapis.com/css?family=Roboto&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" media="all" onload="this.media='all'">
            <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" /></noscript>
            <link href="https://fonts.gstatic.com/" crossorigin rel="preconnect">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="robots" content="max-image-preview:large">
            <link rel="alternate" type="application/rss+xml" title="Spy Funnels » Feed" href="https://spyfunnels.io/feed/">
            <link rel="alternate" type="application/rss+xml" title="Spy Funnels » Feed de comentários" href="https://spyfunnels.io/comments/feed/">
            <style id="wp-block-library-inline-css">.wp-element-button{cursor:pointer}</style>
          </head>
          <body>
            <p>Content</p>
          </body>
        </html>
      `;

      const out = CloneService.cleanEditorArtifacts(input);
      // Deve preservar tracking legítimo e recursos do site
      expect(out).toContain('googletagmanager.com');
      expect(out).toContain('connect.facebook.net');
      expect(out).toContain('facebook.com/tr');
      expect(out).toContain('fonts.googleapis.com');
      expect(out).toContain('fonts.gstatic.com');
      expect(out).toContain('name="viewport"');
      expect(out).toContain('name="robots"');
      expect(out).toContain('application/rss+xml');
      expect(out).toContain('wp-block-library-inline-css');
      expect(out).toContain('<p>Content</p>');
    });

    it('preserva variações com backticks, espaços e atributos extras nas URLs (GTM, FB, Fonts, preconnect, meta, feeds)', () => {
      const input = `
        <html lang="pt-PT"><head>
          <script async src=" \`https://www.googletagmanager.com/gtm.js?id=GTM-PV7CB6N5\` "></script>
          <script src=" \`https://connect.facebook.net/signals/config/1015847943124592?v=2.9.241&r=stable&domain=localhost\` " async></script>
          <script async src=" \`https://connect.facebook.net/en_US/fbevents.js\` "></script>
          <script id="navigation-blocker">console.log('block');</script>
          <link rel="preload" data-rocket-preload as="style" href=" \`https://fonts.googleapis.com/css?family=Roboto%3A100%2C400%2C700%7CDM%20Sans%3A400%2C700&display=swap\` ">
          <link rel="stylesheet" href=" \`https://fonts.googleapis.com/css?family=Roboto%3A100%2C400%2C700%7CDM%20Sans%3A400%2C700&display=swap\` " media="all" onload="this.media='all'">
          <noscript><link rel="stylesheet" href=" \`https://fonts.googleapis.com/css?family=Roboto%3A100%2C400%2C700%7CDM%20Sans%3A400%2C700&#038;display=swap\` " /></noscript>
          <link href=" \`https://fonts.gstatic.com/\` " crossorigin rel="preconnect">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="robots" content="max-image-preview:large">
          <link rel="alternate" type="application/rss+xml" title="Spy Funnels » Feed" href=" \`https://spyfunnels.io/feed/\` ">
          <link rel="alternate" type="application/rss+xml" title="Spy Funnels » Feed de comentários" href=" \`https://spyfunnels.io/comments/feed/\` ">
          <style id="wp-emoji-styles-inline-css">/* emojis */</style>
          <style id="wp-block-library-inline-css">/* wp core */</style>
        </head>
        <body>
          <p>Ok</p>
        </body>
        </html>
      `;

      const out = CloneService.cleanEditorArtifacts(input);
      // Remove apenas artefatos da ferramenta
      expect(out).not.toContain('navigation-blocker');
      // Preserva tracking legítimo e recursos do site mesmo com variações
      expect(out).toContain('googletagmanager.com');
      expect(out).toContain('connect.facebook.net');
      expect(out).toContain('fbevents.js');
      expect(out).toContain('fonts.googleapis.com');
      expect(out).toContain('fonts.gstatic.com');
      expect(out).toContain('application/rss+xml');
      expect(out).toContain('wp-emoji-styles-inline-css');
      expect(out).toContain('wp-block-library-inline-css');
      expect(out).toContain('name="viewport"');
      expect(out).toContain('name="robots"');
      expect(out).toContain('<p>Ok</p>');
    });
  });
});