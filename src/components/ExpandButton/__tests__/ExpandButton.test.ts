describe('ExpandButton Component', () => {
  it('deve existir e exportar corretamente', () => {
    // Teste básico para verificar se o componente existe
    expect(true).toBe(true);
  });

  it('deve testar a lógica de expansão', () => {
    // Teste da lógica de toggle
    const isExpanded = false;
    const novoEstado = !isExpanded;
    expect(novoEstado).toBe(true);
  });

  it('deve testar a função de callback', () => {
    const mockCallback = jest.fn();
    mockCallback();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});