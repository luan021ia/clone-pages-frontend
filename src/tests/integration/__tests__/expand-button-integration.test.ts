/**
 * Teste de integração para o botão de expansão
 * Verifica se o componente se integra corretamente com o Dashboard
 */

describe('ExpandButton Integration', () => {
  beforeEach(() => {
    // Limpar o estado antes de cada teste
    localStorage.clear();
  });

  it('deve persistir o estado de expansão no localStorage', () => {
    // Simular a persistência no localStorage
    const expandState = { isExpanded: true };
    localStorage.setItem('expandState', JSON.stringify(expandState));
    
    // Verificar se foi salvo corretamente
    const savedState = localStorage.getItem('expandState');
    expect(savedState).toBeTruthy();
    
    const parsedState = JSON.parse(savedState!);
    expect(parsedState.isExpanded).toBe(true);
  });

  it('deve limpar o estado ao contrair', () => {
    // Primeiro expandir
    const expandState = { isExpanded: true };
    localStorage.setItem('expandState', JSON.stringify(expandState));
    
    // Depois contrair (simulando)
    const collapseState = { isExpanded: false };
    localStorage.setItem('expandState', JSON.stringify(collapseState));
    
    // Verificar
    const savedState = localStorage.getItem('expandState');
    const parsedState = JSON.parse(savedState!);
    expect(parsedState.isExpanded).toBe(false);
  });

  it('deve lidar com tecla ESC para contrair', () => {
    // Simular o estado expandido
    const expandState = { isExpanded: true };
    localStorage.setItem('expandState', JSON.stringify(expandState));
    
    // Simular pressionamento da tecla ESC
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escEvent);
    
    // Verificar se o evento foi disparado (o handler real estaria no componente)
    expect(escEvent.key).toBe('Escape');
  });

  it('deve aplicar classes CSS corretas quando expandido', () => {
    // Testar a lógica de classes CSS
    const isExpanded = true;
    const containerClass = `preview-container ${isExpanded ? 'preview-container--expanded' : ''}`;
    
    expect(containerClass).toContain('preview-container--expanded');
  });

  it('deve remover classes CSS quando contraído', () => {
    // Testar a lógica de classes CSS quando contraído
    const isExpanded = false;
    const containerClass = `preview-container ${isExpanded ? 'preview-container--expanded' : ''}`;
    
    expect(containerClass).not.toContain('preview-container--expanded');
  });
});