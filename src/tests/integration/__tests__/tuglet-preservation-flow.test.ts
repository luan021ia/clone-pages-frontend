import { CloneService } from '../../../services/cloneService';

describe('Fluxo de integração: preservação completa do Tuglet no download', () => {
  it('mantém todos os códigos Tuglet e remove apenas artefatos do editor', () => {
    const html = `
      <!doctype html>
      <html lang="pt-br" data-clonepages-edit="true">
        <head>
          <!-- Meta Pixel Code (Tuglet) -->
          <script data-tuglet="true">fbq('init','PIX-777');fbq('track','PageView');</script>
          <script async src="https://connect.facebook.net/en_US/fbevents.js"></script>

          <!-- Google Tag (gtag) -->
          <script data-tuglet="true" async src="https://www.googletagmanager.com/gtag/js?id=G-ABCD1234"></script>
          <script data-tuglet="true">window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-ABCD1234');</script>

          <!-- GTM -->
          <script data-tuglet="true" async src="https://www.googletagmanager.com/gtm.js?id=GTM-ABCD"></script>
          <noscript data-tuglet="true"><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-ABCD" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

          <!-- Microsoft Clarity -->
          <script data-tuglet="true">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/CL-777";})(window,document,"clarity","script","CL-777");</script>

          <!-- UTMFY -->
          <script data-tuglet="true">(function(){console.log('utmfy init')})();</script>

          <!-- Artefatos da ferramenta -->
          <script id="navigation-blocker">console.log('block');</script>
          <script id="cp-editor-script">/* editor */</script>
          <style id="cp-editor-style">.tmp{color:red}</style>
        </head>
        <body class="cp-hover-highlight cp-selected other">
          <div id="cp-help">helper</div>
          <div data-clonepages-editing="true" class="cp-selected x">content</div>

          <!-- Botão WhatsApp Tuglet -->
          <style data-tuglet="true">.fixed-whatsapp{position:fixed;right:16px;bottom:16px;}</style>
          <a data-tuglet="true" class="fixed-whatsapp" href="https://wa.me/5588999999999" target="_blank">Whats</a>

          <p>Conteúdo importante</p>
        </body>
      </html>
    `;

    const cleaned = CloneService.cleanEditorArtifacts(html);

    // Preservações Tuglet
    expect(cleaned).toContain("fbq('");
    expect(cleaned).toContain('connect.facebook.net');
    expect(cleaned).toContain('googletagmanager.com/gtag/js?id=G-ABCD1234');
    expect(cleaned).toContain("gtag('config', 'G-ABCD1234')");
    expect(cleaned).toContain('googletagmanager.com/gtm.js?id=GTM-ABCD');
    expect(cleaned).toContain('googletagmanager.com/ns.html?id=GTM-ABCD');
    expect(cleaned).toContain('clarity.ms/tag/CL-777');
    expect(cleaned).toContain('utmfy');
    expect(cleaned).toContain('fixed-whatsapp');
    expect(cleaned).toContain('wa.me');

    // Remoções de artefatos da ferramenta
    expect(cleaned).not.toContain('navigation-blocker');
    expect(cleaned).not.toContain('id="cp-editor-script"');
    expect(cleaned).not.toContain('id="cp-editor-style"');
    expect(cleaned).not.toContain('id="cp-help"');
    expect(cleaned).not.toContain('data-clonepages-edit=');
    expect(cleaned).not.toContain('data-clonepages-editing');
    expect(cleaned).not.toContain('cp-hover-highlight');
    expect(cleaned).not.toContain('cp-selected');

    // Conteúdo do site permanece
    expect(cleaned).toContain('<p>Conteúdo importante</p>');
  });
});