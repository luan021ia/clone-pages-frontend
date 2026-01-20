/**
 * Utilitário para testar injeção de códigos de rastreamento
 * Use no console do navegador para verificar se os códigos estão sendo injetados corretamente
 */

import { CloneService } from '../services/cloneService';

/**
 * Testar injeção de Meta Pixel
 */
export const testPixelInjection = (): void => {
  const testHtml = `
    <html>
      <head></head>
      <body><h1>Test Page</h1></body>
    </html>
  `;

  const pixelId = '123456789';

  const result = CloneService.cleanTrackingCodes(testHtml, {
    preservePixel: true,
    pixelId: pixelId,
  });

  console.log('🔍 TEST META PIXEL:');
  console.log('Input HTML tamanho:', testHtml.length);
  console.log('Output HTML tamanho:', result.length);
  console.log('Contém fbq?', result.includes('fbq'));
  console.log('Contém pixelId?', result.includes(pixelId));
  console.log('✅ Meta Pixel test concluído\n');
};

/**
 * Testar injeção de Google Tag
 */
export const testGtagInjection = (): void => {
  const testHtml = `
    <html>
      <head></head>
      <body><h1>Test Page</h1></body>
    </html>
  `;

  const gtagId = 'GA-987654321';

  const result = CloneService.cleanTrackingCodes(testHtml, {
    preserveGtag: true,
    gtagId: gtagId,
  });

  console.log('🔍 TEST GOOGLE TAG:');
  console.log('Input HTML tamanho:', testHtml.length);
  console.log('Output HTML tamanho:', result.length);
  console.log('Contém gtag?', result.includes('gtag'));
  console.log('Contém gtagId?', result.includes(gtagId));
  console.log('✅ Google Tag test concluído\n');
};

/**
 * Testar injeção de WhatsApp
 */
export const testWhatsAppInjection = (): void => {
  const whatsappNumber = '5521999999999';
  const testHtml = `
    <html>
      <head>
        <style>
          .whatsapp-float {
            position: fixed;
            bottom: 40px;
            right: 40px;
          }
        </style>
      </head>
      <body>
        <a href="https://wa.me/${whatsappNumber}" class="whatsapp-float">WhatsApp</a>
      </body>
    </html>
  `;

  const result = CloneService.cleanTrackingCodes(testHtml, {
    preserveWhatsApp: true,
  });

  console.log('🔍 TEST WHATSAPP INJECTION:');
  console.log('Input HTML tamanho:', testHtml.length);
  console.log('Output HTML tamanho:', result.length);
  console.log('Contém whatsapp-float class?', result.includes('whatsapp-float'));
  console.log('Contém wa.me link?', result.includes('wa.me'));
  console.log('Contém número WhatsApp?', result.includes(whatsappNumber));
  console.log('Contém position: fixed?', result.includes('fixed'));
  console.log('✅ WhatsApp test concluído\n');
};

/**
 * Testar remoção de WhatsApp quando desabilitado
 */
export const testWhatsAppRemoval = (): void => {
  const whatsappNumber = '5521999999999';
  const testHtml = `
    <html>
      <head>
        <style>
          .whatsapp-float {
            position: fixed;
            bottom: 40px;
            right: 40px;
          }
        </style>
      </head>
      <body>
        <a href="https://wa.me/${whatsappNumber}" class="whatsapp-float">WhatsApp</a>
      </body>
    </html>
  `;

  const result = CloneService.cleanTrackingCodes(testHtml, {
    preserveWhatsApp: false,
  });

  console.log('🔍 TEST WHATSAPP REMOVAL:');
  console.log('Input HTML tamanho:', testHtml.length);
  console.log('Output HTML tamanho:', result.length);
  console.log('Contém whatsapp-float class?', result.includes('whatsapp-float'));
  console.log('Contém wa.me link?', result.includes('wa.me'));
  console.log('✅ WhatsApp removal test concluído\n');
};

/**
 * Testar Microsoft Clarity
 */
export const testClarityInjection = (): void => {
  const clarityId = 'abc123xyz';
  const testHtml = `
    <html>
      <head></head>
      <body><h1>Test Page</h1></body>
    </html>
  `;

  const result = CloneService.cleanTrackingCodes(testHtml, {
    preserveClarity: true,
    clarityId: clarityId,
  });

  console.log('🔍 TEST MICROSOFT CLARITY:');
  console.log('Input HTML tamanho:', testHtml.length);
  console.log('Output HTML tamanho:', result.length);
  console.log('Contém clarity?', result.includes('clarity'));
  console.log('Contém clarityId?', result.includes(clarityId));
  console.log('✅ Clarity test concluído\n');
};

/**
 * Testar UTMFY
 */
export const testUtmfyInjection = (): void => {
  const testHtml = `
    <html>
      <head>
        <script src="https://utmfy.com/script.js"></script>
      </head>
      <body><h1>Test Page</h1></body>
    </html>
  `;

  const result = CloneService.cleanTrackingCodes(testHtml, {
    preserveUtmfy: true,
  });

  console.log('🔍 TEST UTMFY:');
  console.log('Input HTML tamanho:', testHtml.length);
  console.log('Output HTML tamanho:', result.length);
  console.log('Contém utmfy?', result.includes('utmfy'));
  console.log('Contém script src?', result.includes('script'));
  console.log('✅ UTMFY test concluído\n');
};

/**
 * Rodar todos os testes
 */
export const runAllTrackingTests = (): void => {
  console.log('🧪 INICIANDO TESTES DE CÓDIGOS DE RASTREAMENTO\n');
  console.log('=========================================\n');

  testPixelInjection();
  testGtagInjection();
  testClarityInjection();
  testUtmfyInjection();
  testWhatsAppInjection();
  testWhatsAppRemoval();

  console.log('=========================================');
  console.log('✅ TODOS OS TESTES CONCLUÍDOS!\n');
};

/**
 * Helper para testar URL construction
 */
export const testUrlConstruction = (
  baseUrl: string,
  pixelId?: string,
  gtagId?: string,
  whatsappNumber?: string,
  clarityId?: string,
  utmfyCode?: string
): void => {
  const params = new URLSearchParams();
  params.append('url', baseUrl);
  params.append('editMode', 'false');

  const hasCustomCodes = Boolean(pixelId || gtagId || whatsappNumber || clarityId || utmfyCode);
  if (hasCustomCodes) {
    params.append('injectCustom', 'true');
  }

  if (pixelId) params.append('pixelId', pixelId);
  if (gtagId) params.append('gtagId', gtagId);
  if (whatsappNumber) params.append('whatsappNumber', whatsappNumber);
  if (clarityId) params.append('clarityId', clarityId);
  if (utmfyCode) params.append('utmfyCode', utmfyCode);

  console.log('🔗 URL Parameters constructed:');
  console.log(params.toString());
  console.log('\nQuery string:');
  console.log('?' + params.toString());
};
