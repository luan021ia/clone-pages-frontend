import { CloneService } from '../../services/cloneService';

// Mock do fetch para simular respostas reais
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Real URL Cloning Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Amazon Cloning', () => {
    const amazonUrl = 'https://www.amazon.com';

    it('deve clonar página principal da Amazon', async () => {
      const mockAmazonHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Amazon.com: Online Shopping</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="/styles/main.css">
          <script src="https://www.googletagmanager.com/gtag/js?id=GA-123456"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', 'GA-123456');
          </script>
        </head>
        <body>
          <header id="navbar">
            <div class="nav-logo">
              <img src="/images/amazon-logo.png" alt="Amazon">
            </div>
            <div class="nav-search">
              <input type="text" placeholder="Search Amazon">
              <button>Search</button>
            </div>
          </header>
          <main>
            <section class="hero-banner">
              <img src="/images/hero-banner.jpg" alt="Deals">
              <h1>Great deals on Amazon</h1>
            </section>
            <section class="products">
              <div class="product-card">
                <img src="/images/product1.jpg" alt="Product 1">
                <h3>Product 1</h3>
                <span class="price">$29.99</span>
              </div>
            </section>
          </main>
          <footer>
            <p>&copy; 2024 Amazon.com</p>
          </footer>
          <!-- Facebook Pixel -->
          <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '123456789');
            fbq('track', 'PageView');
          </script>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockAmazonHtml),
      });

      const result = await CloneService.getOriginalHtml(amazonUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/download-html?url=' + encodeURIComponent(amazonUrl)
      );
      expect(result).toContain('Amazon.com: Online Shopping');
      expect(result).toContain('Great deals on Amazon');
    });

    it('deve limpar códigos de rastreamento da Amazon', () => {
      const amazonHtmlWithTracking = `
        <html>
        <head>
          <script src="https://www.googletagmanager.com/gtag/js?id=GA-AMAZON123"></script>
          <script>
            gtag('config', 'GA-AMAZON123');
          </script>
        </head>
        <body>
          <h1>Amazon Store</h1>
          <script>
            fbq('init', 'AMAZON_PIXEL_ID');
            fbq('track', 'PageView');
          </script>
          <script type="text/javascript">
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "AMAZON_CLARITY");
          </script>
        </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(amazonHtmlWithTracking);

      expect(cleanedHtml).not.toContain('GA-AMAZON123');
      expect(cleanedHtml).not.toContain('AMAZON_PIXEL_ID');
      expect(cleanedHtml).not.toContain('AMAZON_CLARITY');
      expect(cleanedHtml).toContain('Amazon Store'); // Conteúdo principal mantido
    });

    it('deve converter URLs relativas da Amazon para absolutas', async () => {
      const amazonHtmlWithRelativeUrls = `
        <html>
        <head>
          <link rel="stylesheet" href="/styles/amazon-main.css">
          <link rel="icon" href="/favicon.ico">
        </head>
        <body>
          <img src="/images/amazon-logo.png" alt="Amazon">
          <img src="./products/bestseller.jpg" alt="Bestseller">
          <a href="/departments/electronics">Electronics</a>
          <script src="/js/amazon-app.js"></script>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(amazonHtmlWithRelativeUrls),
      });

      const result = await CloneService.getOriginalHtml(amazonUrl);

      expect(result).toContain('https://www.amazon.com/styles/amazon-main.css');
      expect(result).toContain('https://www.amazon.com/favicon.ico');
      expect(result).toContain('https://www.amazon.com/images/amazon-logo.png');
      expect(result).toContain('https://www.amazon.com/products/bestseller.jpg');
      expect(result).toContain('https://www.amazon.com/departments/electronics');
      expect(result).toContain('https://www.amazon.com/js/amazon-app.js');
    });
  });

  describe('Google Cloning', () => {
    const googleUrl = 'https://www.google.com';

    it('deve clonar página principal do Google', async () => {
      const mockGoogleHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Google</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/styles/google.css">
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA-GOOGLE123"></script>
        </head>
        <body>
          <div class="header">
            <a href="/gmail">Gmail</a>
            <a href="/images">Images</a>
          </div>
          <main class="main-content">
            <div class="logo-container">
              <img src="/images/google-logo.png" alt="Google" class="logo">
            </div>
            <div class="search-container">
              <form action="/search" method="GET">
                <input type="text" name="q" class="search-input" autocomplete="off">
                <div class="search-buttons">
                  <input type="submit" value="Google Search" class="search-btn">
                  <input type="submit" value="I'm Feeling Lucky" class="lucky-btn">
                </div>
              </form>
            </div>
          </main>
          <footer class="footer">
            <div class="footer-content">
              <a href="/about">About</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </footer>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockGoogleHtml),
      });

      const result = await CloneService.getOriginalHtml(googleUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/download-html?url=' + encodeURIComponent(googleUrl)
      );
      expect(result).toContain('<title>Google</title>');
      expect(result).toContain('search-container');
      expect(result).toContain('Google Search');
      expect(result).toContain("I'm Feeling Lucky");
    });

    it('deve preservar funcionalidade de busca do Google', () => {
      const googleSearchHtml = `
        <html>
        <body>
          <form action="/search" method="GET" id="search-form">
            <input type="text" name="q" id="search-input" placeholder="Search Google">
            <button type="submit">Search</button>
          </form>
          <script>
            document.getElementById('search-form').addEventListener('submit', function(e) {
              const query = document.getElementById('search-input').value;
              if (!query.trim()) {
                e.preventDefault();
                alert('Please enter a search term');
              }
            });
          </script>
        </body>
        </html>
      `;

      const sanitizedHtml = CloneService.sanitizeHtml(googleSearchHtml);

      expect(sanitizedHtml).toContain('action="/search"');
      expect(sanitizedHtml).toContain('name="q"');
      expect(sanitizedHtml).toContain('search-form');
      expect(sanitizedHtml).toContain('addEventListener');
    });

    it('deve lidar com Google Analytics específico do Google', () => {
      const googleHtmlWithGA = `
        <html>
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA-GOOGLE123"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA-GOOGLE123', {
              page_title: 'Google Homepage',
              page_location: 'https://www.google.com'
            });
          </script>
        </head>
        <body>
          <h1>Google Search</h1>
        </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(googleHtmlWithGA);

      expect(cleanedHtml).not.toContain('GA-GOOGLE123');
      expect(cleanedHtml).not.toContain('googletagmanager.com');
      expect(cleanedHtml).not.toContain('gtag(');
      expect(cleanedHtml).toContain('Google Search'); // Conteúdo principal mantido
    });
  });

  describe('YouTube Cloning', () => {
    const youtubeUrl = 'https://www.youtube.com';

    it('deve clonar página principal do YouTube', async () => {
      const mockYouTubeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>YouTube</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="/styles/youtube.css">
          <script src="/js/youtube-app.js"></script>
        </head>
        <body>
          <header class="header">
            <div class="header-start">
              <button class="menu-button">☰</button>
              <div class="logo">
                <img src="/images/youtube-logo.svg" alt="YouTube">
              </div>
            </div>
            <div class="header-center">
              <form class="search-form">
                <input type="text" placeholder="Search" class="search-input">
                <button type="submit" class="search-button">🔍</button>
              </form>
            </div>
            <div class="header-end">
              <button class="create-button">Create</button>
              <button class="notifications">🔔</button>
              <div class="user-avatar">👤</div>
            </div>
          </header>
          <main class="main-content">
            <aside class="sidebar">
              <nav class="nav-menu">
                <a href="/feed/trending">Trending</a>
                <a href="/feed/subscriptions">Subscriptions</a>
                <a href="/feed/library">Library</a>
              </nav>
            </aside>
            <div class="video-grid">
              <div class="video-card">
                <div class="video-thumbnail">
                  <img src="/thumbnails/video1.jpg" alt="Video 1">
                  <span class="video-duration">10:30</span>
                </div>
                <div class="video-info">
                  <h3 class="video-title">Amazing Video Title</h3>
                  <p class="video-channel">Channel Name</p>
                  <p class="video-stats">1M views • 2 days ago</p>
                </div>
              </div>
            </div>
          </main>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockYouTubeHtml),
      });

      const result = await CloneService.getOriginalHtml(youtubeUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/download-html?url=' + encodeURIComponent(youtubeUrl)
      );
      expect(result).toContain('<title>YouTube</title>');
      expect(result).toContain('video-grid');
      expect(result).toContain('Amazing Video Title');
      expect(result).toContain('search-form');
    });

    it('deve preservar estrutura de vídeos do YouTube', () => {
      const youtubeVideoHtml = `
        <html>
        <body>
          <div class="video-container">
            <video controls poster="/thumbnail.jpg">
              <source src="/video.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <div class="video-actions">
              <button class="like-button">👍 Like</button>
              <button class="dislike-button">👎 Dislike</button>
              <button class="share-button">Share</button>
              <button class="save-button">Save</button>
            </div>
            <div class="video-description">
              <h1>Video Title</h1>
              <p>Video description content...</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const sanitizedHtml = CloneService.sanitizeHtml(youtubeVideoHtml);

      expect(sanitizedHtml).toContain('<video controls');
      expect(sanitizedHtml).toContain('poster="/thumbnail.jpg"');
      expect(sanitizedHtml).toContain('like-button');
      expect(sanitizedHtml).toContain('video-description');
    });

    it('deve converter URLs de thumbnails do YouTube', async () => {
      const youtubeHtmlWithThumbnails = `
        <html>
        <body>
          <div class="video-list">
            <div class="video-item">
              <img src="/vi/abc123/maxresdefault.jpg" alt="Thumbnail 1">
              <img src="./thumbnails/video2.jpg" alt="Thumbnail 2">
            </div>
            <div class="channel-avatar">
              <img src="/channel/UC123/avatar.jpg" alt="Channel">
            </div>
          </div>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(youtubeHtmlWithThumbnails),
      });

      const result = await CloneService.getOriginalHtml(youtubeUrl);

      expect(result).toContain('https://www.youtube.com/vi/abc123/maxresdefault.jpg');
      expect(result).toContain('https://www.youtube.com/thumbnails/video2.jpg');
      expect(result).toContain('https://www.youtube.com/channel/UC123/avatar.jpg');
    });

    it('deve remover rastreamento específico do YouTube', () => {
      const youtubeHtmlWithTracking = `
        <html>
        <head>
          <script>
            window.ytplayer = {};
            window.ytplayer.config = {
              args: {
                'c': 'WEB',
                'cver': '2.20240101',
                'tracking_params': 'abc123'
              }
            };
          </script>
          <script src="https://www.google-analytics.com/analytics.js"></script>
        </head>
        <body>
          <h1>YouTube Video</h1>
          <script>
            ga('create', 'UA-YOUTUBE123', 'auto');
            ga('send', 'pageview');
          </script>
        </body>
        </html>
      `;

      const cleanedHtml = CloneService.cleanTrackingCodes(youtubeHtmlWithTracking);

      expect(cleanedHtml).not.toContain('google-analytics.com');
      expect(cleanedHtml).not.toContain('UA-YOUTUBE123');
      expect(cleanedHtml).not.toContain("ga('create'");
      expect(cleanedHtml).toContain('YouTube Video'); // Conteúdo principal mantido
      expect(cleanedHtml).toContain('window.ytplayer'); // Funcionalidade do player mantida
    });
  });

  describe('Error Handling for Real URLs', () => {
    it('deve lidar com erro 404 da Amazon', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Page not found'),
      });

      await expect(CloneService.getOriginalHtml('https://www.amazon.com/nonexistent'))
        .rejects.toThrow('HTTP error! status: 404');
    });

    it('deve lidar com erro de rede para Google', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(CloneService.getOriginalHtml('https://www.google.com'))
        .rejects.toThrow('Network error');
    });

    it('deve lidar com timeout para YouTube', async () => {
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(CloneService.getOriginalHtml('https://www.youtube.com'))
        .rejects.toThrow('Request timeout');
    });

    it('deve lidar com HTML malformado', () => {
      const malformedHtml = `
        <html>
        <head>
          <title>Malformed HTML
        <body>
          <div class="unclosed-div">
            <p>Paragraph without closing tag
            <img src="image.jpg" alt="No closing bracket"
        </html>
      `;

      // Deve não lançar erro e retornar HTML sanitizado
      expect(() => CloneService.sanitizeHtml(malformedHtml)).not.toThrow();
      const result = CloneService.sanitizeHtml(malformedHtml);
      expect(result).toContain('Malformed HTML');
      expect(result).toContain('Paragraph without closing tag');
    });
  });

  describe('Performance Tests', () => {
    it('deve processar HTML grande da Amazon em tempo razoável', async () => {
      const largeAmazonHtml = `
        <html>
        <head><title>Amazon</title></head>
        <body>
          ${'<div class="product">Product</div>'.repeat(1000)}
          <script>
            ${'console.log("tracking");'.repeat(100)}
          </script>
        </body>
        </html>
      `;

      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(largeAmazonHtml),
      });

      const startTime = Date.now();
      const result = await CloneService.getOriginalHtml('https://www.amazon.com');
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(5000); // Menos de 5 segundos
      expect(result).toContain('<title>Amazon</title>');
      expect(result.split('Product').length - 1).toBe(1000); // Todos os produtos preservados
    });

    it('deve limpar códigos de rastreamento rapidamente', () => {
      const htmlWithManyTrackingCodes = `
        <html>
        <head>
          ${Array.from({length: 50}, (_, i) => 
            `<script src="https://www.googletagmanager.com/gtag/js?id=GA-${i}"></script>`
          ).join('\n')}
        </head>
        <body>
          <h1>Content</h1>
          ${Array.from({length: 50}, (_, i) => 
            `<script>fbq('init', 'PIXEL_${i}');</script>`
          ).join('\n')}
        </body>
        </html>
      `;

      const startTime = Date.now();
      const cleanedHtml = CloneService.cleanTrackingCodes(htmlWithManyTrackingCodes);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Menos de 1 segundo
      expect(cleanedHtml).toContain('<h1>Content</h1>');
      expect(cleanedHtml).not.toContain('googletagmanager.com');
      expect(cleanedHtml).not.toContain('fbq(');
    });
  });
});