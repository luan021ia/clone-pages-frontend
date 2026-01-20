/**
 * Copia texto para a clipboard usando o Clipboard API moderno com fallback
 * @param text - Texto a ser copiado
 * @returns true se copiado com sucesso, false caso contrário
 */
export const writeToClipboard = async (text: string): Promise<boolean> => {
  // Validação básica
  if (!text || typeof text !== 'string') {
    console.error('writeToClipboard: invalid text input');
    return false;
  }

  try {
    // Usar modern Clipboard API (funciona em navegadores modernos)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      console.log('✅ Clipboard: copied using modern Clipboard API');
      return true;
    }
  } catch (error) {
    console.warn('Clipboard API failed:', error);
    // Continuar para fallback
  }

  // Fallback para navegadores mais antigos (IE, antigos Chrome/Firefox)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('aria-hidden', 'true');
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);

    // Focus and select
    textArea.focus();
    textArea.select();

    // Execute copy command
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      console.log('✅ Clipboard: copied using fallback execCommand method');
      return true;
    } else {
      console.error('❌ Clipboard: execCommand("copy") returned false');
      return false;
    }
  } catch (fallbackError) {
    console.error('❌ Clipboard fallback failed:', fallbackError);
    return false;
  }
};