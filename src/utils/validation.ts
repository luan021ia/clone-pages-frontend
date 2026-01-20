export const validateUrl = (url: string): { isValid: boolean; message?: string } => {
  if (!url.trim()) {
    return { isValid: false, message: 'URL é obrigatória' };
  }

  // Verificar comprimento máximo da URL (2000 caracteres é padrão)
  if (url.length > 2000) {
    return { isValid: false, message: 'URL é muito longa (máximo 2000 caracteres)' };
  }

  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(fullUrl);

    // Verificar protocolo - apenas http e https são permitidos
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isValid: false,
        message: `Protocolo "${urlObj.protocol}" não permitido. Use http ou https.`
      };
    }

    if (!urlObj.hostname) {
      return { isValid: false, message: 'URL inválida: hostname não encontrado' };
    }

    // Verificar se não está tentando clonar a si mesmo
    const currentHost = window.location.hostname;
    const currentPort = window.location.port;
    const currentOrigin = `${currentHost}${currentPort ? ':' + currentPort : ''}`;
    const targetOrigin = `${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}`;

    if (targetOrigin === currentOrigin ||
        (currentHost === 'localhost' && urlObj.hostname === 'localhost') ||
        (currentHost === '127.0.0.1' && urlObj.hostname === '127.0.0.1')) {
      return {
        isValid: false,
        message: 'Não é possível clonar a própria aplicação. Insira uma URL externa.'
      };
    }

    return { isValid: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao processar URL';
    return { isValid: false, message: `Formato de URL inválido: ${errorMsg}` };
  }
};

export const validatePixelId = (pixelId: string): { isValid: boolean; message?: string } => {
  if (!pixelId.trim()) {
    return { isValid: false, message: 'Pixel ID é obrigatório quando habilitado' };
  }
  
  if (!/^\d+$/.test(pixelId)) {
    return { isValid: false, message: 'Pixel ID deve conter apenas números' };
  }
  
  return { isValid: true };
};

export const validateGtagId = (gtagId: string): { isValid: boolean; message?: string } => {
  if (!gtagId.trim()) {
    return { isValid: false, message: 'Google Tag ID é obrigatório quando habilitado' };
  }
  
  if (!/^(G-|GA_MEASUREMENT_ID|AW-|DC-)/.test(gtagId)) {
    return { isValid: false, message: 'Formato de Google Tag ID inválido' };
  }
  
  return { isValid: true };
};

export const validateWhatsAppNumber = (number: string): { isValid: boolean; message?: string } => {
  if (!number.trim()) {
    return { isValid: false, message: 'Número do WhatsApp é obrigatório quando habilitado' };
  }
  
  const cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length < 10 || cleanNumber.length > 15) {
    return { isValid: false, message: 'Número do WhatsApp deve ter entre 10 e 15 dígitos' };
  }
  
  return { isValid: true };
};