import { CloneService } from '../cloneService';

describe('cleanEditorArtifacts preservação de elementos marcados pelo Tuglet', () => {
  it('preserva script do editor quando marcado com data-tuglet="true"', () => {
    const input = `
      <html>
        <head>
          <script id="cp-editor-script" data-tuglet="true">fbq('init','PIX-123');</script>
          <script id="navigation-blocker">console.log('block');</script>
        </head>
        <body>
          <p>content</p>
        </body>
      </html>
    `;
    const out = CloneService.cleanEditorArtifacts(input);
    expect(out).toContain("fbq('");
    // Navigation blocker sem marca Tuglet deve ser removido
    expect(out).not.toContain('navigation-blocker');
  });

  it('preserva estilo do editor quando marcado com data-tuglet="true"', () => {
    const input = `
      <html>
        <head>
          <style id="cp-editor-style" data-tuglet="true">.fixed-whatsapp{position:fixed}</style>
        </head>
        <body>
          <a class="fixed-whatsapp" href="https://wa.me/5588999999999">Whats</a>
        </body>
      </html>
    `;
    const out = CloneService.cleanEditorArtifacts(input);
    expect(out).toContain('.fixed-whatsapp');
    expect(out).toContain('fixed-whatsapp');
  });

  it('preserva elemento de ajuda quando marcado com data-tuglet="true"', () => {
    const input = `
      <html>
        <body>
          <div id="cp-help" data-tuglet="true">assistente</div>
        </body>
      </html>
    `;
    const out = CloneService.cleanEditorArtifacts(input);
    expect(out).toContain('id="cp-help"');
    expect(out).toContain('assistente');
  });

  it('remove artefatos quando não marcados como Tuglet', () => {
    const input = `
      <html data-clonepages-edit="true">
        <head>
          <script id="cp-editor-script">/* editor */</script>
          <style id="cp-editor-style">/* styles */</style>
        </head>
        <body class="cp-hover-highlight">
          <div id="cp-help">helper</div>
          <div data-clonepages-editing="true" class="cp-selected x">content</div>
        </body>
      </html>
    `;
    const out = CloneService.cleanEditorArtifacts(input);
    expect(out).not.toContain('cp-editor-script');
    expect(out).not.toContain('cp-editor-style');
    expect(out).not.toContain('id="cp-help"');
    expect(out).not.toContain('data-clonepages-edit=');
    expect(out).not.toContain('data-clonepages-editing');
    expect(out).not.toContain('cp-hover-highlight');
    expect(out).not.toContain('cp-selected');
    expect(out).toContain('class="x"');
  });
});