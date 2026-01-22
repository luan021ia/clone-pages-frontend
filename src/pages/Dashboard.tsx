import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCloneState } from '../hooks/useCloneState';
import { useClipboard } from '../hooks/useClipboard';
import { useIframe } from '../hooks/useIframe';
import { useEditor } from '../hooks/useEditor';
import { validateUrl } from '../utils/validation';
import { buildApiUrl, API_BASE_URL } from '../config/api';
import { api } from '../services/api';
import { DownloadService } from '../services/downloadService';
import { CloneService } from '../services/cloneService';
import ToggleSwitch from '../components/ToggleSwitch/ToggleSwitch';
import { EditorPanel } from '../components/features/EditorPanel';
import { ExpandButton } from '../components/ExpandButton';
import { useExpandButton } from '../hooks/useExpandButton';
import { CLONING_STATUS, SUCCESS_STATUS } from '../constants/app.constants';
import { Copy, Download, Package } from 'lucide-react';
import { authService } from '../services/authService';
import type { LicenseInfo } from '../services/authService';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { state, updateState, updateIntegration } = useCloneState();
  const { copyToClipboard } = useClipboard();
  const { iframeRef } = useIframe();
  const {
    selectedElement,
    hasEdits,
    hasSavedEdits,
    updateElement,
    getEditedHtml,
    restoreOriginalHtml: _restoreOriginalHtml,
    clearSelection,
    saveEdits,
    duplicateElement,
    // 🎯 Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historyLength,
    // 🔧 Configurações da Página
    openPageSettings,
  } = useEditor(iframeRef);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);
  const [wasEditModeActive, setWasEditModeActive] = useState(false);
  const [savedEditedHtml, setSavedEditedHtml] = useState<string | null>(null);
  const [htmlWithEditorInjected, setHtmlWithEditorInjected] = useState<string | null>(null);
  const prevEditModeRef = useRef<boolean>(state.editMode);
  const isInjectingRef = useRef<boolean>(false);

  // Estado simples para histórico de URLs
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Estado para controlar erro de clonagem
  const [cloneError, setCloneError] = useState<string | null>(null);
  const cloneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estado para loading do modo edição
  const [isEditorLoading, setIsEditorLoading] = useState(false);

  // Estado para loading ao aplicar códigos de rastreamento
  const [isApplyingCodes, setIsApplyingCodes] = useState(false);

  // Estado para loading durante download
  const [isDownloading, setIsDownloading] = useState(false);

  // Estado para modal de perfil do usuário
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Estado para sidebar recolhível (aberta por padrão)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Estado para licença do usuário
  const [userLicense, setUserLicense] = useState<LicenseInfo | null>(null);
  const [loadingLicense, setLoadingLicense] = useState(false);

  // 📦 Estado para Export Modal
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Estado para histórico dos códigos de rastreamento
  const [pixelHistory, setPixelHistory] = useState<string[]>([]);
  const [gtagHistory, setGtagHistory] = useState<string[]>([]);
  const [utmfyHistory, setUtmfyHistory] = useState<string[]>([]);
  const [clarityHistory, setClarityHistory] = useState<string[]>([]);
  const [whatsappHistory, setWhatsappHistory] = useState<string[]>([]);

  // Estado para mostrar dropdowns de histórico
  const [showPixelHistory, setShowPixelHistory] = useState(false);
  const [showGtagHistory, setShowGtagHistory] = useState(false);
  const [showUtmfyHistory, setShowUtmfyHistory] = useState(false);
  const [showClarityHistory, setShowClarityHistory] = useState(false);
  const [showWhatsappHistory, setShowWhatsappHistory] = useState(false);

  // Ref para rastrear o último iframeSrc que foi adicionado ao histórico
  const lastHistorySavedIframeSrcRef = useRef<string | null>(null);

  const isLoading = state.status === CLONING_STATUS;

  // Carregar histórico do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('clonepages-url-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Limpar histórico corrompido e garantir que seja apenas strings
        const cleanHistory = parsed
          .filter((item: any) => item && (typeof item === 'string' || (typeof item === 'object' && item.url)))
          .map((item: any) => typeof item === 'string' ? item : item.url)
          .slice(0, 10);
        setUrlHistory(cleanHistory);
      }
    } catch (error) {
      // Limpar localStorage corrompido
      localStorage.removeItem('clonepages-url-history');
      setUrlHistory([]);
    }
  }, []);

  // Salvar histórico quando mudar
  useEffect(() => {
    if (urlHistory.length > 0) {
      try {
        localStorage.setItem('clonepages-url-history', JSON.stringify(urlHistory));
      } catch (error) {
      }
    }
  }, [urlHistory]);

  // Adicionar URL ao histórico APENAS quando uma nova clonagem for concluída (iframeSrc mudar)
  useEffect(() => {
    // ✅ FIX: Só adicionar ao histórico quando iframeSrc MUDAR (nova clonagem), não quando o usuário digitar
    // Verificar se iframeSrc mudou desde o último salvamento
    if (!isLoading && state.iframeSrc && state.iframeSrc !== lastHistorySavedIframeSrcRef.current) {
      const url = state.url.trim();

      if (url) {
        // Usar callback para ter acesso ao estado atualizado de urlHistory
        setUrlHistory(prevHistory => {
          const exists = prevHistory.some(item => item === url);

          if (!exists) {
            // Marcar este iframeSrc como processado
            lastHistorySavedIframeSrcRef.current = state.iframeSrc;
            return [url, ...prevHistory.slice(0, 9)]; // Máximo 10
          }

          // Marcar como processado mesmo se já existir (para não processar novamente)
          lastHistorySavedIframeSrcRef.current = state.iframeSrc;
          return prevHistory;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, state.iframeSrc]); // ✅ Removido state.url e urlHistory das dependências para evitar salvar a cada caractere digitado

  // Carregar históricos dos códigos do localStorage
  useEffect(() => {
    try {
      const pixelData = localStorage.getItem('clonepages-pixel-history');
      if (pixelData) setPixelHistory(JSON.parse(pixelData).slice(0, 5));

      const gtagData = localStorage.getItem('clonepages-gtag-history');
      if (gtagData) setGtagHistory(JSON.parse(gtagData).slice(0, 5));

      const utmfyData = localStorage.getItem('clonepages-utmfy-history');
      if (utmfyData) setUtmfyHistory(JSON.parse(utmfyData).slice(0, 5));

      const clarityData = localStorage.getItem('clonepages-clarity-history');
      if (clarityData) setClarityHistory(JSON.parse(clarityData).slice(0, 5));

      const whatsappData = localStorage.getItem('clonepages-whatsapp-history');
      if (whatsappData) setWhatsappHistory(JSON.parse(whatsappData).slice(0, 5));
    } catch (error) {
    }
  }, []);

  // Salvar históricos dos códigos no localStorage
  useEffect(() => {
    if (pixelHistory.length > 0) localStorage.setItem('clonepages-pixel-history', JSON.stringify(pixelHistory));
  }, [pixelHistory]);

  useEffect(() => {
    if (gtagHistory.length > 0) localStorage.setItem('clonepages-gtag-history', JSON.stringify(gtagHistory));
  }, [gtagHistory]);

  useEffect(() => {
    if (utmfyHistory.length > 0) localStorage.setItem('clonepages-utmfy-history', JSON.stringify(utmfyHistory));
  }, [utmfyHistory]);

  useEffect(() => {
    if (clarityHistory.length > 0) localStorage.setItem('clonepages-clarity-history', JSON.stringify(clarityHistory));
  }, [clarityHistory]);

  useEffect(() => {
    if (whatsappHistory.length > 0) localStorage.setItem('clonepages-whatsapp-history', JSON.stringify(whatsappHistory));
  }, [whatsappHistory]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      // Para o histórico de URL, verificar se clicou fora do input E do dropdown
      if (showHistory && !target.closest('.url-input') && !target.closest('.url-history-dropdown')) {
        setShowHistory(false);
      }
      if (showPixelHistory && !target.closest('.pixel-group')) setShowPixelHistory(false);
      if (showGtagHistory && !target.closest('.gtag-group')) setShowGtagHistory(false);
      if (showUtmfyHistory && !target.closest('.utmfy-group')) setShowUtmfyHistory(false);
      if (showClarityHistory && !target.closest('.clarity-group')) setShowClarityHistory(false);
      if (showWhatsappHistory && !target.closest('.whatsapp-group')) setShowWhatsappHistory(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showHistory, showPixelHistory, showGtagHistory, showUtmfyHistory, showClarityHistory, showWhatsappHistory]);

  // Carregar licença do usuário
  useEffect(() => {
    if (!user?.id) return;

    const loadLicense = async () => {
      try {
        setLoadingLicense(true);
        const license = await authService.getUserLicense(user.id);
        setUserLicense(license || null);
      } catch (error) {
        // Silencioso - admin ou usuário sem licença não precisa mostrar erro
        setUserLicense(null);
      } finally {
        setLoadingLicense(false);
      }
    };

    loadLicense();
  }, [user?.id]);

  // Adicionar valor ao histórico (máximo 5 itens)
  const addToHistory = (value: string, history: string[], setHistory: (h: string[]) => void) => {
    if (!value) return;
    const exists = history.some(item => item === value);
    if (!exists) {
      const newHistory = [value, ...history.slice(0, 4)]; // Máximo 5
      setHistory(newHistory);
    }
  };

  // 🎯 Função para injetar o editor COMPLETO via servidor
  const injectEditorCompleteViaServer = useCallback(async (html: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/inject-editor`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: html
      });

      if (!response.ok) {
        throw new Error(`Falha ao injetar editor: ${response.status}`);
      }

      const htmlWithEditor = await response.text();
      return htmlWithEditor;

    } catch (error) {
      return null;
    }
  }, []);

  // 🎯 Função alternativa: injetar apenas script de ativação (fallback)
  const injectEditorScriptInHtml = useCallback((html: string): string => {
    // Verificar se o script já existe
    if (html.includes('id="cp-editor-script"')) {
      return html;
    }

    // 🎬 Remover autoplay do YouTube (para não atrapalhar no modo edição)
    let processedHtml = html
      .replace(/autoplay=1/gi, 'autoplay=0')
      .replace(/autoplay="1"/gi, 'autoplay="0"')
      .replace(/autoplay='1'/gi, "autoplay='0'");

    // Adicionar um script mínimo que ativa o editor no HTML editado
    const editorActivationScript = `<script id="cp-editor-script">
(function() {
  'use strict';

  // Marcar HTML como em modo edição
  document.documentElement.setAttribute('data-clonepages-edit', 'true');

  // 🚫 BLOQUEAR NAVEGAÇÃO: Prevenir cliques em links e botões
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button, [role="button"]');
    if (target) {
      // Apenas permitir cliques se o elemento NÃO é da página clonada
      // (permitir cliques no próprio editor que será injetado)
      const isEditorElement = target.closest('[data-editor-panel]');
      if (!isEditorElement) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }, true); // useCapture = true para interceptar ANTES do elemento

  // 🚫 BLOQUEAR SCROLL DE ÂNCORAS: Prevenir navegação por hash (#section)
  window.addEventListener('hashchange', function(e) {
    e.preventDefault();
  }, true);

  // Tentar carregar o editor completo via postMessage
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      source: 'EDITOR_IFRAME',
      type: 'EDITOR_READY'
    }, '*');
  }
})();
</script>`;

    // Injetar antes do </body>
    if (processedHtml.includes('</body>')) {
      return processedHtml.replace('</body>', editorActivationScript + '\n</body>');
    }

    // Se não tem </body>, injetar no final
    return processedHtml + editorActivationScript;
  }, []);

  // 🎯 FUNÇÃO: Injetar códigos de tracking no HTML local (sem precisar do servidor)
  const injectTrackingCodesLocally = useCallback((html: string, options: {
    pixelId?: string;
    gtagId?: string;
    clarityId?: string;
    utmfyCode?: string;
    whatsappNumber?: string;
  }): string => {
    let injections = '';

    // Meta Pixel
    if (options.pixelId) {
      injections += `
<!-- Meta Pixel Code (Tuglet) -->
<script data-tuglet="true">
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${options.pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${options.pixelId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
`;
    }

    // Google Tag Manager
    if (options.gtagId) {
      injections += `
<!-- Google tag (gtag.js) (Tuglet) -->
<script async data-tuglet="true" src="https://www.googletagmanager.com/gtag/js?id=${options.gtagId}"></script>
<script data-tuglet="true">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${options.gtagId}');
</script>
<!-- End Google tag -->
`;
    }

    // Microsoft Clarity
    if (options.clarityId) {
      injections += `
<!-- Microsoft Clarity (Tuglet) -->
<script type="text/javascript" data-tuglet="true">
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${options.clarityId}");
</script>
<!-- End Microsoft Clarity -->
`;
    }

    // UTMFY
    if (options.utmfyCode) {
      injections += `<script data-tuglet="true" data-utmfy-wrapper="true">\n${options.utmfyCode}\n</script>`;
    }

    // WhatsApp Button
    if (options.whatsappNumber) {
      injections += `
<!-- WhatsApp Button (Tuglet) -->
<style data-tuglet="true">
.whatsapp-float {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 40px;
  right: 40px;
  background-color: #25d366;
  color: #FFF;
  border-radius: 50px;
  text-align: center;
  font-size: 30px;
  box-shadow: 2px 2px 3px #999;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
}
.whatsapp-float:hover {
  background-color: #128c7e;
  transform: scale(1.1);
}
.whatsapp-float svg {
  fill: white;
  width: 35px;
  height: 35px;
}
</style>
<a href="https://wa.me/${options.whatsappNumber}" class="whatsapp-float" target="_blank" rel="noopener noreferrer" data-tuglet="true">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
</a>
<!-- End WhatsApp Button -->
`;
    }

    // 🧹 SEMPRE remover códigos antigos PRIMEIRO (independente se vai injetar novos)
    let cleanedHtml = html.replace(/<!-- Meta Pixel Code \(Tuglet\) -->[\s\S]*?<!-- End Meta Pixel Code -->/g, '');
    cleanedHtml = cleanedHtml.replace(/<!-- Google tag \(gtag\.js\) \(Tuglet\) -->[\s\S]*?<!-- End Google tag -->/g, '');
    cleanedHtml = cleanedHtml.replace(/<!-- Microsoft Clarity \(Tuglet\) -->[\s\S]*?<!-- End Microsoft Clarity -->/g, '');
    cleanedHtml = cleanedHtml.replace(/<!-- WhatsApp Button \(Tuglet\) -->[\s\S]*?<!-- End WhatsApp Button -->/g, '');
    cleanedHtml = cleanedHtml.replace(/<script data-tuglet="true" data-utmfy-wrapper="true">[\s\S]*?<\/script>/g, '');

    // Se não tem nada para injetar, retornar HTML limpo (sem códigos)
    if (!injections) {
      return cleanedHtml;
    }

    // Injetar antes do </head>
    if (cleanedHtml.includes('</head>')) {
      return cleanedHtml.replace('</head>', `${injections}\n</head>`);
    }

    // Se não tem </head>, injetar antes do </body>
    if (cleanedHtml.includes('</body>')) {
      return cleanedHtml.replace('</body>', `${injections}\n</body>`);
    }

    // Fallback: adicionar no final
    return cleanedHtml + injections;
  }, []);

  // 🎯 EFFECT: Quando reativa editMode com savedEditedHtml, injetar editor completo
  useEffect(() => {
    // Ativar: state.editMode é true, temos savedEditedHtml, e ainda não injetamos
    const shouldInject = state.editMode && savedEditedHtml && !htmlWithEditorInjected && !isInjectingRef.current;

    if (shouldInject) {
      isInjectingRef.current = true;

      injectEditorCompleteViaServer(savedEditedHtml).then((htmlWithEditor) => {
        isInjectingRef.current = false;
        if (htmlWithEditor) {
          setHtmlWithEditorInjected(htmlWithEditor);
        } else {
          const fallbackHtml = injectEditorScriptInHtml(savedEditedHtml);
          setHtmlWithEditorInjected(fallbackHtml);
        }
      }).catch(() => {
        isInjectingRef.current = false;
      });
    }

    // Desativar: editMode é false, limpar htmlWithEditorInjected
    if (!state.editMode && htmlWithEditorInjected) {
      setHtmlWithEditorInjected(null);
    }
  }, [state.editMode, savedEditedHtml, htmlWithEditorInjected]);

  // Hook para gerenciar expansão do preview
  const { isExpanded, expand: expandPreview, collapse: collapsePreview } = useExpandButton({
    initialExpanded: false,
    onExpand: () => { },
    onCollapse: () => { },
    enabled: state.editMode,
    storageKey: 'clonepages-expand-state',
  });

  // Funções para expandir/contrair preview
  const handleExpandPreview = useCallback(() => {
    expandPreview();
  }, [expandPreview]);

  const handleCollapsePreview = useCallback(() => {
    collapsePreview();
  }, [collapsePreview]);

  const showFeedback = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      // Simplificar mensagens para formato minimalista
      let simpleMessage = message;

      // Transformar mensagens longas em curtas
      if (message.includes('Iniciando download')) {
        simpleMessage = 'Iniciando download...';
      } else if (message.includes('Download concluído')) {
        simpleMessage = 'Download concluído';
      } else if (message.includes('Edições salvas com sucesso')) {
        simpleMessage = 'Edição concluída';
      } else if (message.includes('Nenhum elemento selecionado')) {
        simpleMessage = 'Selecione um elemento';
      } else if (message.includes('Desative o Modo Edição')) {
        simpleMessage = 'Desative o modo edição';
      } else if (message.includes('HTML copiado')) {
        simpleMessage = 'Código copiado';
      } else if (message.includes('Erro ao salvar')) {
        simpleMessage = 'Erro ao salvar';
      } else if (message.includes('Erro ao fazer download')) {
        simpleMessage = 'Erro no download';
      } else if (message.includes('Erro ao copiar')) {
        simpleMessage = 'Erro ao copiar';
      } else if (message.includes('Aviso: Alguns códigos foram removidos')) {
        simpleMessage = 'Códigos removidos';
      }

      setFeedbackMessage({ text: simpleMessage, type });
      setTimeout(() => setFeedbackMessage(null), 3000); // Reduzir para 3s
    },
    []
  );

  // Garantir que a expansão seja desligada quando o modo editor estiver off
  useEffect(() => {
    if (!state.editMode) {
      collapsePreview();
    }
  }, [state.editMode, collapsePreview]);

  // Helper para construir URL de render-page com parâmetros customizados
  const buildRenderPageUrl = useCallback(
    (
      url: string,
      options: {
        editMode?: boolean;
        injectCustom?: boolean;
        pixelId?: string;
        gtagId?: string;
        whatsappNumber?: string;
        clarityId?: string;
        utmfyCode?: string;
      }
    ) => {
      const params: Record<string, string | number | boolean> = { url };

      if (options.editMode !== undefined) params.editMode = options.editMode;
      if (options.injectCustom !== undefined)
        params.injectCustom = options.injectCustom;
      if (options.pixelId) params.pixelId = options.pixelId;
      if (options.gtagId) params.gtagId = options.gtagId;
      if (options.whatsappNumber)
        params.whatsappNumber = options.whatsappNumber;
      if (options.clarityId) params.clarityId = options.clarityId;
      if (options.utmfyCode) params.utmfyCode = options.utmfyCode;

      return buildApiUrl('RENDER_PAGE', params);
    },
    []
  );

  // Função para verificar se o script de edição foi injetado via postMessage
  const checkEditorScript = useCallback(() => {
    if (!iframeRef.current?.contentWindow) {

      return;
    }

    // Usar postMessage para verificar o status do editor sem problemas de cross-origin
    const checkTimeout = setTimeout(() => {

    }, 3000);

    const handleEditorStatusMessage = (event: MessageEvent) => {
      // Aceitar mensagens do iframe atual via WindowProxy ou por origem igual ao src do iframe
      let fromCurrentIframe =
        !!iframeRef.current?.contentWindow &&
        event.source === iframeRef.current.contentWindow;

      if (!fromCurrentIframe && iframeRef.current) {
        try {
          const iframeSrc = (iframeRef.current.getAttribute('src') || '').toString();
          const iframeOrigin = iframeSrc ? new URL(iframeSrc).origin : null;
          if (iframeOrigin && event.origin === iframeOrigin) {
            fromCurrentIframe = true;
          }
        } catch { }
      }

      if (!fromCurrentIframe) {
        return;
      }

      if (
        event.data?.source === 'EDITOR_IFRAME' &&
        event.data?.type === 'EDITOR_STATUS'
      ) {
        clearTimeout(checkTimeout);
        window.removeEventListener('message', handleEditorStatusMessage);

        const status = event.data.data;



        if (!status.hasEditAttribute || !status.hasEditorScript) {



        } else {

        }
      }
    };

    window.addEventListener('message', handleEditorStatusMessage);

    // Solicitar status do editor

    iframeRef.current.contentWindow.postMessage(
      {
        source: 'EDITOR_PARENT',
        type: 'GET_EDITOR_STATUS',
      },
      '*'
    );
  }, [iframeRef, state.editMode, state.iframeSrc]);

  // 🎯 FUNÇÃO: Limpar scripts e classes de editor do HTML
  const cleanEditorScriptsFromHtml = useCallback((html: string): string => {
    // Remover script do editor visual (#cp-editor-script)
    let cleanedHtml = html.replace(/<script[^>]*id="cp-editor-script"[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remover script de proteção (#cp-protection-script)
    cleanedHtml = cleanedHtml.replace(/<script[^>]*id="cp-protection-script"[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remover estilo do editor (#cp-editor-style)
    cleanedHtml = cleanedHtml.replace(/<style[^>]*id="cp-editor-style"[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remover classes de seleção dos elementos (cp-selected, cp-hover-highlight)
    cleanedHtml = cleanedHtml.replace(/\s+class="([^"]*)"/g, (_match, classValue: string) => {
      // Remover cp-selected, cp-hover-highlight, cp-edit-mode
      const newClasses = classValue
        .split(' ')
        .filter((c: string) => !['cp-selected', 'cp-hover-highlight', 'cp-edit-mode'].includes(c))
        .join(' ');
      return newClasses ? ` class="${newClasses}"` : '';
    });

    // Remover atributos data-clonepages-edit se existirem
    cleanedHtml = cleanedHtml.replace(/\s+data-clonepages-edit="[^"]*"/g, '');

    return cleanedHtml;
  }, []);

  // Wrapper para restoreOriginalHtml que também limpa savedEditedHtml
  // 🎯 FUNÇÃO MANOVA: Salvar todas as edições manualmente
  const handleSaveAllEdits = useCallback(async () => {

    if (!iframeRef.current?.contentWindow) {

      showFeedback('Erro ao salvar edições');
      return;
    }

    try {
      // Capturar HTML editado do iframe
      const editedHtml = await getEditedHtml();

      if (editedHtml && editedHtml.trim().length > 0) {

        // 🎯 LIMPAR scripts de editor APENAS PARA ARMAZENAMENTO
        const cleanedHtml = cleanEditorScriptsFromHtml(editedHtml);

        // 🎯 NOVA LÓGICA: NÃO re-injetar ao salvar - manter iframe como está!
        // Apenas salvar o HTML limpo no estado para persistência
        // O iframe continuará com o editor ativo e na mesma posição de scroll
        // Re-injeção só acontece quando:
        // 1. Desligar o modo edição
        // 2. Reativar o modo edição (useEffect já cuida disso)

        // Salvar HTML limpo no estado
        setSavedEditedHtml(cleanedHtml);

        // Salvar edições no hook
        saveEdits();

        showFeedback('✅ Edições salvas com sucesso!');

      } else {

        showFeedback('Erro ao salvar: HTML inválido');
      }
    } catch (error) {

      showFeedback('Erro ao salvar edições');
    }
  }, [getEditedHtml, saveEdits, showFeedback, cleanEditorScriptsFromHtml]);

  // 🎯 FUNÇÃO MANOVA: Remover elemento selecionado
  const handleRemoveElement = useCallback(() => {

    if (!selectedElement) {
      showFeedback('❌ Nenhum elemento selecionado para remover');
      return;
    }

    if (!iframeRef.current?.contentWindow) {
      showFeedback('❌ IFrame não está disponível');
      return;
    }

    try {
      // Enviar mensagem para o iframe remover o elemento
      iframeRef.current.contentWindow.postMessage({
        type: 'CLONEPAGES_REMOVE_ELEMENT',
        selector: selectedElement.selector
      }, '*');

      // A limpeza da seleção e o feedback serão feitos quando recebermos a resposta

    } catch (error) {

      showFeedback('Erro ao remover elemento');
      // Forçar limpeza em caso de erro
      clearSelection();
    }
  }, [selectedElement, clearSelection, showFeedback]);

  // 🎯 Handler para fechar popup de erro
  const handleCloseError = useCallback(() => {
    setCloneError(null);
    if (cloneTimeoutRef.current) {
      clearTimeout(cloneTimeoutRef.current);
      cloneTimeoutRef.current = null;
    }
  }, []);


  const startClone = useCallback(() => {
    // Fechar dropdown de histórico ao clonar
    setShowHistory(false);

    // 🎯 FIX: Limpar TODOS os estados de edição ao clonar nova página
    setSavedEditedHtml(null);
    setHtmlWithEditorInjected(null); // ✅ CRÍTICO: Limpar HTML com editor injetado

    // 🎯 Limpar histórico de undo/redo ao iniciar nova clonagem
    clearHistory();

    // Resetar flag de injeção
    isInjectingRef.current = false;

    // Limpar erro anterior
    setCloneError(null);

    // Limpar timeout anterior
    if (cloneTimeoutRef.current) {
      clearTimeout(cloneTimeoutRef.current);
      cloneTimeoutRef.current = null;
    }

    updateState((currentState) => {
      if (!currentState.url.trim()) {
        return currentState;
      }

      const validation = validateUrl(currentState.url);
      if (!validation.isValid) {
        alert(validation.message);
        return currentState;
      }

      // 🎯 FORÇA RELOAD: Adicionar timestamp para forçar React recriar iframe
      // Isso garante que mesmo clonando a MESMA URL, o iframe será remontado
      const timestamp = Date.now();

      // 🎯 NOVA LÓGICA: Usar /render-page com injectCustom=false
      const iframeSrc = buildApiUrl('RENDER_PAGE', {
        url: currentState.url,
        editMode: currentState.editMode,
        injectCustom: false,
        _t: timestamp.toString(), // Cache buster para forçar reload
      });


      // 🎯 Iniciar timeout de 120 segundos para detectar erro de clonagem
      // Sites Next.js com Puppeteer demoram mais (20-30s é normal)
      cloneTimeoutRef.current = setTimeout(() => {

        setCloneError('A clonagem está demorando muito. O site pode estar indisponível ou muito pesado.');
      }, 120000); // 120 segundos (2 minutos)

      return {
        ...currentState,
        iframeSrc,
        status: CLONING_STATUS, // ✅ Mostrar loading enquanto clona
        editMode: false, // ✅ Desativar modo edição ao clonar novamente
      };
    });
  }, [updateState, clearHistory]);

  // 🎯 Handler para tentar clonar novamente (definido após startClone)
  const handleRetryClone = useCallback(() => {
    setCloneError(null);
    if (cloneTimeoutRef.current) {
      clearTimeout(cloneTimeoutRef.current);
      cloneTimeoutRef.current = null;
    }
    // Clonar novamente
    startClone();
  }, [startClone]);

  // 🎯 Handler para toggle do modo edição com loading
  const handleEditModeToggle = useCallback((checked: boolean) => {

    // Ativar loading
    setIsEditorLoading(true);

    // Atualizar estado do modo edição
    updateState({ editMode: checked });

    // 🔧 Se ativando o modo editor, abrir automaticamente as configurações da página
    // Isso evita que o painel fique vazio quando não há elemento selecionado
    if (checked) {
      // Delay para garantir que o iframe carregue primeiro
      setTimeout(() => {

        openPageSettings();
      }, 500);
    }

    // O loading será desativado no onLoad do iframe
  }, [updateState, openPageSettings]);

  const copyOriginalHtml = useCallback(async () => {
    try {
      // 🔒 SEGURANÇA: Bloquear cópia se Modo Edição está ativo
      if (state.editMode) {
        showFeedback('⚠️ Desative o Modo Edição para copiar o código', 'warning');
        return;
      }

      // Validação inicial: verificar se há conteúdo para copiar
      if (!state.iframeSrc || state.iframeSrc.trim().length === 0) {
        showFeedback('Nenhum conteúdo disponível para copiar. Clone uma página primeiro.', 'error');
        return;
      }

      console.log('📋 [Copy] Iniciando cópia do HTML...');

      let html: string | null = null;
      let source: string = '';

      // 🎯 PRIORIDADE 1: Se tem HTML salvo de edições anteriores, usar ele
      if (savedEditedHtml && hasSavedEdits) {
        console.log('📋 [Copy] Usando HTML editado salvo');
        html = savedEditedHtml;
        source = 'edições salvas';
      }

      // 🎯 PRIORIDADE 2: Buscar do servidor COM OS CÓDIGOS INJETADOS
      if (!html) {
        console.log('📋 [Copy] Buscando HTML do servidor...');

        // Verificar se há códigos de rastreamento habilitados
        const hasCustomCodes = Boolean(
          (state.pixelId && state.pixelEnabled) ||
          (state.gtagId && state.gtagEnabled) ||
          (state.whatsappNumber && state.whatsappEnabled) ||
          (state.clarityId && state.clarityEnabled) ||
          (state.utmfyCode && state.utmfyEnabled)
        );

        const copyUrl = buildRenderPageUrl(state.url, {
          editMode: false,
          injectCustom: hasCustomCodes,
          pixelId: state.pixelId && state.pixelEnabled ? state.pixelId : undefined,
          gtagId: state.gtagId && state.gtagEnabled ? state.gtagId : undefined,
          whatsappNumber: state.whatsappNumber && state.whatsappEnabled ? state.whatsappNumber : undefined,
          clarityId: state.clarityId && state.clarityEnabled ? state.clarityId : undefined,
          utmfyCode: state.utmfyCode && state.utmfyEnabled ? state.utmfyCode : undefined,
        });

        const response = await fetch(copyUrl);
        if (!response.ok) {
          throw new Error(`Falha ao buscar HTML: ${response.status} ${response.statusText}`);
        }
        html = await response.text();
        source = 'servidor';
      }

      // Validação final
      if (!html || html.trim().length === 0) {
        showFeedback('❌ Erro: HTML vazio. Tente clonar a página novamente.', 'error');
        return;
      }

      console.log(`📋 [Copy] HTML obtido de ${source}:`, html.length, 'caracteres');

      // Copiar para clipboard
      const success = await copyToClipboard(html);
      
      if (success) {
        // Verificar se há códigos de rastreamento incluídos
        const trackingCodesIncluded = [];
        if (state.pixelId && html.includes(state.pixelId)) trackingCodesIncluded.push('Meta Pixel');
        if (state.gtagId && html.includes(state.gtagId)) trackingCodesIncluded.push('Google Analytics');
        if (state.clarityId && html.includes(state.clarityId)) trackingCodesIncluded.push('Clarity');
        if (state.utmfyCode && html.includes(state.utmfyCode)) trackingCodesIncluded.push('UTMFY');
        if (state.whatsappNumber && html.includes(state.whatsappNumber)) trackingCodesIncluded.push('WhatsApp');

        // Feedback detalhado
        let message = '✅ HTML copiado com sucesso';
        if (savedEditedHtml && hasSavedEdits) {
          message += ' (com suas edições)';
        }
        if (trackingCodesIncluded.length > 0) {
          message += ` + ${trackingCodesIncluded.join(', ')}`;
        }
        
        showFeedback(message);
        console.log('✅ [Copy] HTML copiado com sucesso');
      } else {
        showFeedback('❌ Erro ao copiar. Verifique as permissões do navegador.', 'error');
        console.error('❌ [Copy] Falha ao copiar para clipboard');
      }
    } catch (error) {
      console.error('❌ [Copy] Erro ao copiar HTML:', error);
      showFeedback('❌ Erro ao copiar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'), 'error');
    }
  }, [
    state.editMode,
    state.iframeSrc,
    state.url,
    state.pixelId,
    state.pixelEnabled,
    state.gtagId,
    state.gtagEnabled,
    state.whatsappNumber,
    state.whatsappEnabled,
    state.clarityId,
    state.clarityEnabled,
    state.utmfyCode,
    state.utmfyEnabled,
    copyToClipboard,
    showFeedback,
    savedEditedHtml,
    hasSavedEdits,
  ]);

  const downloadOriginalHtml = useCallback(async () => {
    try {
      // 🔒 SEGURANÇA: Bloquear download se Modo Edição está ativo
      if (state.editMode) {
        showFeedback('⚠️ Desative o Modo Edição para baixar a página', 'warning');
        return;
      }

      // Validação inicial
      if (!state.iframeSrc || state.iframeSrc.trim().length === 0) {
        showFeedback('Nenhum conteúdo disponível para baixar. Clone uma página primeiro.', 'error');
        return;
      }

      // 🔄 Ativar loading
      setIsDownloading(true);
      console.log('💾 [Download] Iniciando download do HTML...');

      let html: string | null = null;
      let source: string = '';

      // 🎯 PRIORIDADE 1: Se tem HTML salvo das edições, usar ele
      if (savedEditedHtml && hasSavedEdits) {
        console.log('💾 [Download] Usando HTML editado salvo');
        html = savedEditedHtml;
        source = 'edições salvas';
      }

      // 🎯 PRIORIDADE 2: Buscar do servidor com códigos de rastreamento
      if (!html) {
        console.log('💾 [Download] Buscando HTML do servidor...');

        // Verificar se há QUALQUER código habilitado
        const hasAnyCode = Boolean(
          (state.pixelId && state.pixelEnabled) ||
          (state.gtagId && state.gtagEnabled) ||
          (state.whatsappNumber && state.whatsappEnabled) ||
          (state.clarityId && state.clarityEnabled) ||
          (state.utmfyCode && state.utmfyEnabled)
        );


        const downloadUrl = buildRenderPageUrl(state.url, {
          editMode: false,
          injectCustom: hasAnyCode,
          pixelId: state.pixelId && state.pixelEnabled ? state.pixelId : undefined,
          gtagId: state.gtagId && state.gtagEnabled ? state.gtagId : undefined,
          whatsappNumber: state.whatsappNumber && state.whatsappEnabled ? state.whatsappNumber : undefined,
          clarityId: state.clarityId && state.clarityEnabled ? state.clarityId : undefined,
          utmfyCode: state.utmfyCode && state.utmfyEnabled ? state.utmfyCode : undefined,
        });

        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Falha ao buscar HTML: ${response.status} ${response.statusText}`);
        }
        html = await response.text();
        source = 'servidor';
      }

      // Validação final
      if (!html || html.trim().length === 0) {
        showFeedback('❌ Erro: HTML vazio. Tente clonar a página novamente.', 'error');
        setIsDownloading(false);
        return;
      }

      console.log(`💾 [Download] HTML obtido de ${source}:`, html.length, 'caracteres');

      // Limpar artefatos do editor
      let finalHtml = CloneService.cleanEditorArtifacts(html);

      // Limpar códigos de rastreamento da página original (preservando os injetados)
      finalHtml = CloneService.cleanTrackingCodes(finalHtml, {
        preservePixel: Boolean(state.pixelEnabled && state.pixelId),
        preserveGtag: Boolean(state.gtagEnabled && state.gtagId),
        preserveClarity: Boolean(state.clarityEnabled && state.clarityId),
        preserveUtmfy: Boolean(state.utmfyEnabled && state.utmfyCode),
        preserveWhatsApp: Boolean(state.whatsappEnabled && state.whatsappNumber),
        pixelId: state.pixelId,
        gtagId: state.gtagId,
        clarityId: state.clarityId,
      });

      // Verificar códigos de rastreamento presentes e atualizar histórico
      const trackingCodesIncluded = [];
      if (state.pixelId && state.pixelEnabled && finalHtml.includes(state.pixelId)) {
        trackingCodesIncluded.push('Meta Pixel');
        addToHistory(state.pixelId, pixelHistory, setPixelHistory);
      }
      if (state.gtagId && state.gtagEnabled && finalHtml.includes(state.gtagId)) {
        trackingCodesIncluded.push('Google Analytics');
        addToHistory(state.gtagId, gtagHistory, setGtagHistory);
      }
      if (state.clarityId && state.clarityEnabled && finalHtml.includes(state.clarityId)) {
        trackingCodesIncluded.push('Clarity');
        addToHistory(state.clarityId, clarityHistory, setClarityHistory);
      }
      if (state.utmfyCode && state.utmfyEnabled && finalHtml.includes(state.utmfyCode)) {
        trackingCodesIncluded.push('UTMFY');
        addToHistory(state.utmfyCode, utmfyHistory, setUtmfyHistory);
      }
      if (state.whatsappNumber && state.whatsappEnabled && finalHtml.includes(state.whatsappNumber)) {
        trackingCodesIncluded.push('WhatsApp');
        addToHistory(state.whatsappNumber, whatsappHistory, setWhatsappHistory);
      }

      // Gerar nome do arquivo
      const suffix = savedEditedHtml && hasSavedEdits ? 'edited' : 'clone';
      const filename = DownloadService.generateFilename(state.url, suffix);
      
      // Fazer download
      DownloadService.downloadHtml(finalHtml, filename);

      // Feedback detalhado
      let message = '✅ Download iniciado com sucesso';
      if (savedEditedHtml && hasSavedEdits) {
        message += ' (com suas edições)';
      }
      if (trackingCodesIncluded.length > 0) {
        message += ` + ${trackingCodesIncluded.join(', ')}`;
      }
      
      showFeedback(message);
      console.log('✅ [Download] Arquivo baixado:', filename);

    } catch (error) {
      console.error('❌ [Download] Erro ao fazer download:', error);
      showFeedback('❌ Erro ao fazer download: ' + (error instanceof Error ? error.message : 'Erro desconhecido'), 'error');
    } finally {
      setIsDownloading(false);
    }
  }, [
    state.editMode,
    state.iframeSrc,
    state.url,
    state.pixelId,
    state.pixelEnabled,
    state.gtagId,
    state.gtagEnabled,
    state.whatsappNumber,
    state.whatsappEnabled,
    state.clarityId,
    state.clarityEnabled,
    state.utmfyCode,
    state.utmfyEnabled,
    showFeedback,
    savedEditedHtml,
    hasSavedEdits,
    pixelHistory,
    setPixelHistory,
    gtagHistory,
    setGtagHistory,
    utmfyHistory,
    setUtmfyHistory,
    clarityHistory,
    setClarityHistory,
    whatsappHistory,
    setWhatsappHistory,
  ]);

  const exportAsZip = useCallback(async () => {
    try {
      // Validação inicial
      if (state.editMode) {
        showFeedback('⚠️ Desative o Modo Edição para exportar', 'warning');
        return;
      }

      if (!state.iframeSrc || state.iframeSrc.trim().length === 0) {
        showFeedback('Nenhum conteúdo disponível para exportar. Clone uma página primeiro.', 'error');
        return;
      }

      setIsExportingZip(true);
      console.log('📦 [Export ZIP] Iniciando exportação...');

      // 🎯 BUSCAR HTML COMPLETO DO SERVIDOR
      let html: string;

      // Se tem HTML editado salvo, usar ele
      if (savedEditedHtml && hasSavedEdits) {
        console.log('📦 [Export ZIP] Usando HTML editado salvo');
        html = savedEditedHtml;
      } else {
        // Buscar HTML completo do servidor (não usar state.iframeSrc pois é URL!)
        console.log('📦 [Export ZIP] Buscando HTML do servidor...');
        
        const fetchUrl = buildRenderPageUrl(state.url, {
          editMode: false,
          injectCustom: false, // Sem códigos de rastreamento no export
        });

        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Falha ao buscar HTML: ${response.status} ${response.statusText}`);
        }
        html = await response.text();
      }

      // Validação: verificar se é HTML válido (não URL)
      if (html.startsWith('http://') || html.startsWith('https://')) {
        throw new Error('Erro: recebeu URL ao invés de HTML. Tente novamente.');
      }

      console.log('📦 [Export ZIP] HTML obtido:', html.length, 'caracteres');

      // Configuração otimizada para melhor resultado
      const options = {
        includeAssets: true,    // Baixar todas as imagens, vídeos e fontes
        separateCSS: true,       // Organizar CSS em arquivo separado
        separateJS: true,        // Organizar JS em arquivo separado (inclui externos!)
        minify: false,           // Manter legível para edição posterior
        customCode: undefined    // Sem código customizado
      };

      console.log('📦 [Export ZIP] Configuração:', options);

      // Fazer requisição para API
      const response = await api.post('/export-zip', {
        html,
        originalUrl: state.url,
        options
      }, {
        responseType: 'blob'
      });

      // Criar download do ZIP
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clone-pages-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ [Export ZIP] Exportação concluída');
      
      // Feedback detalhado
      let message = '✅ ZIP exportado com sucesso';
      if (savedEditedHtml && hasSavedEdits) {
        message += ' (com suas edições)';
      }
      message += ' - Inclui HTML, CSS, JS e assets';
      
      showFeedback(message);

    } catch (error: any) {
      console.error('❌ [Export ZIP] Erro:', error);
      showFeedback('❌ Erro ao exportar ZIP: ' + (error.response?.data?.message || error.message || 'Erro desconhecido'), 'error');
    } finally {
      setIsExportingZip(false);
    }
  }, [
    state.editMode,
    state.iframeSrc,
    state.url,
    showFeedback,
    savedEditedHtml,
    hasSavedEdits,
  ]);


  // Memoizar função que constrói a URL para reduzir race conditions
  const buildUrlForEditMode = useCallback(() => {
    const hasCustomCodes = Boolean(
      (state.pixelId && state.pixelEnabled) ||
      (state.gtagId && state.gtagEnabled) ||
      (state.whatsappNumber && state.whatsappEnabled) ||
      (state.clarityId && state.clarityEnabled) ||
      (state.utmfyCode && state.utmfyEnabled)
    );

    return buildRenderPageUrl(state.url, {
      editMode: state.editMode,
      injectCustom: hasCustomCodes,
      pixelId: state.pixelId && state.pixelEnabled ? state.pixelId : undefined,
      gtagId: state.gtagId && state.gtagEnabled ? state.gtagId : undefined,
      whatsappNumber:
        state.whatsappNumber && state.whatsappEnabled
          ? state.whatsappNumber
          : undefined,
      clarityId:
        state.clarityId && state.clarityEnabled ? state.clarityId : undefined,
      utmfyCode:
        state.utmfyCode && state.utmfyEnabled ? state.utmfyCode : undefined,
    });
  }, [
    state.url,
    state.editMode,
    state.pixelId,
    state.pixelEnabled,
    state.gtagId,
    state.gtagEnabled,
    state.whatsappNumber,
    state.whatsappEnabled,
    state.clarityId,
    state.clarityEnabled,
    state.utmfyCode,
    state.utmfyEnabled,
  ]);

  // 🎯 FORÇAR RELOAD DO IFRAME QUANDO EDITMODE MUDA
  useEffect(() => {
    // Verificar se foi editMode que mudou especificamente
    const editModeChanged = prevEditModeRef.current !== state.editMode;

    if (!editModeChanged) {
      prevEditModeRef.current = state.editMode;
      return;
    }

    prevEditModeRef.current = state.editMode;

    // Se não tem URL ou não tem iframe carregado ainda, não fazer nada
    if (!state.url || !state.iframeSrc) {
      return;
    }

    const newUrl = buildUrlForEditMode();

    // 🎯 CORREÇÃO: Só recarregar iframe se NÃO tiver edições salvas
    if (!savedEditedHtml) {
      updateState({ iframeSrc: newUrl });
    } else if (newUrl !== state.iframeSrc) {
      // Apenas atualizar a URL no state sem recarregar
      updateState({ iframeSrc: newUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editMode, state.iframeSrc, savedEditedHtml]); // ✅ Removido state.url - só deve disparar quando editMode mudar

  // 🎯 SISTEMA SIMPLIFICADO: wasEditModeActive usado apenas para limpeza
  useEffect(() => {
    // Limpar estado quando modo edição for desativado
    if (wasEditModeActive && !state.editMode) {

    }

    // Atualizar flag
    setWasEditModeActive(state.editMode);
  }, [state.editMode, wasEditModeActive]);

  // 🎯 NOVA LÓGICA: Recarregar iframe APENAS quando códigos de rastreamento mudarem
  useEffect(() => {
    // Só recarregar se já tiver clonado uma página
    if (!state.iframeSrc) {
      return;
    }

    if (!state.url) {
      return;
    }

    // 🎯 NOVA LÓGICA: Se tem HTML editado salvo, injetar códigos LOCALMENTE (sem recarregar)
    if (savedEditedHtml && !state.editMode) {
      const trackingOptions = {
        pixelId: state.pixelId && state.pixelEnabled ? state.pixelId : undefined,
        gtagId: state.gtagId && state.gtagEnabled ? state.gtagId : undefined,
        clarityId: state.clarityId && state.clarityEnabled ? state.clarityId : undefined,
        utmfyCode: state.utmfyCode && state.utmfyEnabled ? state.utmfyCode : undefined,
        whatsappNumber: state.whatsappNumber && state.whatsappEnabled ? state.whatsappNumber : undefined,
      };

      // Verificar se os códigos já estão presentes para evitar loop infinito
      const pixelPresent = trackingOptions.pixelId ? savedEditedHtml.includes(trackingOptions.pixelId) : true;
      const gtagPresent = trackingOptions.gtagId ? savedEditedHtml.includes(trackingOptions.gtagId) : true;
      const clarityPresent = trackingOptions.clarityId ? savedEditedHtml.includes(trackingOptions.clarityId) : true;
      const whatsappPresent = trackingOptions.whatsappNumber ? savedEditedHtml.includes(trackingOptions.whatsappNumber) : true;

      // Verificar se códigos precisam ser REMOVIDOS (toggle desativado mas código ainda presente)
      const needsRemovePixel = !trackingOptions.pixelId && savedEditedHtml.includes('<!-- Meta Pixel Code (Tuglet) -->');
      const needsRemoveGtag = !trackingOptions.gtagId && savedEditedHtml.includes('<!-- Google tag (gtag.js) (Tuglet) -->');
      const needsRemoveClarity = !trackingOptions.clarityId && savedEditedHtml.includes('<!-- Microsoft Clarity (Tuglet) -->');
      const needsRemoveWhatsapp = !trackingOptions.whatsappNumber && savedEditedHtml.includes('<!-- WhatsApp Button (Tuglet) -->');
      const needsRemoveUtmfy = !trackingOptions.utmfyCode && savedEditedHtml.includes('data-utmfy-wrapper="true"');

      const allCodesPresent = pixelPresent && gtagPresent && clarityPresent && whatsappPresent;
      const needsRemoval = needsRemovePixel || needsRemoveGtag || needsRemoveClarity || needsRemoveWhatsapp || needsRemoveUtmfy;

      if (!allCodesPresent || needsRemoval) {
        const htmlWithCodes = injectTrackingCodesLocally(savedEditedHtml, trackingOptions);

        // Só atualizar se realmente mudou (evita loop infinito)
        if (htmlWithCodes !== savedEditedHtml) {
          setSavedEditedHtml(htmlWithCodes);
        }
      }

      return;
    }

    // Se está no modo edição com HTML salvo, bloquear para preservar
    if (savedEditedHtml && state.editMode) {
      return;
    }

    // Se tem edições ativas no modo edição, NÃO recarregar
    if (hasEdits && state.editMode) {
      return;
    }

    // 🎯 NOVA LÓGICA: Determinar parâmetros para /render-page
    const hasCustomCodes = Boolean(
      (state.pixelId && state.pixelEnabled) ||
      (state.gtagId && state.gtagEnabled) ||
      (state.whatsappNumber && state.whatsappEnabled) ||
      (state.clarityId && state.clarityEnabled) ||
      (state.utmfyCode && state.utmfyEnabled)
    );

    // Construir URL do novo endpoint /render-page
    const newUrl = buildRenderPageUrl(state.url, {
      editMode: state.editMode,
      injectCustom: hasCustomCodes,
      pixelId: state.pixelId && state.pixelEnabled ? state.pixelId : undefined,
      gtagId: state.gtagId && state.gtagEnabled ? state.gtagId : undefined,
      whatsappNumber:
        state.whatsappNumber && state.whatsappEnabled
          ? state.whatsappNumber
          : undefined,
      clarityId:
        state.clarityId && state.clarityEnabled ? state.clarityId : undefined,
      utmfyCode:
        state.utmfyCode && state.utmfyEnabled ? state.utmfyCode : undefined,
    });

    // Só atualizar se a URL mudou
    if (newUrl !== state.iframeSrc) {
      // Ativar loading de códigos
      setIsApplyingCodes(true);

      updateState({ iframeSrc: newUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // ✅ Removido state.url das dependências - só deve disparar quando CÓDIGOS mudarem, não quando URL for digitada
    // A URL é lida diretamente do state.url quando necessário, mas não dispara o useEffect
    state.iframeSrc,
    state.editMode,
    state.pixelId,
    state.pixelEnabled,
    state.gtagId,
    state.gtagEnabled,
    state.whatsappNumber,
    state.whatsappEnabled,
    state.clarityId,
    state.clarityEnabled,
    state.utmfyCode,
    state.utmfyEnabled,
    hasEdits,
    savedEditedHtml,
    injectTrackingCodesLocally, // ✅ Função de injeção local
  ]);

  // 👤 Funções do Modal de Perfil
  useEffect(() => {
    if (showProfileModal) {
      setProfileNewPassword('');
      setProfileConfirmPassword('');
    }
  }, [showProfileModal]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileNewPassword) {
      alert('Digite a nova senha');
      return;
    }

    if (profileNewPassword !== profileConfirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (profileNewPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const token = localStorage.getItem('token');

      await fetch(`${API_BASE_URL}/users/${user?.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: profileNewPassword })
      });

      alert('Senha atualizada com sucesso!');
      setShowProfileModal(false);
    } catch (error) {

      alert('Erro ao atualizar senha');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className='dashboard'>
      {/* Header removido - agora tudo está na sidebar */}

      <div className='dashboard-content'>
        {/* Sidebar Condicional: Normal ou Editor */}
        {!state.editMode && (
          <div className={`dashboard-sidebar ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Toggle Button - Novo Design */}
            <div
              title={isSidebarCollapsed ? 'Expandir área de códigos' : 'Recolher área de códigos'}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              <svg
                className='sidebar-toggle-btn'
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ cursor: 'pointer' }}
              >
                {isSidebarCollapsed ? (
                  // Setas apontando para direita (expandir)
                  <>
                    <path d="M10 18L16 12L10 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 18L10 12L4 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ) : (
                  // Setas apontando para esquerda (recolher)
                  <>
                    <path d="M14 18L8 12L14 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 18L14 12L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
              </svg>
            </div>

            {/* Logo no Topo */}
            <div className='sidebar-logo'>
              <img src='/spycopy-logo.png' alt='CLONE PAGES' className='sidebar-logo-img' />
              {!isSidebarCollapsed && <span className='sidebar-logo-text'>CLONE PAGES</span>}
            </div>

            {/* Integrações (Centro) */}
            <div className='sidebar-integrations'>
              <div className='integration-group pixel-group'>
                <div className='integration-header'>
                  <label>Pixel Meta</label>
                  <ToggleSwitch
                    checked={state.pixelEnabled}
                    onChange={(checked: boolean) =>
                      updateIntegration('pixelEnabled', checked)
                    }
                    size='medium'
                    disabled={state.editMode}
                  />
                </div>
                <input
                  type='text'
                  placeholder='Insira o ID do Pixel'
                  value={state.pixelId}
                  onChange={(e) => {
                    updateIntegration('pixelId', e.target.value);
                  }}
                  onFocus={() => setShowPixelHistory(true)}
                  className='integration-input'
                  disabled={!state.pixelEnabled || state.editMode}
                />
                {showPixelHistory && pixelHistory.length > 0 && (
                  <div className='history-dropdown'>
                    {pixelHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className='history-item'
                        onClick={() => {
                          updateIntegration('pixelId', item);
                          setShowPixelHistory(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {state.pixelEnabled && !state.pixelId && (
                  <div className='integration-warning'>
                    ⚠️ Insira o ID do Pixel para funcionar
                  </div>
                )}
              </div>

              <div className='integration-group gtag-group'>
                <div className='integration-header'>
                  <label>Google Tag</label>
                  <ToggleSwitch
                    checked={state.gtagEnabled}
                    onChange={(checked: boolean) =>
                      updateIntegration('gtagEnabled', checked)
                    }
                    size='medium'
                    disabled={state.editMode}
                  />
                </div>
                <input
                  type='text'
                  placeholder='Insira a Tag do Google'
                  value={state.gtagId}
                  onChange={(e) => {
                    updateIntegration('gtagId', e.target.value);
                  }}
                  onFocus={() => setShowGtagHistory(true)}
                  className='integration-input'
                  disabled={!state.gtagEnabled || state.editMode}
                />
                {showGtagHistory && gtagHistory.length > 0 && (
                  <div className='history-dropdown'>
                    {gtagHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className='history-item'
                        onClick={() => {
                          updateIntegration('gtagId', item);
                          setShowGtagHistory(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {state.gtagEnabled && !state.gtagId && (
                  <div className='integration-warning'>
                    ⚠️ Insira a Tag do Google para funcionar
                  </div>
                )}
              </div>

              <div className='integration-group utmfy-group'>
                <div className='integration-header'>
                  <label>UTMFY</label>
                  <ToggleSwitch
                    checked={state.utmfyEnabled}
                    onChange={(checked: boolean) =>
                      updateIntegration('utmfyEnabled', checked)
                    }
                    size='medium'
                    disabled={state.editMode}
                  />
                </div>
                <input
                  type='text'
                  placeholder='Insira o código UTMFY'
                  value={state.utmfyCode}
                  onChange={(e) => {
                    updateIntegration('utmfyCode', e.target.value);
                  }}
                  onFocus={() => setShowUtmfyHistory(true)}
                  className='integration-input'
                  disabled={!state.utmfyEnabled || state.editMode}
                />
                {showUtmfyHistory && utmfyHistory.length > 0 && (
                  <div className='history-dropdown'>
                    {utmfyHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className='history-item'
                        onClick={() => {
                          updateIntegration('utmfyCode', item);
                          setShowUtmfyHistory(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {state.utmfyEnabled && !state.utmfyCode && (
                  <div className='integration-warning'>
                    ⚠️ Insira o código UTMFY para funcionar
                  </div>
                )}
              </div>

              <div className='integration-group clarity-group'>
                <div className='integration-header'>
                  <label>Microsoft Clarity</label>
                  <ToggleSwitch
                    checked={state.clarityEnabled}
                    onChange={(checked: boolean) =>
                      updateIntegration('clarityEnabled', checked)
                    }
                    size='medium'
                    disabled={state.editMode}
                  />
                </div>
                <input
                  type='text'
                  placeholder='Insira o ID do Clarity'
                  value={state.clarityId}
                  onChange={(e) => {
                    updateIntegration('clarityId', e.target.value);
                  }}
                  onFocus={() => setShowClarityHistory(true)}
                  className='integration-input'
                  disabled={!state.clarityEnabled || state.editMode}
                />
                {showClarityHistory && clarityHistory.length > 0 && (
                  <div className='history-dropdown'>
                    {clarityHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className='history-item'
                        onClick={() => {
                          updateIntegration('clarityId', item);
                          setShowClarityHistory(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {state.clarityEnabled && !state.clarityId && (
                  <div className='integration-warning'>
                    ⚠️ Insira o ID do Clarity para funcionar
                  </div>
                )}
              </div>

              <div className='integration-group whatsapp-group'>
                <div className='integration-header'>
                  <label>Botão WhatsApp</label>
                  <ToggleSwitch
                    checked={state.whatsappEnabled}
                    onChange={(checked: boolean) =>
                      updateIntegration('whatsappEnabled', checked)
                    }
                    size='medium'
                    disabled={state.editMode}
                  />
                </div>
                <input
                  type='text'
                  placeholder='EX: 5521999999999'
                  value={state.whatsappNumber}
                  onChange={(e) => {
                    updateIntegration('whatsappNumber', e.target.value);
                  }}
                  onFocus={() => setShowWhatsappHistory(true)}
                  className='integration-input'
                  disabled={!state.whatsappEnabled || state.editMode}
                />
                {showWhatsappHistory && whatsappHistory.length > 0 && (
                  <div className='history-dropdown'>
                    {whatsappHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className='history-item'
                        onClick={() => {
                          updateIntegration('whatsappNumber', item);
                          setShowWhatsappHistory(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
                {state.whatsappEnabled && !state.whatsappNumber && (
                  <div className='integration-warning'>
                    ⚠️ Insira o número do WhatsApp para funcionar
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé da Sidebar: WhatsApp + Botão Admin + Usuário */}
            <div className='sidebar-footer'>
              {/* Botão WhatsApp - Apenas para usuários não-admin */}
              {!isAdmin && (
                <button
                  className='sidebar-whatsapp-btn'
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/5522981756226?text=${encodeURIComponent('Preciso de suporte para a ferramenta Clone Pages')}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  title='Suporte via WhatsApp'
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  {!isSidebarCollapsed && <span>Suporte WhatsApp</span>}
                </button>
              )}

              {/* Botão Admin - Se for admin */}
              {!isSidebarCollapsed && isAdmin && (
                <button
                  className='sidebar-admin-btn'
                  onClick={() => navigate('/admin')}
                  title='Painel Administrativo'
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Painel Admin</span>
                </button>
              )}

              {/* Info do Usuário - SEMPRE VISÍVEL */}
              <div className='sidebar-user'>
                <div className='sidebar-user-avatar'>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                {!isSidebarCollapsed && (
                  <div className='sidebar-user-info'>
                    <span className='sidebar-user-email'>{user?.email}</span>
                    {userLicense?.expiresAt && (
                      <span className='sidebar-user-expires'>
                        {userLicense.status === 'expired' || userLicense.status === 'inactive'
                          ? `Vencida em: ${new Date(userLicense.expiresAt).toLocaleDateString('pt-BR')}`
                          : `Vence em: ${new Date(userLicense.expiresAt).toLocaleDateString('pt-BR')}`
                        }
                      </span>
                    )}
                    <div className='sidebar-user-actions'>
                      <button className='sidebar-user-profile' onClick={() => setShowProfileModal(true)}>
                        Senha
                      </button>
                      <button className='sidebar-user-logout' onClick={logout}>
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Editor - Painel de Edição Visual */}
        {state.editMode && (
          <div className="dashboard-sidebar editor-sidebar">
            {selectedElement ? (
              <EditorPanel
                element={selectedElement}
                onUpdate={updateElement}
                onClose={clearSelection}
                onSave={handleSaveAllEdits}
                onRemove={handleRemoveElement}
                onDuplicate={duplicateElement}
                // 🎯 Undo/Redo
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                historyLength={historyLength}
                // 🔧 Referência do iframe para ToolsTab
                iframeRef={iframeRef}
              />
            ) : (
              <div className="editor-sidebar-placeholder">
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: '20px',
                  color: '#9ca3af',
                  textAlign: 'center'
                }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 5V3M12 21V19M19 12H21M3 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontSize: '14px', margin: '0 0 8px 0', fontWeight: '500' }}>
                    Nenhum elemento selecionado
                  </p>
                  <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                    Clique em qualquer elemento da página para começar a editar
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Area */}
        <div className='dashboard-main'>
          {/* All-in-One Row: URL + Clone + Actions */}
          <div className='all-in-one-section'>
            <input
              type='text'
              placeholder='Insira a URL do site que deseja clonar'
              value={state.url}
              onChange={(e) => updateState({ url: e.target.value })}
              onFocus={() => setShowHistory(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && state.url.trim() && !isLoading && !state.editMode) {
                  e.preventDefault();
                  startClone();
                }
              }}
              className='url-input'
              disabled={isLoading || state.editMode}
            />

            <button
              className='btn-clone'
              onClick={startClone}
              disabled={isLoading || state.editMode}
            >
              Clonar
            </button>

            {/* Action Buttons */}
            <button
              className='btn-action btn-copy'
              onClick={copyOriginalHtml}
              disabled={isLoading || !state.iframeSrc || state.editMode}
              title='Copiar HTML para área de transferência'
            >
              <Copy size={18} strokeWidth={2.5} />
              <span>Copiar</span>
            </button>
            <button
              className='btn-action btn-download'
              onClick={downloadOriginalHtml}
              disabled={isLoading || !state.iframeSrc || state.editMode}
              title='Baixar HTML da página clonada'
            >
              <Download size={18} strokeWidth={2.5} />
              <span>Baixar HTML</span>
            </button>

            <button
              className='btn-action btn-export-zip'
              onClick={exportAsZip}
              disabled={isLoading || !state.iframeSrc || state.editMode || isExportingZip}
              title={state.editMode ? 'Desative o Modo Edição para exportar' : 'Exportar página completa com assets em ZIP'}
            >
              <Package size={18} strokeWidth={2.5} />
              <span>{isExportingZip ? 'Exportando...' : 'Exportar ZIP'}</span>
            </button>

            {/* Edit Mode Toggle */}
            <div
              className='edit-mode-toggle-inline'
              title='Ative para editar textos, imagens e links diretamente no preview. Clique em qualquer elemento para editá-lo.'
            >
              <label>Modo Edição</label>
              <ToggleSwitch
                checked={state.editMode}
                onChange={handleEditModeToggle}
                disabled={isLoading || isEditorLoading || !state.iframeSrc}
                size='medium'
              />
            </div>

            {/* Viewport Controls */}
            <button
              className='viewport-toggle'
              onClick={() => updateState({ viewportMode: state.viewportMode === 'desktop' ? 'mobile' : 'desktop' })}
              title={`Alternar para ${state.viewportMode === 'desktop' ? 'Mobile' : 'Desktop'}`}
            >
              {state.viewportMode === 'desktop' ? '🖥️' : '📱'}
            </button>

            {/* Dropdown simples de histórico */}
            {showHistory && urlHistory.length > 0 && (
              <div className='url-history-dropdown'>
                {urlHistory.map((item, index) => (
                  <div
                    key={index}
                    className='url-history-item'
                    onClick={() => {
                      updateState({ url: item });
                      setShowHistory(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Frame (com ExpandButton dentro do container para responsividade) */}
          <div className={`preview-container ${isExpanded ? 'preview-container--expanded' : ''} ${state.editMode ? 'edit-mode-active' : ''}`}>
            {/* Loading Spinner - aparece quando está clonando */}
            {isLoading && (
              <div className="clone-loading-overlay">
                <div className="clone-loading-spinner">
                  <div className="spinner"></div>
                  <p>Clonando página...</p>
                  <small>Isso pode levar alguns segundos</small>
                </div>
              </div>
            )}

            {/* Editor Loading Spinner - aparece quando está ativando/desativando modo edição */}
            {isEditorLoading && (
              <div className="clone-loading-overlay">
                <div className="clone-loading-spinner">
                  <div className="spinner"></div>
                  <p>{state.editMode ? 'Ativando modo edição...' : 'Desativando modo edição...'}</p>
                  <small>Isso pode levar alguns segundos</small>
                </div>
              </div>
            )}

            {/* Codes Loading Spinner - aparece quando está carregando a página clonada */}
            {isApplyingCodes && (
              <div className="clone-loading-overlay">
                <div className="clone-loading-spinner">
                  <div className="spinner"></div>
                  <p>Carregando a página clonada...</p>
                  <small>Aguarde enquanto processamos a página</small>
                </div>
              </div>
            )}

            {/* Download Loading Spinner - aparece durante o download do HTML */}
            {isDownloading && (
              <div className="clone-loading-overlay">
                <div className="clone-loading-spinner">
                  <div className="spinner"></div>
                  <p>Preparando download...</p>
                  <small>Isso pode levar alguns segundos</small>
                </div>
              </div>
            )}

            {/* Error Popup - aparece quando há erro na clonagem */}
            {cloneError && (
              <div className="clone-error-overlay">
                <div className="clone-error-message">
                  <div className="clone-error-icon">⚠️</div>
                  <h3>Erro na Clonagem</h3>
                  <p>{cloneError}</p>
                  <div className="clone-error-actions">
                    <button
                      className="clone-error-btn clone-error-btn-retry"
                      onClick={handleRetryClone}
                    >
                      Tentar Novamente
                    </button>
                    <button
                      className="clone-error-btn clone-error-btn-close"
                      onClick={handleCloseError}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {state.iframeSrc ? (
              <div className={`preview-wrapper viewport-${state.viewportMode}`}>
                <iframe
                  key={state.iframeSrc} // ✅ FORÇA REMOUNT: Key única garante que iframe seja recriado
                  ref={iframeRef}
                  {...(savedEditedHtml
                    ? { srcDoc: state.editMode ? (htmlWithEditorInjected || injectEditorScriptInHtml(savedEditedHtml)) : savedEditedHtml }
                    : { src: state.iframeSrc })}
                  className='preview-iframe'
                  title='Preview'
                  sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox'
                  onLoad={() => {






                    // 🎯 SUCESSO: Limpar timeout de erro quando iframe carregar
                    if (cloneTimeoutRef.current) {

                      clearTimeout(cloneTimeoutRef.current);
                      cloneTimeoutRef.current = null;
                    }

                    // ✅ Desativar loading do editor quando iframe carregar
                    if (isEditorLoading) {

                      setIsEditorLoading(false);
                    }

                    // ✅ Desativar loading de códigos quando iframe carregar
                    if (isApplyingCodes) {

                      setIsApplyingCodes(false);
                    }

                    // ✅ Atualizar status para SUCCESS quando iframe carregar
                    updateState({ status: SUCCESS_STATUS });

                    const usingSrcDoc = !!savedEditedHtml;
                    const withEditor = savedEditedHtml && state.editMode;
                    const iframeContent = usingSrcDoc
                      ? state.editMode
                        ? (htmlWithEditorInjected || injectEditorScriptInHtml(savedEditedHtml))
                        : savedEditedHtml
                      : state.iframeSrc;



                    if (usingSrcDoc && state.editMode) {

                    } else if (usingSrcDoc) {

                    } else {
                    }

                    // Aguardar um momento para o script executar, depois verificar
                    setTimeout(() => {

                      checkEditorScript();
                    }, 1000);
                  }}
                  onError={(e) => {

                    setCloneError('Não foi possível clonar esta página. O site pode estar bloqueando o acesso ou estar indisponível.');
                    if (cloneTimeoutRef.current) {
                      clearTimeout(cloneTimeoutRef.current);
                      cloneTimeoutRef.current = null;
                    }
                  }}
                />
              </div>
            ) : (
              <div className='preview-placeholder'>
                <p>
                  Insira uma URL e clique em Clonar para visualizar o preview
                </p>
              </div>
            )}

            {/* Expand Button - só aparece no modo edição, posicionado dentro do preview */}
            {state.editMode && state.iframeSrc && (
              <ExpandButton
                onExpand={handleExpandPreview}
                onCollapse={handleCollapsePreview}
                size="medium"
                theme="dark"
                showTooltip={true}
                tooltipPosition="left"
                disabled={isLoading || !state.iframeSrc}
              />
            )}
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className={`feedback-message feedback-${feedbackMessage.type}`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Botão de Suporte via WhatsApp - fixo no inferior esquerdo do Dashboard */}
      {/* Desaparece quando modo editor está ativado para evitar conflitos */}
      {/* WhatsApp agora está dentro da sidebar */}

      {/* Modal de Perfil do Usuário */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Meu Perfil</h3>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdatePassword} className="modal-form">
              <div className="form-divider">Dados Pessoais</div>

              {/* Layout em 2 colunas */}
              <div className="form-row">
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={user?.name || 'Não informado'}
                    disabled
                    className="input-readonly"
                  />
                </div>

                <div className="form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-readonly"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF</label>
                  <input
                    type="text"
                    value={user?.cpf || 'Não informado'}
                    disabled
                    className="input-readonly"
                  />
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={user?.phone || 'Não informado'}
                    disabled
                    className="input-readonly"
                  />
                </div>
              </div>

              <div className="form-divider">Alterar Senha</div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="profile-new-password">Nova Senha</label>
                  <input
                    id="profile-new-password"
                    type="password"
                    value={profileNewPassword}
                    onChange={(e) => setProfileNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    disabled={isUpdatingProfile}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-confirm-password">Confirmar Nova Senha</label>
                  <input
                    id="profile-confirm-password"
                    type="password"
                    value={profileConfirmPassword}
                    onChange={(e) => setProfileConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    disabled={isUpdatingProfile}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowProfileModal(false)}
                  disabled={isUpdatingProfile}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

