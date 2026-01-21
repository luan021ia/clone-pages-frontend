// Plugin do Vite para corrigir MIME types no HTML
export default function fixMimeTypes() {
  return {
    name: 'fix-mime-types',
    generateBundle(options, bundle) {
      // Encontrar o arquivo index.html
      const htmlFile = bundle['index.html'];
      if (htmlFile && htmlFile.type === 'asset') {
        let html = htmlFile.source;
        
        // Substituir referências a arquivos JS para garantir type="module"
        html = html.replace(
          /<script([^>]*?)src="([^"]*\.js)"([^>]*?)>/g,
          (match, before, src, after) => {
            if (!match.includes('type=')) {
              return `<script${before}type="module" src="${src}"${after}>`;
            }
            return match;
          }
        );
        
        htmlFile.source = html;
      }
    }
  };
}
