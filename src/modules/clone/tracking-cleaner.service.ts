import { Injectable } from '@nestjs/common';

interface CleaningStats {
  metaPixels: number;
  analyticsScripts: number;
  trackingScripts: number;
  webhooks: number;
}

/**
 * 🎯 SERVIÇO DE LIMPEZA CIRÚRGICA DE TRACKING CODES
 *
 * Remove APENAS códigos de rastreamento puros, preservando:
 * - CSS (100%)
 * - JavaScript funcional
 * - Elementor, WordPress, WooCommerce
 * - Imagens, fonts, recursos visuais
 *
 * Abordagem: Identificação precisa por padrões específicos, não por domínios inteiros
 */
@Injectable()
export class TrackingCleanerService {
  /**
   * 🎯 LIMPEZA PRINCIPAL - Coordena todas as camadas de limpeza cirúrgica
   */
  cleanTrackingCodes(html: string, stats: CleaningStats): string {
    console.log('\n🔬 ========== LIMPEZA CIRÚRGICA DE TRACKING CODES ==========');

    let cleanedHtml = html;

    // CAMADA 1: Remover blocos comentados de tracking
    cleanedHtml = this.removeCommentedTrackingBlocks(cleanedHtml, stats);

    // CAMADA 2: Remover chamadas específicas de pixel/analytics
    cleanedHtml = this.removeTrackingFunctionCalls(cleanedHtml, stats);

    // CAMADA 3: Remover scripts ESPECÍFICOS de tracking (URLs exatas)
    cleanedHtml = this.removeSpecificTrackingScripts(cleanedHtml, stats);

    // CAMADA 4: Remover meta tags de verificação/tracking
    cleanedHtml = this.removeTrackingMetaTags(cleanedHtml, stats);

    // CAMADA 5: Remover noscript de tracking (Facebook Pixel img, GTM iframe)
    cleanedHtml = this.removeTrackingNoscript(cleanedHtml, stats);

    // CAMADA 6: Remover configurações e variáveis de tracking isoladas
    cleanedHtml = this.removeTrackingVariables(cleanedHtml, stats);

    // CAMADA 7: 🛡️ Remover scripts maliciosos (redirecionamentos, anti-clone, etc.)
    cleanedHtml = this.removeMaliciousScripts(cleanedHtml, stats);

    // CAMADA 8: 🚀 Otimizações de Performance (DOCTYPE, lazy loading, etc.)
    cleanedHtml = this.optimizePerformance(cleanedHtml);

    console.log('✅ ========== LIMPEZA CIRÚRGICA CONCLUÍDA ==========\n');
    console.log(`📊 Estatísticas:`);
    console.log(`   - Meta Pixels removidos: ${stats.metaPixels}`);
    console.log(`   - Analytics scripts removidos: ${stats.analyticsScripts}`);
    console.log(`   - Tracking scripts removidos: ${stats.trackingScripts}`);
    console.log(`   - Webhooks removidos: ${stats.webhooks}\n`);

    return cleanedHtml;
  }

  /**
   * 🔹 CAMADA 1: Remover blocos comentados de tracking
   * Detecta e remove blocos entre comentários como:
   * <!-- Meta Pixel Code --> ... <!-- End Meta Pixel Code -->
   * <!-- Google Analytics --> ... <!-- End Google Analytics -->
   */
  private removeCommentedTrackingBlocks(html: string, stats: CleaningStats): string {
    console.log('🔹 [CAMADA 1] Removendo blocos comentados de tracking...');
    let removedCount = 0;

    // Google Site Kit snippets (comentários órfãos sem conteúdo)
    html = html.replace(
      /<!--\s*Snippet (?:da etiqueta )?do? Google [\s\S]*?adicionado pelo Site Kit\s*-->/gi,
      () => {
        removedCount++;
        console.log('  🗑️  Removido: Comentário Google Site Kit');
        return '';
      }
    );

    // Facebook Pixel blocks
    html = html.replace(
      /<!--\s*Meta Pixel Code\s*-->[\s\S]*?<!--\s*End Meta Pixel Code\s*-->/gi,
      () => {
        stats.metaPixels++;
        removedCount++;
        console.log('  🗑️  Removido: Bloco comentado Facebook Pixel');
        return '';
      }
    );

    html = html.replace(
      /<!--\s*Facebook Pixel Code\s*-->[\s\S]*?<!--\s*End Facebook Pixel Code\s*-->/gi,
      () => {
        stats.metaPixels++;
        removedCount++;
        console.log('  🗑️  Removido: Bloco comentado Facebook Pixel (alternativo)');
        return '';
      }
    );

    // Google Analytics blocks
    html = html.replace(
      /<!--\s*Google Analytics\s*-->[\s\S]*?<!--\s*End Google Analytics\s*-->/gi,
      () => {
        stats.analyticsScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Bloco comentado Google Analytics');
        return '';
      }
    );

    // Google Tag blocks
    html = html.replace(
      /<!--\s*Google tag \(gtag\.js\)\s*-->[\s\S]*?<!--\s*End Google tag\s*-->/gi,
      () => {
        stats.analyticsScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Bloco comentado Google Tag');
        return '';
      }
    );

    // Microsoft Clarity blocks
    html = html.replace(
      /<!--\s*Microsoft Clarity\s*-->[\s\S]*?<!--\s*End Microsoft Clarity\s*-->/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Bloco comentado Microsoft Clarity');
        return '';
      }
    );

    // Hotjar blocks
    html = html.replace(
      /<!--\s*Hotjar Tracking Code\s*-->[\s\S]*?<!--\s*End Hotjar\s*-->/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Bloco comentado Hotjar');
        return '';
      }
    );

    console.log(`  ✅ CAMADA 1: ${removedCount} blocos comentados removidos\n`);
    return html;
  }

  /**
   * 🔹 CAMADA 2: Remover chamadas específicas de função de tracking
   * Remove chamadas como: fbq('init', ...), gtag('config', ...), etc
   * PRESERVA: Todo o resto do script (se houver código funcional)
   */
  private removeTrackingFunctionCalls(html: string, stats: CleaningStats): string {
    console.log('🔹 [CAMADA 2] Removendo chamadas de função de tracking...');
    let removedCount = 0;

    // Facebook Pixel: fbq('init', 'PIXEL_ID') e fbq('track', 'Event')
    // Remove APENAS as chamadas fbq, preservando o resto do script
    html = html.replace(
      /fbq\s*\(\s*['"](?:init|track|trackCustom|trackSingle)['"][\s\S]*?\)\s*;?/gi,
      () => {
        stats.metaPixels++;
        removedCount++;
        console.log('  🗑️  Removido: Chamada fbq()');
        return '';
      }
    );

    // Google Tag: gtag('config', 'GA_ID') e gtag('event', ...)
    html = html.replace(
      /gtag\s*\(\s*['"](?:config|event|set|js)['"][\s\S]*?\)\s*;?/gi,
      () => {
        stats.analyticsScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Chamada gtag()');
        return '';
      }
    );

    // Google Analytics (ga): _gaq.push, ga('send', ...)
    html = html.replace(
      /(?:_gaq\.push|ga)\s*\(\s*['"](?:send|create|require)['"][\s\S]*?\)\s*;?/gi,
      () => {
        stats.analyticsScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Chamada ga() ou _gaq.push()');
        return '';
      }
    );

    // Microsoft Clarity: clarity('set', ...)
    html = html.replace(
      /clarity\s*\(\s*['"](?:set|identify|metadata|consent|upgrade)['"][\s\S]*?\)\s*;?/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Chamada clarity()');
        return '';
      }
    );

    // Hotjar: hj('identify', ...), hj('trigger', ...)
    html = html.replace(
      /hj\s*\(\s*['"](?:identify|trigger|tagRecording)['"][\s\S]*?\)\s*;?/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Chamada hj()');
        return '';
      }
    );

    console.log(`  ✅ CAMADA 2: ${removedCount} chamadas de função removidas\n`);
    return html;
  }

  /**
   * 🔹 CAMADA 3: Remover scripts ESPECÍFICOS de tracking por URL exata
   * Remove APENAS <script> tags de tracking
   * ⚠️ NUNCA remove <link rel="stylesheet"> ou <style> (CSS sempre preservado)
   */
  private removeSpecificTrackingScripts(html: string, stats: CleaningStats): string {
    console.log('🔹 [CAMADA 3] Removendo scripts específicos de tracking...');
    console.log('   ⚠️  CSS sempre preservado (links e styles inline)');
    let removedCount = 0;

    // Lista de URLs ESPECÍFICAS de tracking (não domínios inteiros)
    const specificTrackingUrls = [
      // Facebook Pixel
      'connect.facebook.net/en_US/fbevents.js',
      'connect.facebook.net/pt_BR/fbevents.js',
      'connect.facebook.net/signals/config/',
      'connect.facebook.net/signals/plugins/',

      // Google Tag Manager
      'googletagmanager.com/gtag/js',
      'googletagmanager.com/gtm.js',

      // Google Analytics
      'google-analytics.com/analytics.js',
      'google-analytics.com/ga.js',
      'googletagmanager.com/gtag/js',

      // Microsoft Clarity
      'clarity.ms/tag/',

      // Hotjar
      'static.hotjar.com/c/hotjar-',

      // Segment
      'cdn.segment.com/analytics.js',

      // Mixpanel
      'cdn.mxpnl.com/libs/mixpanel',

      // Amplitude
      'cdn.amplitude.com/libs/amplitude',

      // UTMFY
      'utmfy.com',
      'utmz.com',
      'cdn.utmify.com.br',

      // PixelYourSite
      'pixelyoursite',
    ];

    for (const url of specificTrackingUrls) {
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(
        `<script[^>]*\\ssrc\\s*=\\s*["'][^"']*${escapedUrl}[^"']*["'][^>]*>\\s*<\\/script>`,
        'gi'
      );

      html = html.replace(regex, () => {
        stats.trackingScripts++;
        removedCount++;
        console.log(`  🗑️  Removido: Script específico de ${url}`);
        return '';
      });
    }

    console.log(`  ✅ CAMADA 3: ${removedCount} scripts específicos removidos\n`);
    return html;
  }

  /**
   * 🔹 CAMADA 4: Remover meta tags de verificação e tracking
   * Remove meta tags de verificação de domínio e identificação de apps
   */
  private removeTrackingMetaTags(html: string, stats: CleaningStats): string {
    console.log('🔹 [CAMADA 4] Removendo meta tags de tracking...');
    let removedCount = 0;

    // Facebook Domain Verification
    html = html.replace(
      /<meta\s+name\s*=\s*["']facebook-domain-verification["']\s+content\s*=\s*["'][^"']*["']\s*\/?>/gi,
      () => {
        removedCount++;
        console.log('  🗑️  Removido: Meta tag facebook-domain-verification');
        return '';
      }
    );

    // Google Site Verification
    html = html.replace(
      /<meta\s+name\s*=\s*["']google-site-verification["']\s+content\s*=\s*["'][^"']*["']\s*\/?>/gi,
      () => {
        removedCount++;
        console.log('  🗑️  Removido: Meta tag google-site-verification');
        return '';
      }
    );

    // Facebook App ID
    html = html.replace(
      /<meta\s+property\s*=\s*["']fb:app_id["']\s+content\s*=\s*["'][^"']*["']\s*\/?>/gi,
      () => {
        removedCount++;
        console.log('  🗑️  Removido: Meta tag fb:app_id');
        return '';
      }
    );

    // Pinterest verification
    html = html.replace(
      /<meta\s+name\s*=\s*["']p:domain_verify["']\s+content\s*=\s*["'][^"']*["']\s*\/?>/gi,
      () => {
        removedCount++;
        console.log('  🗑️  Removido: Meta tag Pinterest verification');
        return '';
      }
    );

    console.log(`  ✅ CAMADA 4: ${removedCount} meta tags removidas\n`);
    return html;
  }

  /**
   * 🔹 CAMADA 5: Remover noscript de tracking
   * Remove fallbacks de pixel (img) e GTM (iframe) em tags <noscript>
   */
  private removeTrackingNoscript(html: string, stats: CleaningStats): string {
    console.log('🔹 [CAMADA 5] Removendo tags noscript de tracking...');
    let removedCount = 0;

    // Facebook Pixel noscript (img)
    // ⚠️ CORREÇÃO: Capturar APENAS o bloco noscript que DIRETAMENTE contém a img do Facebook
    html = html.replace(
      /<noscript>[^<]*<img[^>]*src\s*=\s*["'][^"']*facebook\.com\/tr\?[^"']*["'][^>]*>[^<]*<\/noscript>/gi,
      () => {
        stats.metaPixels++;
        removedCount++;
        console.log('  🗑️  Removido: Noscript Facebook Pixel (img)');
        return '';
      }
    );

    // Google Tag Manager noscript (iframe)
    // ⚠️ CORREÇÃO: Capturar APENAS o bloco noscript que DIRETAMENTE contém o iframe GTM
    // Usa [^<]* para garantir que não capture outros tags entre <noscript> e <iframe>
    html = html.replace(
      /<noscript>[^<]*<iframe[^>]*src\s*=\s*["'][^"']*googletagmanager\.com\/ns\.html[^"']*["'][^>]*>.*?<\/iframe>[^<]*<\/noscript>/gi,
      () => {
        stats.analyticsScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Noscript Google Tag Manager (iframe)');
        return '';
      }
    );

    console.log(`  ✅ CAMADA 5: ${removedCount} noscript tags removidas\n`);
    return html;
  }

  /**
   * 🔹 CAMADA 6: Remover variáveis e configurações de tracking isoladas
   * Remove scripts que APENAS definem variáveis de tracking (sem código funcional)
   */
  private removeTrackingVariables(html: string, stats: CleaningStats): string {
    console.log('🔹 [CAMADA 6] Removendo variáveis de tracking isoladas...');
    let removedCount = 0;

    // Remover scripts que APENAS definem window.dataLayer
    html = html.replace(
      /<script[^>]*>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]\s*;?\s*<\/script>/gi,
      () => {
        stats.analyticsScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Script isolado window.dataLayer');
        return '';
      }
    );

    // 🎯 PixelYourSite - SEMPRE REMOVER (tracking puro)
    // ⚠️ IMPORTANTE: Usar regex que não atravesse múltiplas tags <script>
    // Padrão: (?:(?!<script)[\s\S])*? significa "qualquer char que não seja seguido por <script"

    // Remover scripts com pysFacebookRest (pode ter objeto JSON complexo)
    html = html.replace(
      /<script[^>]*>(?:(?!<script)[\s\S])*?var\s+pysFacebookRest\s*=(?:(?!<script)[\s\S])*?<\/script>/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Script PixelYourSite pysFacebookRest');
        return '';
      }
    );

    // Remover scripts com pysOptions (id="pys-js-extra" com objeto JSON complexo)
    html = html.replace(
      /<script[^>]*id\s*=\s*["']pys-js-extra["'][^>]*>(?:(?!<script)[\s\S])*?<\/script>/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Script PixelYourSite pysOptions');
        return '';
      }
    );

    // Remover script PixelYourSite version
    html = html.replace(
      /<script[^>]*id\s*=\s*["']pys-version-script["'][^>]*>(?:(?!<script)[\s\S])*?<\/script>/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Script PixelYourSite version');
        return '';
      }
    );

    // Remover scripts com window.pixelId (UTMFY - pode ter código adicional)
    html = html.replace(
      /<script[^>]*>(?:(?!<script)[\s\S])*?window\.pixelId\s*=(?:(?!<script)[\s\S])*?<\/script>/gi,
      () => {
        stats.trackingScripts++;
        removedCount++;
        console.log('  🗑️  Removido: Script isolado window.pixelId');
        return '';
      }
    );

    console.log(`  ✅ CAMADA 6: ${removedCount} variáveis isoladas removidas\n`);
    return html;
  }

  /**
   * 🛡️ CAMADA 7: Remover Scripts Maliciosos
   * Remove scripts que tentam:
   * - Redirecionar para outras páginas
   * - Detectar clonagem/iframe
   * - Bloquear inspeção/devtools
   * - Exibir popups/alerts maliciosos
   */
  private removeMaliciousScripts(html: string, stats: CleaningStats): string {
    console.log('🛡️ [CAMADA 7] Removendo scripts maliciosos...');

    // 🎯 BYPASS PARA SITES LOVABLE: Sites confiáveis não precisam dessa camada de segurança
    // Lovable, Netlify, Vercel são plataformas confiáveis de hospedagem
    const isTrustedPlatform =
      html.toLowerCase().includes('lovable') ||
      html.toLowerCase().includes('netlify') ||
      html.toLowerCase().includes('vercel') ||
      html.toLowerCase().includes('data-inlined-from'); // Sites com CSS inline do Puppeteer

    if (isTrustedPlatform) {
      console.log('   ⏭️  BYPASS: Site de plataforma confiável detectado - pulando CAMADA 7');
      return html;
    }

    let removedCount = 0;

    // Função para verificar se deve preservar (scripts legítimos)
    const shouldPreserve = (match: string): boolean => {
      const lower = match.toLowerCase();
      return (
        // WordPress e plugins
        lower.includes('elementor') ||
        lower.includes('jquery') ||
        lower.includes('wp-content') ||
        lower.includes('wp-includes') ||
        lower.includes('woocommerce') ||
        // Códigos de tracking injetados pelo usuário
        lower.includes('data-tuglet') ||
        // Frameworks e plataformas modernas (Lovable, Vite, React, etc.)
        lower.includes('lovable') ||
        lower.includes('data-inlined-from') ||
        lower.includes('data-inlined') ||
        lower.includes('vite') ||
        lower.includes('react') ||
        lower.includes('next') ||
        lower.includes('vue') ||
        // CSS inline (crítico para preservar estilização)
        lower.includes('<style') && lower.includes('data-inlined')
      );
    };

    // === PROTEÇÃO ESPECÍFICA: Script tipo "melodiadoamor" ===
    // Detecta scripts com padrão: REDIR_URL + bounce() + contextmenu + keydown + resize + outerWidth
    html = html.replace(
      /<script[^>]*>[\s\S]*?REDIR_URL[\s\S]*?bounce[\s\S]*?contextmenu[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de proteção anti-clone (padrão REDIR_URL+bounce)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === PROTEÇÃO ESPECÍFICA: Scripts com location.replace para páginas de proteção ===
    html = html.replace(
      /<script[^>]*>[\s\S]*?location\.replace\s*\(\s*["'][^"']*(?:acesso|blocked|protect|redirect|clone|hack)[^"']*["']\s*\)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script com redirect para página de proteção');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === PROTEÇÃO ESPECÍFICA: Scripts que detectam gap de DevTools ===
    // Padrão: outerWidth - innerWidth ou outerHeight - innerHeight
    html = html.replace(
      /<script[^>]*>[\s\S]*?(?:outer(?:Width|Height)\s*(?:\|\||-)?\s*\d*\s*-?\s*inner(?:Width|Height)|inner(?:Width|Height)\s*(?:\|\||-)?\s*\d*\s*-?\s*outer(?:Width|Height))[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de detecção DevTools via dimensões');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === PROTEÇÃO ESPECÍFICA: Scripts com keydown + F12 ===
    html = html.replace(
      /<script[^>]*>[\s\S]*?keydown[\s\S]*?(?:f12|F12)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de bloqueio F12');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === PROTEÇÃO ESPECÍFICA: Scripts com contextmenu + redirect ===
    html = html.replace(
      /<script[^>]*>[\s\S]*?contextmenu[\s\S]*?(?:location|redirect|bounce|href)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de bloqueio clique direito com redirect');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === PROTEÇÃO ESPECÍFICA: Scripts com resize + location ===
    html = html.replace(
      /<script[^>]*>[\s\S]*?resize[\s\S]*?(?:location\.(?:href|replace)|bounce)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de detecção resize com redirect');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === REDIRECIONAMENTOS ===
    // Scripts com window.location = "..."
    html = html.replace(
      /<script[^>]*>[\s\S]*?window\.location\s*=\s*["'][^"']+["'][\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de redirecionamento (window.location)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // Scripts com location.href = "..."
    html = html.replace(
      /<script[^>]*>[\s\S]*?location\.href\s*=\s*["'][^"']+["'][\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de redirecionamento (location.href)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // Scripts com location.replace()
    html = html.replace(
      /<script[^>]*>[\s\S]*?location\.replace\s*\([^)]+\)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de redirecionamento (location.replace)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // Scripts com top.location (iframe breaker)
    html = html.replace(
      /<script[^>]*>[\s\S]*?top\.location[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script anti-iframe (top.location)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // Scripts com parent.location (iframe breaker)
    html = html.replace(
      /<script[^>]*>[\s\S]*?parent\.location[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script anti-iframe (parent.location)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === DETECÇÃO DE IFRAME/CLONAGEM ===
    // Scripts com self !== top
    html = html.replace(
      /<script[^>]*>[\s\S]*?self\s*!==?\s*top[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de detecção iframe (self !== top)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // Scripts com frameElement
    html = html.replace(
      /<script[^>]*>[\s\S]*?window\.frameElement[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de detecção iframe (frameElement)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === ANTI-DEVTOOLS ===
    // Scripts com debugger
    html = html.replace(
      /<script[^>]*>[\s\S]*?\bdebugger\b[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script anti-devtools (debugger)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === ALERTS/POPUPS MALICIOSOS ===
    html = html.replace(
      /<script[^>]*>[\s\S]*?alert\s*\([\s\S]*?(clonado|copiado|protegido|bloqueado|proibido|pirata)[\s\S]*?\)[\s\S]*?<\/script>/gi,
      (match) => {
        console.log('  🗑️ Removido: Script de alerta malicioso');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === DETECÇÃO DE VIEWPORT/RESIZE (Anti-clone sofisticado) ===
    // Scripts que detectam resize e mudam conteúdo
    html = html.replace(
      /<script[^>]*>[\s\S]*?(resize|innerWidth|innerHeight|outerWidth|outerHeight)[\s\S]*?(innerHTML|textContent|innerText|document\.write|replaceWith)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        // Verificar se parece ser proteção anti-clone (conteúdo ofensivo ou substituição)
        if (/lixo|merda|fracassado|idiota|otário|babaca|pirata|clonado|roubado/i.test(match)) {
          console.log('  🗑️ Removido: Script anti-clone com resize detection');
          stats.trackingScripts++;
          removedCount++;
          return '';
        }
        return match;
      }
    );

    // Scripts que verificam dimensões da janela para proteção
    html = html.replace(
      /<script[^>]*>[\s\S]*?(screen\.width|screen\.height|window\.screen)[\s\S]*?(location|redirect|innerHTML|alert)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de detecção de tela');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === DETECÇÃO DE DEVTOOLS VIA DIMENSÕES ===
    // Scripts que comparam innerWidth com outerWidth (técnica comum de detecção)
    html = html.replace(
      /<script[^>]*>[\s\S]*?(outerWidth\s*-\s*innerWidth|outerHeight\s*-\s*innerHeight|innerWidth\s*[<>]\s*outerWidth)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de detecção devtools via dimensões');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === PROTEÇÃO ANTI-IFRAME SOFISTICADA ===
    // Scripts com window.name ou referrer checks
    html = html.replace(
      /<script[^>]*>[\s\S]*?(window\.name|document\.referrer)[\s\S]*?(location|redirect|innerHTML|alert)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script anti-iframe sofisticado');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === DETECÇÃO DE CLONAGEM VIA DOMÍNIO ===
    // Scripts que verificam hostname/origin
    html = html.replace(
      /<script[^>]*>[\s\S]*?(hostname|location\.host|location\.origin)[\s\S]*?(!=|!==|indexOf)[\s\S]*?(location|redirect|innerHTML|document\.body)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de verificação de domínio');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === CONTEÚDO OFENSIVO INLINE ===
    // Remover elementos com conteúdo claramente ofensivo (anti-clone)
    html = html.replace(
      /<[^>]+>[\s\S]*?(lixo|merda|fracassado|idiota|otário|babaca|vai\s+se\s+f|filho\s+da\s+p|corno|viado|fdp)[\s\S]*?<\/[^>]+>/gi,
      (match) => {
        // Só remover se parecer ser conteúdo de proteção anti-clone
        if (match.length < 500 && /script|hidden|display:\s*none/i.test(match)) {
          console.log('  🗑️ Removido: Elemento com conteúdo anti-clone ofensivo');
          removedCount++;
          return '';
        }
        return match;
      }
    );

    // === EVENT LISTENERS MALICIOSOS ===
    // Remover scripts que adicionam listeners para resize com comportamento suspeito
    html = html.replace(
      /<script[^>]*>[\s\S]*?addEventListener\s*\(\s*["']resize["'][\s\S]*?(innerHTML|textContent|location|alert|document\.body)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script com resize listener malicioso');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === MUTATION OBSERVER MALICIOSO ===
    // Scripts que usam MutationObserver para detectar mudanças e reagir
    html = html.replace(
      /<script[^>]*>[\s\S]*?MutationObserver[\s\S]*?(location|innerHTML|textContent|alert)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        // Verificar se é proteção anti-clone
        if (/clone|protect|security|hack|pirat/i.test(match)) {
          console.log('  🗑️ Removido: Script MutationObserver anti-clone');
          stats.trackingScripts++;
          removedCount++;
          return '';
        }
        return match;
      }
    );

    // === TIMERS DE REDIRECIONAMENTO ===
    html = html.replace(
      /<script[^>]*>[\s\S]*?setTimeout[\s\S]*?(location|redirect|window\.location)[\s\S]*?<\/script>/gi,
      (match) => {
        if (shouldPreserve(match)) return match;
        console.log('  🗑️ Removido: Script de timer com redirecionamento');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === META REFRESH ===
    html = html.replace(
      /<meta[^>]*http-equiv=["']refresh["'][^>]*>/gi,
      () => {
        console.log('  🗑️ Removido: Meta refresh (redirecionamento)');
        stats.trackingScripts++;
        removedCount++;
        return '';
      }
    );

    // === SCRIPTS COM CONTEÚDO OFENSIVO HARDCODED ===
    // Proteções anti-clone frequentemente têm palavrões hardcoded no código
    const offensivePatterns = [
      'lixo', 'merda', 'fracassado', 'idiota', 'otário', 'babaca',
      'vai se f', 'filho da p', 'corno', 'fdp', 'porra', 'caralho',
      'piranha', 'vagabund', 'arrombad', 'desgraça', 'maldito',
      'espionar', 'roubar', 'pirata', 'clonado', 'copiado ilegalmente'
    ];
    
    for (const offensive of offensivePatterns) {
      const regex = new RegExp(
        `<script[^>]*>[\\s\\S]*?${offensive.replace(/\s+/g, '\\s*')}[\\s\\S]*?<\\/script>`,
        'gi'
      );
      html = html.replace(regex, (match) => {
        if (shouldPreserve(match)) return match;
        console.log(`  🗑️ Removido: Script com conteúdo ofensivo (${offensive})`);
        stats.trackingScripts++;
        removedCount++;
        return '';
      });
    }

    // === DIVS/ELEMENTOS OCULTOS COM CONTEÚDO ANTI-CLONE ===
    // Elementos que ficam escondidos e aparecem quando detectam clone
    html = html.replace(
      /<div[^>]*(?:style=["'][^"']*display:\s*none[^"']*["']|class=["'][^"']*hidden[^"']*["'])[^>]*>[\s\S]*?(lixo|merda|fracassado|idiota|pirata|clonado|espionar)[\s\S]*?<\/div>/gi,
      (match) => {
        console.log('  🗑️ Removido: Div oculta com conteúdo anti-clone');
        removedCount++;
        return '';
      }
    );

    // === IMAGENS DE PROTEÇÃO (memes ofensivos) ===
    // Algumas proteções usam imagens de memes para humilhar
    html = html.replace(
      /<img[^>]*(?:data-clone|data-protection|anti-clone)[^>]*>/gi,
      (match) => {
        console.log('  🗑️ Removido: Imagem de proteção anti-clone');
        removedCount++;
        return '';
      }
    );

    // === ATRIBUTOS INLINE MALICIOSOS ===
    // Remover onload/onunload/onbeforeunload do body e html
    html = html.replace(
      /<(body|html)([^>]*)(onload|onunload|onbeforeunload)\s*=\s*["'][^"']*["']([^>]*)>/gi,
      (match, tag, before, attr, after) => {
        console.log(`  🗑️ Removido: Atributo ${attr} malicioso de <${tag}>`);
        removedCount++;
        return `<${tag}${before}${after}>`;
      }
    );

    // Remover bloqueios de interação (right-click, select, copy)
    html = html.replace(
      /<body([^>]*)(oncontextmenu|onselectstart|oncopy|ondragstart)\s*=\s*["'][^"']*["']([^>]*)>/gi,
      (match, before, attr, after) => {
        console.log(`  🗑️ Removido: Bloqueio de interação (${attr})`);
        removedCount++;
        return `<body${before}${after}>`;
      }
    );

    console.log(`  ✅ ${removedCount} scripts/atributos maliciosos removidos`);
    return html;
  }

  /**
   * 🚀 CAMADA 8: Otimizações de Performance
   * - Garantir DOCTYPE correto
   * - Adicionar lazy loading em imagens
   * - Remover preloads desnecessários
   */
  private optimizePerformance(html: string): string {
    console.log('🚀 [CAMADA 8] Aplicando otimizações de performance...');
    let optimizations = 0;

    // 1. GARANTIR DOCTYPE CORRETO
    const hasDoctype = /^\s*<!doctype/i.test(html);
    if (!hasDoctype) {
      console.log('  📄 Adicionando DOCTYPE html');
      html = '<!DOCTYPE html>\n' + html;
      optimizations++;
    }

    // 2. LAZY LOADING EM IMAGENS (que não são hero/logo)
    html = html.replace(
      /<img(?![^>]*loading=)([^>]*)(src=["'][^"']+["'])([^>]*)>/gi,
      (match, before, src, after) => {
        // Não adicionar lazy em imagens hero/logo/header
        if (/hero|banner|logo|header|above|first|lazy="eager"/i.test(match)) {
          return match;
        }
        optimizations++;
        return `<img${before}${src} loading="lazy"${after}>`;
      }
    );

    // 3. DECODING ASYNC EM IMAGENS
    html = html.replace(
      /<img(?![^>]*decoding=)([^>]*src=["'][^"']+["'][^>]*)>/gi,
      (match, attrs) => {
        optimizations++;
        return `<img${attrs} decoding="async">`;
      }
    );

    // 4. REMOVER PRELOADS DE TRACKING
    const trackingPreloads = [
      'facebook.net',
      'googletagmanager.com',
      'google-analytics.com',
      'clarity.ms',
      'hotjar.com',
      'segment.com',
    ];

    for (const domain of trackingPreloads) {
      const regex = new RegExp(
        `<link[^>]*rel=["']preload["'][^>]*href=["'][^"']*${domain.replace(/\./g, '\\.')}[^"']*["'][^>]*>`,
        'gi'
      );
      html = html.replace(regex, () => {
        console.log(`  🗑️ Removido preload de tracking: ${domain}`);
        optimizations++;
        return '';
      });
    }

    // 5. REMOVER PREFETCH DE TRACKING
    for (const domain of trackingPreloads) {
      const regex = new RegExp(
        `<link[^>]*rel=["']prefetch["'][^>]*href=["'][^"']*${domain.replace(/\./g, '\\.')}[^"']*["'][^>]*>`,
        'gi'
      );
      html = html.replace(regex, () => {
        console.log(`  🗑️ Removido prefetch de tracking: ${domain}`);
        optimizations++;
        return '';
      });
    }

    // 6. REMOVER DNS-PREFETCH DE TRACKING
    for (const domain of trackingPreloads) {
      const regex = new RegExp(
        `<link[^>]*rel=["']dns-prefetch["'][^>]*href=["'][^"']*${domain.replace(/\./g, '\\.')}[^"']*["'][^>]*>`,
        'gi'
      );
      html = html.replace(regex, () => {
        console.log(`  🗑️ Removido dns-prefetch de tracking: ${domain}`);
        optimizations++;
        return '';
      });
    }

    console.log(`  ✅ ${optimizations} otimizações de performance aplicadas`);
    return html;
  }

  /**
   * 🛡️ VALIDAÇÃO: Verificar se código essencial foi preservado
   */
  validatePreservation(originalHtml: string, cleanedHtml: string): {
    cssPreserved: boolean;
    jsPreserved: boolean;
    imagesPreserved: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Verificar se CSS foi preservado (contagem de <link rel="stylesheet">)
    const originalCssCount = (originalHtml.match(/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi) || []).length;
    const cleanedCssCount = (cleanedHtml.match(/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi) || []).length;
    const cssPreserved = originalCssCount === cleanedCssCount;

    if (!cssPreserved) {
      warnings.push(`⚠️ CSS pode ter sido afetado: ${originalCssCount} links originais vs ${cleanedCssCount} links restantes`);
    }

    // Verificar se scripts funcionais foram preservados (WordPress, Elementor, jQuery)
    const hasElementor = originalHtml.includes('elementor') || originalHtml.includes('Elementor');
    const hasElementorAfter = cleanedHtml.includes('elementor') || cleanedHtml.includes('Elementor');
    const jsPreserved = !hasElementor || hasElementorAfter;

    if (!jsPreserved) {
      warnings.push('⚠️ Scripts do Elementor podem ter sido removidos');
    }

    // Verificar se imagens foram preservadas
    const originalImgCount = (originalHtml.match(/<img[^>]*>/gi) || []).length;
    const cleanedImgCount = (cleanedHtml.match(/<img[^>]*>/gi) || []).length;
    const imagesPreserved = originalImgCount === cleanedImgCount;

    if (!imagesPreserved) {
      warnings.push(`⚠️ Imagens podem ter sido afetadas: ${originalImgCount} originais vs ${cleanedImgCount} restantes`);
    }

    return {
      cssPreserved,
      jsPreserved,
      imagesPreserved,
      warnings
    };
  }
}
