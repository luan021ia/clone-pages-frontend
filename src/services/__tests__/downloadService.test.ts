import { DownloadService } from '../downloadService';

// Mock do DOM
const mockLink = {
  href: '',
  download: '',
  style: { display: '' },
  click: jest.fn(),
};

const mockCreateElement = jest.fn(() => mockLink);
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
});

Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild,
});

Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild,
});

describe('DownloadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLink.href = '';
    mockLink.download = '';
    mockLink.style.display = '';
  });

  describe('downloadHtml', () => {
    it('deve fazer download de HTML com nome aleatório no padrão solicitado', () => {
      const html = '<html><body>Test content</body></html>';
      
      DownloadService.downloadHtml(html);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
      expect(mockLink.style.display).toBe('none');
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
    });

    it('deve fazer download com nome personalizado', () => {
      const html = '<html><body>Test</body></html>';
      const filename = 'custom-page.html';
      
      DownloadService.downloadHtml(html, filename);

      expect(mockLink.download).toBe(filename);
    });

    it('deve criar blob com tipo correto', () => {
      const html = '<html><body>Test</body></html>';
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      DownloadService.downloadHtml(html);

      expect(mockCreateObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/html',
        })
      );
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('deve lidar com HTML vazio', () => {
      DownloadService.downloadHtml('');

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('deve lidar com HTML muito grande', () => {
      const largeHtml = '<html><body>' + 'x'.repeat(1000000) + '</body></html>';
      
      DownloadService.downloadHtml(largeHtml);

      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('generateFilename', () => {
    beforeEach(() => {
      // nenhuma sequência para resetar; nomes agora são aleatórios
    });

    afterEach(() => {
      // nada
    });

    it('deve gerar nome aleatório ignorando URL com protocolo', () => {
      const url = 'https://www.example.com';
      const result = DownloadService.generateFilename(url);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('deve gerar nome aleatório ignorando URL sem protocolo', () => {
      const url = 'www.google.com';
      const result = DownloadService.generateFilename(url);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('deve gerar nomes aleatórios a cada chamada', () => {
      const url = 'https://www.amazon.com.br';
      const r1 = DownloadService.generateFilename(url);
      const r2 = DownloadService.generateFilename(url);
      
      expect(r1).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
      expect(r2).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
      expect(r1).not.toEqual(r2);
    });

    it('ignora sufixo e mantém padrão aleatório', () => {
      const url = 'https://youtube.com';
      const suffix = 'edited';
      const result = DownloadService.generateFilename(url, suffix);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('ignora URL inválida e mantém padrão aleatório', () => {
      const invalidUrl = 'not-a-valid-url';
      const result = DownloadService.generateFilename(invalidUrl);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('mantém padrão aleatório para subdomínios', () => {
      const url = 'https://blog.example.com';
      const result = DownloadService.generateFilename(url);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('mantém padrão aleatório com caminhos', () => {
      const url = 'https://example.com/path/to/page';
      const result = DownloadService.generateFilename(url);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('mantém padrão aleatório com parâmetros', () => {
      const url = 'https://example.com?param=value&other=test';
      const result = DownloadService.generateFilename(url);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('gera aleatório a cada chamada, evitando colisões', () => {
      const url = 'https://example.com';
      
      const result1 = DownloadService.generateFilename(url);
      const result2 = DownloadService.generateFilename(url);
      
      expect(result1).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
      expect(result2).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
      expect(result1).not.toEqual(result2);
    });

    it('ignora sufixo vazio e mantém padrão', () => {
      const url = 'https://example.com';
      const result = DownloadService.generateFilename(url, '');
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });

    it('ignora sufixo com caracteres especiais', () => {
      const url = 'https://example.com';
      const suffix = 'test-123_version';
      const result = DownloadService.generateFilename(url, suffix);
      
      expect(result).toMatch(/^Clone_Pages-\d{4,6}\.html$/);
    });
  });
});