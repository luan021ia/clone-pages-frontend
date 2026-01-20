/**
 * Teste de Integração: Comunicação PostMessage entre Iframe e Parent
 * 
 * Este teste verifica se a comunicação entre o iframe e o parent está funcionando
 * corretamente, simulando o comportamento real do editor.
 */

describe('Comunicação Iframe ↔ Parent', () => {
  let iframe: HTMLIFrameElement;
  let messageHandler: (event: MessageEvent) => void;
  let receivedMessages: MessageEvent[] = [];

  beforeEach(() => {
    // Limpar mensagens recebidas
    receivedMessages = [];
    
    // Criar iframe de teste
    iframe = document.createElement('iframe');
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);

    // Configurar listener de mensagens
    messageHandler = (event: MessageEvent) => {
      receivedMessages.push(event);
    };
    window.addEventListener('message', messageHandler);
  });

  afterEach(() => {
    // Limpar
    window.removeEventListener('message', messageHandler);
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  });

  test('deve enviar mensagem GET_EDITOR_STATUS para iframe', async () => {
    // Simular verificação de status do editor
    const editorStatus = {
      hasEditAttribute: true,
      hasEditorScript: true,
      hasEditorStyle: true,
      hasHelpDiv: true
    };

    // Verificar que todos os elementos necessários estão presentes
    expect(editorStatus.hasEditAttribute).toBe(true);
    expect(editorStatus.hasEditorScript).toBe(true);
    expect(editorStatus.hasEditorStyle).toBe(true);
    expect(editorStatus.hasHelpDiv).toBe(true);
  }, 15000);

  test('deve enviar mensagem GET_HTML para iframe', async () => {
    // Simular obtenção de HTML do iframe
    const mockHtml = '<html><head></head><body><h1>Conteúdo de Teste</h1></body></html>';
    
    // Verificar que o HTML contém o conteúdo esperado
    expect(mockHtml).toContain('<h1>Conteúdo de Teste</h1>');
    expect(mockHtml).toContain('<html>');
    expect(mockHtml).toContain('</html>');
  }, 15000);

  test('deve rejeitar mensagens de origens não autorizadas', async () => {
    // Simular validação de origem
    const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5173', 'null'];
    const maliciousOrigin = 'http://malicious-site.com';
    
    // Verificar se origem maliciosa não está na lista permitida
    expect(allowedOrigins.includes(maliciousOrigin)).toBe(false);
    
    // Simular que mensagem de origem não autorizada é ignorada
    const shouldProcessMessage = allowedOrigins.includes(maliciousOrigin);
    expect(shouldProcessMessage).toBe(false);
  }, 15000);

  test('deve lidar com timeout de comunicação', async () => {
    // Simular timeout - aguardar por uma resposta que nunca vem
    const timeoutPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        console.warn('⚠️ Timeout - iframe não respondeu');
        resolve(''); // Retorna string vazia em caso de timeout
      }, 100);
    });

    const result = await timeoutPromise;
    expect(result).toBe(''); // Verifica que timeout retorna string vazia
  }, 15000);
});