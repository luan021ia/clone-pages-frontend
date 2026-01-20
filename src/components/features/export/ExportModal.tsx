import React, { useState } from 'react';
import { api } from '@/services/api';
import './ExportModal.css';

interface ExportModalProps {
  html: string;
  originalUrl: string;
  onClose: () => void;
}

interface ExportOptions {
  includeAssets: boolean;
  separateCSS: boolean;
  separateJS: boolean;
  minify: boolean;
  customCode?: {
    head?: string;
    bodyStart?: string;
    bodyEnd?: string;
  };
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  html, 
  originalUrl, 
  onClose 
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    includeAssets: true,
    separateCSS: true,
    separateJS: true,
    minify: false,
    customCode: {
      head: '',
      bodyStart: '',
      bodyEnd: ''
    }
  });
  
  const [exporting, setExporting] = useState(false);
  const [showCustomCode, setShowCustomCode] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      console.log('📦 [ExportModal] Iniciando export com opções:', options);

      const response = await api.post('/export-zip', {
        html,
        originalUrl,
        options
      }, {
        responseType: 'blob'
      });

      // Criar download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clone-export-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ [ExportModal] Export concluído');
      alert('Export concluído com sucesso!');
      onClose();

    } catch (error: any) {
      console.error('❌ [ExportModal] Erro:', error);
      alert('Erro ao exportar: ' + (error.response?.data?.message || error.message));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>📦 Exportar Página Completa</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="export-modal-content">
          {/* Opções de Export */}
          <div className="export-section">
            <h3>Configurações de Export</h3>

            <label className="export-checkbox">
              <input
                type="checkbox"
                checked={options.includeAssets}
                onChange={(e) => setOptions({ ...options, includeAssets: e.target.checked })}
              />
              <div className="checkbox-content">
                <strong>Incluir Assets (Imagens, Vídeos, Fontes)</strong>
                <p>Faz download de todos assets externos e inclui no ZIP</p>
              </div>
            </label>

            <label className="export-checkbox">
              <input
                type="checkbox"
                checked={options.separateCSS}
                onChange={(e) => setOptions({ ...options, separateCSS: e.target.checked })}
              />
              <div className="checkbox-content">
                <strong>Separar CSS em arquivo</strong>
                <p>Cria css/styles.css ao invés de manter inline</p>
              </div>
            </label>

            <label className="export-checkbox">
              <input
                type="checkbox"
                checked={options.separateJS}
                onChange={(e) => setOptions({ ...options, separateJS: e.target.checked })}
              />
              <div className="checkbox-content">
                <strong>Separar JavaScript em arquivo</strong>
                <p>Cria js/scripts.js ao invés de manter inline</p>
              </div>
            </label>

            <label className="export-checkbox">
              <input
                type="checkbox"
                checked={options.minify}
                onChange={(e) => setOptions({ ...options, minify: e.target.checked })}
              />
              <div className="checkbox-content">
                <strong>Minificar CSS e JS</strong>
                <p>Reduz tamanho dos arquivos (recomendado para produção)</p>
              </div>
            </label>
          </div>

          {/* Código Customizado */}
          <div className="export-section">
            <button 
              className="custom-code-toggle"
              onClick={() => setShowCustomCode(!showCustomCode)}
            >
              {showCustomCode ? '▼' : '▶'} Código Customizado (Opcional)
            </button>

            {showCustomCode && (
              <div className="custom-code-section">
                <p className="help-text">
                  Adicione códigos de Analytics, Facebook Pixel, chatbots, etc.
                </p>

                <div className="code-input-group">
                  <label>Código no &lt;head&gt;</label>
                  <textarea
                    value={options.customCode?.head || ''}
                    onChange={(e) => setOptions({
                      ...options,
                      customCode: { ...options.customCode, head: e.target.value }
                    })}
                    placeholder="<!-- Google Analytics, Facebook Pixel, etc -->"
                    rows={4}
                  />
                </div>

                <div className="code-input-group">
                  <label>Código no início do &lt;body&gt;</label>
                  <textarea
                    value={options.customCode?.bodyStart || ''}
                    onChange={(e) => setOptions({
                      ...options,
                      customCode: { ...options.customCode, bodyStart: e.target.value }
                    })}
                    placeholder="<!-- GTM noscript, etc -->"
                    rows={4}
                  />
                </div>

                <div className="code-input-group">
                  <label>Código antes de &lt;/body&gt;</label>
                  <textarea
                    value={options.customCode?.bodyEnd || ''}
                    onChange={(e) => setOptions({
                      ...options,
                      customCode: { ...options.customCode, bodyEnd: e.target.value }
                    })}
                    placeholder="<!-- Scripts, chat widgets, etc -->"
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview da Estrutura */}
          <div className="export-section">
            <h3>📁 Estrutura do ZIP</h3>
            <div className="file-tree">
              <div className="file-item">📄 index.html</div>
              {options.separateCSS && (
                <div className="file-item folder">
                  📁 css/
                  <div className="file-item nested">📄 styles.css</div>
                </div>
              )}
              {options.separateJS && (
                <div className="file-item folder">
                  📁 js/
                  <div className="file-item nested">📄 scripts.js</div>
                </div>
              )}
              {options.includeAssets && (
                <div className="file-item folder">
                  📁 assets/
                  <div className="file-item nested">📁 images/</div>
                  <div className="file-item nested">📁 videos/</div>
                  <div className="file-item nested">📁 fonts/</div>
                </div>
              )}
              <div className="file-item">📄 README.md</div>
              <div className="file-item">📄 .gitignore</div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="export-modal-footer">
          <button
            className="export-btn-primary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? '⏳ Exportando...' : '📦 Exportar ZIP'}
          </button>
          <button
            className="export-btn-secondary"
            onClick={onClose}
            disabled={exporting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
