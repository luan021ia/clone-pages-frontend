/**
 * Console seguro para produção
 * Remove logs sensíveis em ambiente de produção
 */

const isDevelopment = import.meta.env.DEV;

export const secureConsole = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Sempre mostrar erros, mesmo em produção
    console.error(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

export default secureConsole;
