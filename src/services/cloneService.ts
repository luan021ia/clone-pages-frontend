// Importação adiada para evitar problemas de import.meta em ambiente de testes (Jest)

export class CloneService {
  static async requestEditedHtml(contentWindow: Window): Promise<string> {
    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent) => {
        // Aceitar somente mensagens vindas do mesmo contentWindow
        const fromCurrentIframe = event.source === contentWindow;
        if (!fromCurrentIframe) {
          return;
        }

        if (event.data?.source === 'EDITOR_IFRAME' && event.data?.type === 'HTML_CONTENT') {
          window.removeEventListener('message', handleMessage);
          clearTimeout(timeoutId);

          // Sanitizar HTML recebido
          const sanitizedHtml = this.sanitizeHtml(event.data.data);
          console.log('✅ [CloneService] HTML recebido e sanitizado');
          resolve(sanitizedHtml);
        }
      };

      // Timeout de 5 segundos
      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        console.warn('⏰ [CloneService] Timeout ao solicitar HTML');
        resolve('');
      }, 5000);

      window.addEventListener('message', handleMessage);

      // Solicitar HTML do iframe
      console.log('📤 [CloneService] Solicitando HTML do iframe');
      contentWindow.postMessage({
        source: 'EDITOR_PARENT',
        type: 'GET_HTML'
      }, '*');
    });
  }

  // HTML sanitization to prevent XSS attacks
  static sanitizeHtml(html: string): string {
    try {
      // Dynamically import DOMPurify to avoid issues in test environments
      // Use a basic regex sanitization if DOMPurify is not available
      return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
                 .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                 .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    } catch (error) {
      console.error('HTML sanitization error:', error);
      return html;
    }
  }

  // Enhanced HTML sanitization with DOMPurify (client-side)
  static async sanitizeHtmlWithDOMPurify(html: string): Promise<string> {
    try {
      const { default: DOMPurify } = await import('dompurify');

      // Configure DOMPurify to allow data: URLs for images and other necessary attributes
      const config = {
        ALLOWED_TAGS: [
          'a', 'b', 'i', 'em', 'strong', 'p', 'br', 'span', 'div',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
          'table', 'thead', 'tbody', 'tr', 'td', 'th',
          'img', 'video', 'source', 'audio', 'iframe',
          'form', 'input', 'button', 'label', 'textarea', 'select', 'option',
          'style', 'link', 'meta', 'title', 'head', 'html', 'body'
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'class', 'id', 'style',
          'width', 'height', 'data-*', 'aria-*', 'role',
          'name', 'value', 'type', 'placeholder', 'disabled', 'checked',
          'target', 'rel', 'integrity', 'crossorigin'
        ],
        KEEP_CONTENT: true,
        ALLOW_DATA_ATTR: true
      };

      return DOMPurify.sanitize(html, config);
    } catch (error) {
      console.warn('DOMPurify sanitization failed, falling back to basic sanitization:', error);
      return this.sanitizeHtml(html);
    }
  }

  static async getOriginalHtml(url: string, queryParams?: string): Promise<string> {
    try {
      console.log('=== CloneService.getOriginalHtml INICIADO ===');
      console.log('URL:', url);
      console.log('Query params:', queryParams);

      const baseParams: Record<string, string> = { url };
      if (queryParams) {
        // Parse queryParams and merge with base params
        const urlParams = new URLSearchParams(queryParams);
        for (const [key, value] of urlParams.entries()) {
          if (key !== 'url') { // Don't override the main url param
            baseParams[key] = value;
          }
        }
      }
      const { buildApiUrl } = await import('../config/api');
      // ✅ Usar RENDER_PAGE que suporta injeção de códigos customizados
      const requestUrl = buildApiUrl('RENDER_PAGE', baseParams);

      console.log('Request URL completa:', requestUrl);

      const response = await fetch(requestUrl);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        console.error('Response não ok:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      console.log('HTML recebido, tamanho:', html.length);
      console.log('Primeiros 200 caracteres:', html.substring(0, 200));

      // ✅ Validar se os códigos injetados estão presentes quando esperados
      const hasInjectCustom = baseParams.injectCustom === 'true';
      if (hasInjectCustom) {
        console.log('🔍 [getOriginalHtml] Validando códigos injetados:', {
          pixelId: baseParams.pixelId ? (html.includes(baseParams.pixelId) ? '✅' : '❌') : 'N/A',
          gtagId: baseParams.gtagId ? (html.includes(baseParams.gtagId) ? '✅' : '❌') : 'N/A',
          clarityId: baseParams.clarityId ? (html.includes(baseParams.clarityId) ? '✅' : '❌') : 'N/A',
          whatsappNumber: baseParams.whatsappNumber ? (html.includes(baseParams.whatsappNumber) ? '✅' : '❌') : 'N/A',
          utmfyCode: baseParams.utmfyCode ? (html.includes('utmfy') ? '✅' : '❌') : 'N/A',
        });
      }

      return html;
    } catch (error) {
      console.error('=== ERRO no CloneService.getOriginalHtml ===');
      console.error('Erro:', error);
      throw error;
    }
  }

  static cleanTrackingCodes(
    html: string,
    opts?: {
      preservePixel?: boolean;
      preserveGtag?: boolean;
      preserveClarity?: boolean;
      preserveUtmfy?: boolean;
      preserveWhatsApp?: boolean;
      pixelId?: string;
      gtagId?: string;
      clarityId?: string;
    }
  ): string {
    const effective = {
      preservePixel: false,
      preserveGtag: false,
      preserveClarity: false,
      preserveUtmfy: false,
      preserveWhatsApp: false,
      pixelId: '',
      gtagId: '',
      clarityId: '',
      ...(opts || {}),
    };
    let out = html;

    // ✅ SOLUÇÃO 3: Logging detalhado do processo de limpeza
    console.log('🧹 [cleanTrackingCodes] Iniciando limpeza com opções:', {
      preservePixel: effective.preservePixel,
      preserveGtag: effective.preserveGtag,
      preserveClarity: effective.preserveClarity,
      preserveUtmfy: effective.preserveUtmfy,
      preserveWhatsApp: effective.preserveWhatsApp,
      pixelId: effective.pixelId ? '***' : undefined,
      gtagId: effective.gtagId ? '***' : undefined,
      clarityId: effective.clarityId ? '***' : undefined,
    });

    // Processar <script> blocks: decide remoção/preservação por serviço
    out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) => {
      const lower = tag.toLowerCase();
      const tugletMarked = /data-tuglet=("|')true\1/i.test(tag);
      const srcMatch = tag.match(/\bsrc=("|')(.*?)\1/i);
      const src = (srcMatch ? srcMatch[2] : '').toLowerCase();

      // Facebook Pixel
      if (lower.includes('fbq(') || src.includes('connect.facebook.net')) {
        const matchesPixelId = effective.pixelId && tag.includes(effective.pixelId!);
        if (effective.preservePixel && (matchesPixelId || tugletMarked)) return tag;
        return '';
      }

      // Google Tag (gtag)
      if (src.includes('googletagmanager.com/gtag/js') || /\bgtag\s*\(/i.test(tag)) {
        const matchesGtagId = effective.gtagId && tag.includes(effective.gtagId!);
        if (effective.preserveGtag && (matchesGtagId || tugletMarked)) return tag;
        return '';
      }

      // Google Tag Manager (GTM) container
      if (src.includes('googletagmanager.com/gtm.js')) {
        if (effective.preserveGtag) return tag;
        return '';
      }

      // Microsoft Clarity
      if (src.includes('clarity.ms') || /\bclarity\s*\(/i.test(tag)) {
        const matchesClarityId = effective.clarityId && tag.includes(effective.clarityId!);
        if (effective.preserveClarity && (matchesClarityId || tugletMarked)) return tag;
        return '';
      }

      // UTMFY
      if (lower.includes('utmfy') || src.includes('utmfy')) {
        if (effective.preserveUtmfy || tugletMarked) return tag;
        return '';
      }

      return tag; // outros scripts permanecem
    });

    // Processar <noscript>: GTM iframe e Pixel img
    out = out.replace(/<noscript>[\s\S]*?<\/noscript>/gi, (tag) => {
      const lower = tag.toLowerCase();
      // GTM
      if (lower.includes('googletagmanager.com/ns.html')) {
        if (effective.preserveGtag) return tag;
        return '';
      }
      // Facebook Pixel
      if (lower.includes('facebook.com/tr')) {
        const matchesPixelId = effective.pixelId && tag.includes(effective.pixelId!);
        if (effective.preservePixel && matchesPixelId) return tag;
        return '';
      }
      return tag;
    });

    // WhatsApp: link e estilo
    if (!effective.preserveWhatsApp) {
      out = out.replace(/<a\b[^>]*class=("|')[^"']*\bfixed-whatsapp\b[^"']*\1[\s\S]*?<\/a>/gi, '');
      out = out.replace(/<style\b[^>]*>[\s\S]*?\.fixed-whatsapp[\s\S]*?<\/style>/gi, '');
    }

    // Remover blocos comentados se toggles inativos
    if (!effective.preserveGtag) {
      out = out.replace(/<!--\s*Google Analytics\s*-->[\s\S]*?<!--\s*End Google Analytics\s*-->/gi, '');
    }
    if (!effective.preservePixel) {
      out = out.replace(/<!--\s*Facebook Pixel\s*-->[\s\S]*?<!--\s*End Facebook Pixel\s*-->/gi, '');
    }
    if (!effective.preserveClarity) {
      out = out.replace(/<!--\s*Microsoft Clarity\s*-->[\s\S]*?<!--\s*End Microsoft Clarity\s*-->/gi, '');
    }
    if (!effective.preserveUtmfy) {
      out = out.replace(/<!--\s*UTMFY\s*-->[\s\S]*?<!--\s*End UTMFY\s*-->/gi, '');
    }

    // ✅ SOLUÇÃO 3: Validação PÓS-LIMPEZA
    // Verificar se os códigos que deveriam ser preservados ainda estão presentes
    const pixelPreservedCorrectly = !effective.preservePixel || !effective.pixelId || out.includes(effective.pixelId);
    const gtagPreservedCorrectly = !effective.preserveGtag || !effective.gtagId || out.includes(effective.gtagId);
    const clarityPreservedCorrectly = !effective.preserveClarity || !effective.clarityId || out.includes(effective.clarityId);

    console.log('✅ [cleanTrackingCodes] Limpeza concluída. Validação pós-limpeza:', {
      pixelPreserved: pixelPreservedCorrectly,
      gtagPreserved: gtagPreservedCorrectly,
      clarityPreserved: clarityPreservedCorrectly,
      htmlSizeOriginal: html.length,
      htmlSizeAfter: out.length,
      bytesRemoved: html.length - out.length,
    });

    return out;
  }

  /**
   * Limpa artefatos do editor/bloqueio para gerar HTML final somente com o essencial.
   * Remove:
   * - Script de bloqueio de navegação (navigation-blocker)
   * - Scripts e estilos do editor (ids começando com cp-)
   * - Elementos de ajuda/overlay (#cp-help)
   * - Classes de edição (cp-hover-highlight, cp-selected)
   * - Atributos de edição (data-clonepages-edit, data-clonepages-editing)
   * - Comentários específicos de ferramenta
   */
  /**
   * 🎥 Normaliza todos os iframes para suportar múltiplos players
   * Remove atributos inválidos e adiciona os corretos para cada tipo
   */
  static normalizeIframes(html: string): string {
    // Regex para encontrar iframes
    const iframeRegex = /<iframe[^>]*>[\s\S]*?<\/iframe>/gi;

    return html.replace(iframeRegex, (iframeMatch) => {
      // Extrair atributos (EXCETO sandbox que será removido)
      const srcMatch = iframeMatch.match(/\ssrc=["']([^"']+)["']/i);
      const idMatch = iframeMatch.match(/\sid=["']([^"']+)["']/i);
      const styleMatch = iframeMatch.match(/\sstyle=["']([^"']+)["']/i);
      const classMatch = iframeMatch.match(/\sclass=["']([^"']+)["']/i);
      const titleMatch = iframeMatch.match(/\stitle=["']([^"']+)["']/i);

      const src = srcMatch ? srcMatch[1] : '';
      const id = idMatch ? idMatch[1] : '';
      const style = styleMatch ? styleMatch[1] : '';
      const className = classMatch ? classMatch[1] : '';
      const title = titleMatch ? titleMatch[1] : '';

      // Detectar tipo de player
      const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');
      const isVimeo = src.includes('vimeo.com');
      const isPandavideo = src.includes('pandavideo') || src.includes('player-vz-');
      const isWistia = src.includes('wistia');
      const isBrightcove = src.includes('brightcove');
      const isJwplayer = src.includes('jwplayer');
      const isKaltura = src.includes('kaltura');

      // Atributos base obrigatórios para todos os iframes
      let attributes = `iframe id="${id || 'video-iframe'}" src="${src}" style="${style}" `;

      if (className) {
        attributes += `class="${className}" `;
      }

      // Atributos padrão seguros para todos os players
      attributes += `frameborder="0" `;
      attributes += `allow="accelerometer;autoplay;clipboard-write;encrypted-media;fullscreen;gyroscope;picture-in-picture;web-share" `;
      attributes += `allowfullscreen `;
      attributes += `loading="lazy" `;
      attributes += `width="100%" `;
      attributes += `height="100%" `;

      // Atributos específicos por player
      if (isYoutube) {
        attributes += `data-player-type="youtube" `;
      } else if (isVimeo) {
        attributes += `data-player-type="vimeo" `;
      } else if (isPandavideo) {
        attributes += `data-player-type="pandavideo" `;
      } else if (isWistia) {
        attributes += `data-player-type="wistia" `;
      } else if (isBrightcove) {
        attributes += `data-player-type="brightcove" `;
      } else if (isJwplayer) {
        attributes += `data-player-type="jwplayer" `;
      } else if (isKaltura) {
        attributes += `data-player-type="kaltura" `;
      } else {
        attributes += `data-player-type="generic" `;
      }

      // Remover atributos problemáticos/inválidos
      // - fetchpriority não é válido em iframe (apenas em img, link, script)
      // - onload, onerror já são capturados no loading="lazy"
      // - sandbox é DELIBERADAMENTE REMOVIDO pois causa YouTube Error 153 e bloqueia players
      //   mesmo que existisse no HTML original, não será preservado

      if (title) {
        attributes += `title="${title}"`;
      }

      return `<${attributes}></iframe>`;
    });
  }

  static cleanEditorArtifacts(html: string, policy?: {
    preserveGTM?: boolean;
    preserveFacebookPixel?: boolean;
    preserveGoogleFonts?: boolean;
    preserveMetaViewport?: boolean;
    preserveMetaRobots?: boolean;
    preserveRSSFeeds?: boolean;
    removeToolArtifacts?: boolean;
  }): string {
    const effective = {
      preserveGTM: true,
      preserveFacebookPixel: true,
      preserveGoogleFonts: true,
      preserveMetaViewport: true,
      preserveMetaRobots: true,
      preserveRSSFeeds: true,
      removeToolArtifacts: true,
      ...(policy || {}),
    };

    let out = html;

    console.log('🧹 [cleanEditorArtifacts] Limpando artefatos do editor...');

    // ✅ REMOVER OVERLAYS DE IFRAMES (adicionados no modo edição)
    out = out.replace(/<div[^>]*class=["'][^"']*cp-iframe-overlay[^"']*["'][^>]*><\/div>/gi, '');
    out = out.replace(/<div[^>]*data-cp-iframe-id=["'][^"']*["'][^>]*><\/div>/gi, '');
    console.log('🎥 [cleanEditorArtifacts] Overlays de iframe removidos');

    // ✅ REMOVER ATRIBUTOS DE CONTROLE DO EDITOR
    out = out.replace(/\sdata-cp-disabled=["']true["']/gi, '');
    out = out.replace(/\sdata-cp-overlay-added=["']true["']/gi, '');
    out = out.replace(/\sdata-cp-original-position=["'][^"']*["']/gi, '');
    console.log('🔧 [cleanEditorArtifacts] Atributos de controle removidos');

    // 🎥 Normalizar iframes PRIMEIRO (antes de outras limpezas)
    out = CloneService.normalizeIframes(out);

    // Heurística para detectar marcações do Tuglet e preservar
    const isTugletTag = (tag: string): boolean => {
      const lower = tag.toLowerCase();
      if (/data-tuglet=("|')true\1/i.test(tag)) return true;
      if (/\bid=("|')[^"']*tuglet[^"']*\1/i.test(tag)) return true;
      if (/\bclass=("|')[^"']*tuglet[^"']*\1/i.test(tag)) return true;
      // Comentários indicando injeção pelo Tuglet
      if (/<!--[\s\S]*tuglet[\s\S]*-->/i.test(tag)) return true;
      if (lower.includes('meta pixel code (tuglet)')) return true;
      return false;
    };

    // 🔧 FIX #4: Remover script de bloqueio de navegação
    out = out.replace(/<script[^>]*id=["']navigation-blocker["'][^>]*>[\s\S]*?<\/script>/gi, (m) => (isTugletTag(m) ? m : ''));

    // Remover script de silenciamento de console (não deve estar no download final)
    out = out.replace(/<script[^>]*id=["']cp-console-silence["'][^>]*>[\s\S]*?<\/script>/gi, (m) => (isTugletTag(m) ? m : ''));

    if (effective.removeToolArtifacts) {
      // Remover scripts do editor
      out = out.replace(/<script[^>]*id=["']cp-editor-script["'][^>]*>[\s\S]*?<\/script>/gi, (m) => (isTugletTag(m) ? m : ''));
      out = out.replace(/<script[^>]*id=["']anti-loop-protection["'][^>]*>[\s\S]*?<\/script>/gi, (m) => (isTugletTag(m) ? m : ''));
      out = out.replace(/<script[^>]*id=["']cp-[^"']+["'][^>]*>[\s\S]*?<\/script>/gi, (m) => (isTugletTag(m) ? m : ''));

      // Remover estilos do editor
      out = out.replace(/<style[^>]*id=["']cp-editor-style["'][^>]*>[\s\S]*?<\/style>/gi, (m) => (isTugletTag(m) ? m : ''));
      out = out.replace(/<style[^>]*id=["']cp-[^"']+["'][^>]*>[\s\S]*?<\/style>/gi, (m) => (isTugletTag(m) ? m : ''));

      // 🔧 FIX #3: Remover CSS de overlay de vídeo
      out = out.replace(/<style[^>]*>[\s\S]*?\.cp-video-overlay[\s\S]*?<\/style>/gi, (m) => (isTugletTag(m) ? m : ''));

      // 🔧 FIX #5: Remover divs de overlay inline com z-index: 999998 (bloqueadores de vídeo)
      // Estes divs têm inline styles e bloqueiam cliques/play em vídeos
      // Permite atributos antes de style (como data-cp-video-iframe-id)
      out = out.replace(/<div[^>]*data-cp-video-iframe-id[^>]*><\/div>/gi, '');

      // Fallback: remover divs com z-index 999998 (em caso de variações na ordem dos atributos)
      out = out.replace(/<div[^>]*style="[^"]*z-index:\s*999998[^"]*"[^>]*><\/div>/gi, '');
      out = out.replace(/<div[^>]*style='[^']*z-index:\s*999998[^']*'[^>]*><\/div>/gi, '');

      // Remover atributo data-cp-video-overlay-created (marcador de iframe com overlay)
      out = out.replace(/\sdata-cp-video-overlay-created(=["'][^"']*["'])?/gi, '');
    }

    if (effective.removeToolArtifacts) {
      // Remover elemento de ajuda
      out = out.replace(/<[^>]*id=["']cp-help["'][^>]*>[\s\S]*?<\/[a-zA-Z0-9]+>/gi, (m) => (isTugletTag(m) ? m : ''));
    }

    if (effective.removeToolArtifacts) {
      // 🔧 FIX #2: Remover classes de edição das tags (sem parser: substituição simples)
      out = out.replace(/\sclass=(["'])((?:(?!\1).)*?)\1/gi, (_m, q, classes) => {
        const filtered = classes
          .split(/\s+/)
          .filter((c: string) => c && c !== 'cp-hover-highlight' && c !== 'cp-selected' && c !== 'cp-video-overlay')
          .join(' ');
        return filtered ? ` class=${q}${filtered}${q}` : '';
      });
    }

    if (effective.removeToolArtifacts) {
      // Remover atributos de edição do html e de elementos
      out = out.replace(/\sdata-clonepages-edit(=["'][^"']*["'])?/gi, '');
      out = out.replace(/\sdata-clonepages-editing(=["'][^"']*["'])?/gi, '');
      
      // ✅ REMOVER ATRIBUTOS DE CONTROLE DO EDITOR
      out = out.replace(/\sdata-cp-prepared=["']true["']/gi, '');
      out = out.replace(/\sdata-cp-overlay-added=["']true["']/gi, '');
      out = out.replace(/\sdata-cp-original-position=["'][^"']*["']/gi, '');
      out = out.replace(/\sdata-cp-iframe-id=["'][^"']*["']/gi, '');
      
      console.log('✅ [cleanEditorArtifacts] Atributos de edição removidos');
    }

    if (effective.removeToolArtifacts) {
      // Remover comentários específicos da ferramenta
      out = out.replace(/<!--\s*This website is like a Rocket[\s\S]*?-->\s*/gi, '');
    }

    return out;
  }
}