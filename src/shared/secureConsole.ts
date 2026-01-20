// Silenciador definitivo de console no frontend (sem alternância)
(() => {
  const noop = () => {};
  try {
    const hasWindow = typeof window !== 'undefined';
    if (!hasWindow) return;

    const c = (window as any).console || ((window as any).console = {});
    const methods = ['log', 'info', 'debug', 'warn', 'error', 'trace', 'group', 'groupCollapsed', 'groupEnd'];

    for (const m of methods) {
      try {
        Object.defineProperty(c, m, { value: noop, writable: false, configurable: false });
      } catch {
        (c as any)[m] = noop;
      }
    }

    try { Object.freeze(c); } catch {}
  } catch {
    // Ignorar falhas de redefinição de console
  }
})();
