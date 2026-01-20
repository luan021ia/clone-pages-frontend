import React, { useCallback, useState, useEffect } from 'react';
import { Logo } from '../ui/Logo';
import { URLInput } from '../features/URLInput';
import { IntegrationPanel } from '../features/IntegrationPanel';
import { EditModeToggle } from '../features/EditModeToggle';
import { ActionButtons } from '../features/ActionButtons';
import { ViewportControls } from '../features/ViewportControls';
import { PreviewFrame } from '../features/PreviewFrame';
import { WhatsAppFloat } from '../features/WhatsAppFloat';
import { useCloneState } from '../../hooks/useCloneState';
import './CloneApp.css';
import { useClipboard } from '../../hooks/useClipboard';
import { useIframe } from '../../hooks/useIframe';
import { buildQuery } from '../../utils/queryBuilder';
import { validateUrl } from '../../utils/validation';
import { CloneService } from '../../services/cloneService';
import { DownloadService } from '../../services/downloadService';
import { API_BASE_URL } from '../../config/api';
import type { ViewportMode } from '../../types/viewport.types';
import type { IntegrationConfig, IntegrationToggles } from '../../types/integration.types';
import { CLONING_STATUS, SUCCESS_STATUS } from '../../constants/app.constants';

export const CloneApp: React.FC = () => {
  const { state, updateState, resetState, updateIntegration } = useCloneState();
  const { copyToClipboard } = useClipboard();
  const { iframeRef, requestEditedHtml } = useIframe();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    console.log('=== showFeedback CHAMADO ===');
    console.log('Mensagem:', message);
    console.log('Tipo:', type);
    setFeedbackMessage(`${type}:${message}`);
    console.log('feedbackMessage definido para:', message);
    setTimeout(() => {
      console.log('Limpando feedbackMessage após 5 segundos');
      setFeedbackMessage('');
    }, 5000);
  }, []);

  // Log para verificar mudanças no feedbackMessage
  useEffect(() => {
    console.log('=== feedbackMessage MUDOU ===');
    console.log('Novo valor:', feedbackMessage);
  }, [feedbackMessage]);

  // Listener para capturar erros de clonagem do iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validar origem da mensagem
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data && event.data.source === 'CLONEPAGES_IFRAME' && event.data.type === 'CLONE_ERROR') {
        console.log('=== ERRO DE CLONAGEM RECEBIDO ===');
        console.log('Erro:', event.data.error);
        console.log('URL:', event.data.url);

        showFeedback(event.data.error, 'error');

        // Resetar o estado para permitir nova tentativa
        updateState({
          status: 'Digite a URL da página que deseja clonar',
          iframeSrc: ''
        });
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [showFeedback, updateState]);

  const startClone = useCallback(() => {
    console.log('=== startClone EXECUTADO ===');

    // Usar uma função que acessa o estado atual através do updateState
    updateState((currentState) => {
      console.log('=== DENTRO DO updateState ===');
      console.log('currentState completo:', currentState);
      console.log('startClone chamado com URL:', currentState.url);

      if (!currentState.url.trim()) {
        console.log('URL vazia, retornando estado atual');
        return currentState;
      }

      // Validar URL para evitar auto-clonagem
      const validation = validateUrl(currentState.url);
      console.log('Resultado da validação:', validation);

      if (!validation.isValid) {
        console.log('Validação falhou:', validation.message);
        alert(validation.message);
        return currentState;
      }

      console.log('Validação passou, iniciando clonagem...');

      const integrations: IntegrationConfig = {
        pixelId: currentState.pixelId,
        gtagId: currentState.gtagId,
        whatsappNumber: currentState.whatsappNumber,
        clarityId: currentState.clarityId,
        utmfyCode: currentState.utmfyCode
      };

      const toggles: IntegrationToggles = {
        pixelEnabled: currentState.pixelEnabled,
        gtagEnabled: currentState.gtagEnabled,
        whatsappEnabled: currentState.whatsappEnabled,
        clarityEnabled: currentState.clarityEnabled,
        utmfyEnabled: currentState.utmfyEnabled
      };

      const query = buildQuery({
        url: currentState.url,
        integrations,
        toggles,
        editMode: currentState.editMode
      });

      // ✅ Usar /render-page que suporta injeção de códigos customizados
      const iframeSrc = `${API_BASE_URL}/render-page?${query}`;

      console.log('🔍 [startClone] URL do iframe:', iframeSrc);

      return {
        ...currentState,
        iframeSrc,
        status: SUCCESS_STATUS
      };
    });
  }, [updateState]);

  const copyOriginalHtml = useCallback(async () => {
    console.log('=== copyOriginalHtml EXECUTADO ===');
    console.log('URL atual:', state.url);
    try {
      console.log('Chamando CloneService.getOriginalHtml...');

      // Construir parâmetros de rastreamento
      const integrations: IntegrationConfig = {
        pixelId: state.pixelId,
        gtagId: state.gtagId,
        whatsappNumber: state.whatsappNumber,
        clarityId: state.clarityId,
        utmfyCode: state.utmfyCode
      };

      // Para HTML original, ativar automaticamente os toggles quando há IDs preenchidos
      const toggles: IntegrationToggles = {
        pixelEnabled: !!state.pixelId, // Ativar se há pixelId
        gtagEnabled: !!state.gtagId, // Ativar se há gtagId
        whatsappEnabled: !!state.whatsappNumber, // Ativar se há whatsappNumber
        clarityEnabled: !!state.clarityId, // Ativar se há clarityId
        utmfyEnabled: !!state.utmfyCode // Ativar se há utmfyCode
      };



      const query = buildQuery({
        url: state.url,
        integrations,
        toggles,
        editMode: false // Para HTML original, não queremos modo de edição
      });

      console.log('Query construída:', query);

      const html = await CloneService.getOriginalHtml(state.url, query);
      console.log('HTML recebido, tamanho:', html ? html.length : 'null');
      if (html) {
        console.log('Chamando copyToClipboard...');
        const success = await copyToClipboard(html);
        console.log('Resultado do copyToClipboard:', success);
        if (success) {
          console.log('Mostrando feedback de sucesso');
          showFeedback('HTML original copiado para o clipboard!');
        } else {
          console.log('Mostrando feedback de erro');
          showFeedback('Erro ao copiar HTML para o clipboard');
        }
      } else {
        console.log('HTML é null ou vazio');
        showFeedback('Erro: HTML não encontrado');
      }
    } catch (error) {
      console.error('Erro ao copiar HTML original:', error);
      showFeedback('Erro ao copiar HTML original');
    }
  }, [state, copyToClipboard, showFeedback]);

  const copyEditedHtml = useCallback(async () => {
    try {
      const html = await requestEditedHtml();
      if (html) {
        const success = await copyToClipboard(html);
        if (success) {
          showFeedback('HTML editado copiado para o clipboard!');
        } else {
          showFeedback('Erro ao copiar HTML para o clipboard');
        }
      }
    } catch (error) {
      console.error('Erro ao copiar HTML editado:', error);
      showFeedback('Erro ao copiar HTML editado');
    }
  }, [requestEditedHtml, copyToClipboard, showFeedback]);

  const downloadOriginalHtml = useCallback(async () => {
    try {
      console.log('=== DOWNLOAD ORIGINAL HTML INICIADO ===');
      console.log('URL:', state.url);
      console.log('Estado atual das integrações:', {
        pixelId: state.pixelId,
        gtagId: state.gtagId,
        whatsappNumber: state.whatsappNumber,
        clarityId: state.clarityId,
        utmfyCode: state.utmfyCode ? '(preenchido)' : '(vazio)',
        pixelEnabled: state.pixelEnabled,
        gtagEnabled: state.gtagEnabled,
        whatsappEnabled: state.whatsappEnabled,
        clarityEnabled: state.clarityEnabled,
        utmfyEnabled: state.utmfyEnabled
      });

      // Construir parâmetros de rastreamento
      const integrations: IntegrationConfig = {
        pixelId: state.pixelId,
        gtagId: state.gtagId,
        whatsappNumber: state.whatsappNumber,
        clarityId: state.clarityId,
        utmfyCode: state.utmfyCode
      };

      // Para HTML original, ativar automaticamente os toggles quando há IDs preenchidos
      const toggles: IntegrationToggles = {
        pixelEnabled: !!state.pixelId, // Ativar se há pixelId
        gtagEnabled: !!state.gtagId, // Ativar se há gtagId
        whatsappEnabled: !!state.whatsappNumber, // Ativar se há whatsappNumber
        clarityEnabled: !!state.clarityId, // Ativar se há clarityId
        utmfyEnabled: !!state.utmfyCode // Ativar se há utmfyCode
      };

      console.log('Toggles calculados para download:', toggles);

      const query = buildQuery({
        url: state.url,
        integrations,
        toggles,
        editMode: false // Para HTML original, não queremos modo de edição
      });

      console.log('Query construída:', query);

      const html = await CloneService.getOriginalHtml(state.url, query);
      console.log('HTML obtido, tamanho:', html?.length);

      // Verificar se os códigos foram injetados procurando por data-tuglet
      if (html) {
        const hasDataTuglet = html.includes('data-tuglet');
        const hasPixel = html.includes('fbq(');
        const hasGtag = html.includes('gtag(');
        const hasClarity = html.includes('clarity(');
        const hasWhatsApp = html.includes('whatsapp-float');
        const hasUtmfy = html.includes('data-utmfy-wrapper');

        console.log('🔍 Verificação de códigos injetados:', {
          hasDataTuglet,
          hasPixel,
          hasGtag,
          hasClarity,
          hasWhatsApp,
          hasUtmfy
        });

        // Limpar artefatos do editor/bloqueio antes de baixar
        const cleaned = CloneService.cleanEditorArtifacts(html);
        const filename = DownloadService.generateFilename(state.url, 'original');
        console.log('Nome do arquivo gerado:', filename);
        console.log('HTML após limpeza ainda tem códigos?', {
          hasPixel: cleaned.includes('fbq('),
          hasGtag: cleaned.includes('gtag('),
          hasClarity: cleaned.includes('clarity('),
          hasWhatsApp: cleaned.includes('whatsapp-float'),
        });

        DownloadService.downloadHtml(cleaned, filename);
        console.log('Download iniciado com sucesso');
        showFeedback('Download do HTML original iniciado!');
      } else {
        console.log('HTML é null ou vazio');
        showFeedback('Erro: HTML não encontrado');
      }
    } catch (error) {
      console.error('Erro ao fazer download do HTML original:', error);
      showFeedback('Erro ao fazer download do HTML original');
    }
  }, [state, showFeedback]);

  const downloadEditedHtml = useCallback(async () => {
    try {
      const html = await requestEditedHtml();
      if (html) {
        const cleaned = CloneService.cleanEditorArtifacts(html);
        const filename = DownloadService.generateFilename(state.url, 'edited');
        DownloadService.downloadHtml(cleaned, filename);
      }
    } catch (error) {
      console.error('Erro ao baixar HTML editado:', error);
    }
  }, [state.url, requestEditedHtml]);

  const cleanTrackingCodes = useCallback(async () => {
    try {
      // Construir parâmetros para injeção no servidor conforme toggles
      const integrations: IntegrationConfig = {
        pixelId: state.pixelId,
        gtagId: state.gtagId,
        whatsappNumber: state.whatsappNumber,
        clarityId: state.clarityId,
        utmfyCode: state.utmfyCode,
      };
      const toggles: IntegrationToggles = {
        pixelEnabled: state.pixelEnabled,
        gtagEnabled: state.gtagEnabled,
        whatsappEnabled: state.whatsappEnabled,
        clarityEnabled: state.clarityEnabled,
        utmfyEnabled: state.utmfyEnabled,
      };
      const query = buildQuery({ url: state.url, integrations, toggles, editMode: false });
      const html = await CloneService.getOriginalHtml(state.url, query);
      if (html) {
        const cleanedHtml = CloneService.cleanTrackingCodes(html, {
          preservePixel: state.pixelEnabled && !!state.pixelId,
          preserveGtag: state.gtagEnabled && !!state.gtagId,
          preserveClarity: state.clarityEnabled && !!state.clarityId,
          preserveUtmfy: state.utmfyEnabled && !!state.utmfyCode,
          preserveWhatsApp: state.whatsappEnabled && !!state.whatsappNumber,
          pixelId: state.pixelId,
          gtagId: state.gtagId,
          clarityId: state.clarityId,
        });
        const finalHtml = CloneService.cleanEditorArtifacts(cleanedHtml);
        const filename = DownloadService.generateFilename(state.url, 'clean');
        DownloadService.downloadHtml(finalHtml, filename);
      }
    } catch (error) {
      console.error('Erro ao limpar códigos de rastreamento:', error);
    }
  }, [state.url]);

  const handleIntegrationChange = useCallback((key: keyof IntegrationConfig, value: string) => {
    updateIntegration(key, value);
  }, [updateIntegration]);

  const handleToggleChange = useCallback((key: keyof IntegrationToggles, value: boolean) => {
    updateIntegration(key, value);
  }, [updateIntegration]);

  const handleViewportChange = useCallback((mode: ViewportMode) => {
    updateState({ viewportMode: mode });
  }, [updateState]);

  const handleEditModeChange = useCallback((editMode: boolean) => {
    updateState({ editMode });
  }, [updateState]);

  const handleUrlChange = useCallback((url: string) => {
    updateState({ url });
  }, [updateState]);

  const isLoading = state.status === CLONING_STATUS;

  return (
    <div className="app">
      <div className="header">
        <Logo src="/spycopy-logo.png" alt="Clone Pages" />
        <a href="mailto:suporte@spytools.com.br" className="support">
          Suporte
        </a>
      </div>

      <URLInput
        url={state.url}
        onUrlChange={handleUrlChange}
        onClone={startClone}
        disabled={isLoading}
      />

      <IntegrationPanel
        integrations={{
          pixelId: state.pixelId,
          gtagId: state.gtagId,
          whatsappNumber: state.whatsappNumber,
          clarityId: state.clarityId,
          utmfyCode: state.utmfyCode
        }}
        toggles={{
          pixelEnabled: state.pixelEnabled,
          gtagEnabled: state.gtagEnabled,
          whatsappEnabled: state.whatsappEnabled,
          clarityEnabled: state.clarityEnabled,
          utmfyEnabled: state.utmfyEnabled
        }}
        onIntegrationChange={handleIntegrationChange}
        onToggleChange={handleToggleChange}
      />

      <EditModeToggle
        editMode={state.editMode}
        onEditModeChange={handleEditModeChange}
        disabled={isLoading}
      />

      <ActionButtons
        onCopyOriginal={copyOriginalHtml}
        onCopyEdited={copyEditedHtml}
        onDownloadOriginal={downloadOriginalHtml}
        onDownloadEdited={downloadEditedHtml}
        onCleanCodes={cleanTrackingCodes}
        onReset={resetState}
        disabled={isLoading || !state.iframeSrc}
        editMode={state.editMode}
      />

      <ViewportControls
        currentMode={state.viewportMode}
        onModeChange={handleViewportChange}
      />

      <PreviewFrame
        ref={iframeRef}
        src={state.iframeSrc}
        viewportMode={state.viewportMode}
        status={state.status}
      />

      <WhatsAppFloat
        whatsappNumber={state.whatsappNumber}
        enabled={state.whatsappEnabled}
      />

      {feedbackMessage && (
        <div
          className={`feedback-message ${feedbackMessage.startsWith('error:') ? 'feedback-error' :
                      feedbackMessage.startsWith('warning:') ? 'feedback-warning' :
                      feedbackMessage.startsWith('info:') ? 'feedback-info' : 'feedback-success'}`}
          ref={(el) => {
            if (el) {
              console.log('=== ELEMENTO FEEDBACK RENDERIZADO ===');
              console.log('Elemento:', el);
              console.log('Texto:', el.textContent);

              const rect = el.getBoundingClientRect();
              console.log('Posição - top:', rect.top);
              console.log('Posição - right:', rect.right);
              console.log('Posição - width:', rect.width);
              console.log('Posição - height:', rect.height);

              const style = window.getComputedStyle(el);
              console.log('Display:', style.display);
              console.log('Position:', style.position);
              console.log('Z-index:', style.zIndex);
              console.log('Opacity:', style.opacity);
              console.log('Visibility:', style.visibility);
              console.log('Background-color:', style.backgroundColor);
            }
          }}
        >
          <div className="feedback-content">
            {feedbackMessage.startsWith('error:') && (
              <span className="feedback-icon">⚠️</span>
            )}
            {feedbackMessage.startsWith('warning:') && (
              <span className="feedback-icon">⚠️</span>
            )}
            {feedbackMessage.startsWith('info:') && (
              <span className="feedback-icon">ℹ️</span>
            )}
            {feedbackMessage.startsWith('success:') && (
              <span className="feedback-icon">✅</span>
            )}
            <span className="feedback-text">
              {feedbackMessage.includes(':') ? feedbackMessage.split(':').slice(1).join(':') : feedbackMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
