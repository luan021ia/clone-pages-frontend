import { CloneService } from '../cloneService';

describe('cleanTrackingCodes com preservação via toggles (Tuglet)', () => {
  it('preserva Meta Pixel quando ativo e pixelId corresponde', () => {
    const html = `
      <html>
        <head>
          <!-- Meta Pixel Code (Tuglet) -->
          <script data-tuglet="true">fbq('init','PIX-123');fbq('track','PageView');</script>
          <script async src="https://connect.facebook.net/en_US/fbevents.js"></script>
        </head>
        <body>
          <noscript><img src="https://www.facebook.com/tr?id=PIX-123&ev=PageView&noscript=1" /></noscript>
          <p>Content</p>
        </body>
      </html>
    `;

    const out = CloneService.cleanTrackingCodes(html, {
      preservePixel: true,
      pixelId: 'PIX-123',
    });
    expect(out).toContain("fbq('");
    expect(out).toContain('facebook.com/tr?id=PIX-123');
  });

  it('remove Meta Pixel quando inativo', () => {
    const html = `
      <html>
        <head>
          <script>fbq('init','PIX-999');</script>
        </head>
        <body>
          <noscript><img src="https://www.facebook.com/tr?id=PIX-999&ev=PageView&noscript=1" /></noscript>
        </body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preservePixel: false });
    expect(out).not.toContain("fbq('");
    expect(out).not.toContain('facebook.com/tr');
  });

  it('preserva Google Tag (gtag) com ID quando ativo', () => {
    const html = `
      <html>
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA-123"></script>
          <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','GA-123');</script>
        </head>
        <body><p>Ok</p></body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preserveGtag: true, gtagId: 'GA-123' });
    expect(out).toContain('gtag(');
    expect(out).toContain('GA-123');
  });

  it('remove Google Tag quando inativo', () => {
    const html = `
      <html>
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA-999"></script>
          <script>gtag('config','GA-999');</script>
        </head>
        <body></body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preserveGtag: false });
    expect(out).not.toContain('gtag(');
    expect(out).not.toContain('googletagmanager.com/gtag');
  });

  it('preserva Microsoft Clarity quando ativo e ID corresponde', () => {
    const html = `
      <html>
        <head>
          <script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/CL-123";})(window,document,"clarity","script","CL-123");</script>
        </head>
        <body></body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preserveClarity: true, clarityId: 'CL-123' });
    expect(out).toContain('clarity.ms/tag/CL-123');
  });

  it('remove Microsoft Clarity quando inativo', () => {
    const html = `
      <html>
        <head>
          <script>(function(c,l,a,r,i,t,y){t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/CL-999";})(window,document,"clarity","script","CL-999");</script>
        </head>
        <body></body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preserveClarity: false });
    expect(out).not.toContain('clarity(');
    expect(out).not.toContain('clarity.ms');
  });

  it('preserva UTMFY quando ativo', () => {
    const html = `
      <html>
        <head>
          <!-- UTMFY -->
          <script>utmfy.init('UT-123');</script>
          <!-- End UTMFY -->
        </head>
        <body></body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preserveUtmfy: true });
    expect(out).toContain('utmfy');
    expect(out).toContain('UT-123');
  });

  it('remove UTMFY quando inativo', () => {
    const html = `
      <html>
        <head>
          <script src="https://cdn.utmfy.com/script.js"></script>
        </head>
        <body></body>
      </html>
    `;
    const out = CloneService.cleanTrackingCodes(html, { preserveUtmfy: false });
    expect(out).not.toContain('utmfy');
    expect(out).not.toContain('cdn.utmfy.com');
  });

  it('remove botão WhatsApp quando toggle inativo e preserva quando ativo', () => {
    const html = `
      <html>
        <body>
          <style>.fixed-whatsapp{position:fixed;right:16px;bottom:16px;}</style>
          <a class="fixed-whatsapp" href="https://wa.me/5588999999999" target="_blank">Whats</a>
        </body>
      </html>
    `;
    const removed = CloneService.cleanTrackingCodes(html, { preserveWhatsApp: false });
    expect(removed).not.toContain('fixed-whatsapp');

    const preserved = CloneService.cleanTrackingCodes(html, { preserveWhatsApp: true });
    expect(preserved).toContain('fixed-whatsapp');
    expect(preserved).toContain('wa.me');
  });
});