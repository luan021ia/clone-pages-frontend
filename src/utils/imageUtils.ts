/**
 * 🖼️ Utilitários para processamento de imagens
 * - Conversão automática para WebP (formato mais leve)
 * - Redimensionamento inteligente
 * - Otimização de qualidade
 */

interface ConvertToWebPOptions {
  /** Largura máxima (padrão: 1920px) */
  maxWidth?: number;
  /** Altura máxima (padrão: 1920px) */
  maxHeight?: number;
  /** Qualidade WebP (0-1, padrão: 0.85) */
  quality?: number;
  /** Manter proporção (padrão: true) */
  maintainAspectRatio?: boolean;
}

/**
 * Converte uma imagem para WebP com otimização automática
 * @param file Arquivo de imagem a ser convertido
 * @param options Opções de conversão
 * @returns Promise<string> Base64 da imagem em WebP
 */
export const convertToWebP = (
  file: File,
  options: ConvertToWebPOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 0.85,
      maintainAspectRatio = true,
    } = options;

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context não disponível'));
          return;
        }

        // Calcular dimensões finais
        let width = img.width;
        let height = img.height;

        // Redimensionar se necessário
        if (width > maxWidth || height > maxHeight) {
          if (maintainAspectRatio) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          } else {
            width = Math.min(width, maxWidth);
            height = Math.min(height, maxHeight);
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Configurar qualidade de renderização
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Limpar canvas e desenhar imagem
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para WebP
        try {
          const webpBase64 = canvas.toDataURL('image/webp', quality);
          
          console.log(`🖼️ [ImageUtils] Imagem convertida para WebP:`, {
            originalSize: file.size,
            originalType: file.type,
            originalDimensions: `${img.width}x${img.height}`,
            newDimensions: `${width}x${height}`,
            webpSize: Math.round(webpBase64.length * 0.75), // Base64 é ~33% maior que binário
            compressionRatio: ((1 - (webpBase64.length * 0.75) / file.size) * 100).toFixed(1) + '%',
            quality: quality,
          });

          resolve(webpBase64);
        } catch (error) {
          // Fallback: se WebP não for suportado, usar PNG
          console.warn('⚠️ [ImageUtils] WebP não suportado, usando PNG como fallback');
          const pngBase64 = canvas.toDataURL('image/png', 1.0);
          resolve(pngBase64);
        }
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Verifica se o navegador suporta WebP
 */
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};
