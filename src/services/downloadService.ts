export class DownloadService {
  // Conjunto para evitar colisões dentro da sessão atual
  private static generatedSet = new Set<string>();

  /**
   * Gera um nome único usando timestamp + random
   * Padrão: "Clone_Pages-{timestamp}-{random}.html"
   * Isso garante unicidade mesmo após refresh da página
   */
  private static buildUniqueName(): string {
    const timestamp = Date.now(); // Millisecond precision
    const random = Math.floor(Math.random() * 10000); // 0-9999
    const candidate = `Clone_Pages-${timestamp}-${random}.html`;

    // Ainda mantém o Set para evitar duplicatas na mesma sessão (improvável mas possível)
    let finalName = candidate;
    let attempts = 0;
    while (DownloadService.generatedSet.has(finalName) && attempts < 5) {
      const randomRetry = Math.floor(Math.random() * 100000);
      finalName = `Clone_Pages-${timestamp}-${randomRetry}.html`;
      attempts++;
    }

    DownloadService.generatedSet.add(finalName);
    return finalName;
  }

  static downloadHtml(html: string, filename?: string): void {
    try {
      console.log('📥 [DownloadService] Iniciando download');

      const finalName = filename ?? DownloadService.buildUniqueName();

      const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = finalName;
      link.style.display = 'none';
      link.setAttribute('aria-hidden', 'true');

      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('✅ [DownloadService] Download concluído');
      }, 100);
    } catch (error) {
      console.error('❌ [DownloadService] Erro durante download:', error);
      throw new Error(`Failed to download HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gera um nome de arquivo único
   * Padrão: "Clone_Pages-{timestamp}-{random}.html"
   * O parâmetro suffix é ignorado para priorizar consistência de branding
   */
  static generateFilename(_url: string, _suffix: string = ''): string {
    return DownloadService.buildUniqueName();
  }
}