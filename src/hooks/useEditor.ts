import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SelectedElement,
  ElementUpdate,
  EditorMessage,
} from '../types/editor.types';
import { useEditHistory } from './useEditHistory';

export const useEditor = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>
) => {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [hasEdits, setHasEdits] = useState(false);
  const [hasSavedEdits, setHasSavedEdits] = useState(false);
  const lastHtmlRef = useRef<string>('');
  
  // 🎯 Sistema de Histórico (Undo/Redo)
  const {
    pushState: pushHistoryState,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
    clearHistory,
    historyLength,
    isUndoRedo,
    initializeHistory,
  } = useEditHistory();
  
  const isApplyingHistoryRef = useRef(false);

  // 🎯 Solicitar HTML atual do iframe (retorna Promise)
  const requestCurrentHtml = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!iframeRef.current?.contentWindow) {
        reject(new Error('iframe não disponível'));
        return;
      }

      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleResponse);
        reject(new Error('Timeout ao solicitar HTML'));
      }, 5000);

      const handleResponse = (event: MessageEvent) => {
        if (event.data?.source === 'EDITOR_IFRAME' && event.data.type === 'HTML_CONTENT') {
          clearTimeout(timeoutId);
          window.removeEventListener('message', handleResponse);
          const html = event.data.data as string;
          lastHtmlRef.current = html;
          resolve(html);
        }
      };

      window.addEventListener('message', handleResponse);
      
      iframeRef.current.contentWindow.postMessage({
        source: 'EDITOR_PARENT',
        type: 'GET_HTML',
      }, '*');
    });
  }, [iframeRef]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent<EditorMessage>) => {
      // Validar origem
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
        } catch {}
      }
      
      if (!fromCurrentIframe) return;
      if (!event.data || event.data.source !== 'EDITOR_IFRAME') return;

      const { type, data } = event.data;

      switch (type) {
        case 'ELEMENT_SELECTED':
          setSelectedElement(data as SelectedElement);
          
          // 🎯 Inicializar histórico quando primeiro elemento é selecionado
          if (historyLength === 0 && !isUndoRedo) {
            requestCurrentHtml().then(html => {
              if (html) {
                initializeHistory(html);
              }
            }).catch(() => {});
          }
          break;

        case 'ELEMENT_UPDATED':
          console.log('📝 [useEditor] Elemento atualizado');
          setHasEdits(true);
          
          // 🎯 Após update, salvar o novo estado no histórico
          if (!isApplyingHistoryRef.current && !isUndoRedo) {
            setTimeout(() => {
              requestCurrentHtml().then(html => {
                if (html) {
                  lastHtmlRef.current = html;
                  // Salvar estado DEPOIS da edição
                  pushHistoryState(html, 'Edição aplicada');
                }
              }).catch(() => {});
            }, 100); // Pequeno delay para garantir que o DOM foi atualizado
          }
          break;

        case 'HTML_CONTENT':
          lastHtmlRef.current = data as string;
          break;

        case 'HTML_RESTORED':
          console.log('🔄 [useEditor] HTML restaurado');
          setHasEdits(false);
          setSelectedElement(null);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeRef, historyLength, isUndoRedo, requestCurrentHtml, initializeHistory, pushHistoryState]);

  // 🎯 Aplicar HTML do histórico no iframe
  const applyHtmlToIframe = useCallback((html: string) => {
    if (!iframeRef.current?.contentWindow) {
      console.warn('❌ [applyHtmlToIframe] iframe não disponível');
      return;
    }

    console.log('📤 [applyHtmlToIframe] Aplicando HTML do histórico...');
    iframeRef.current.contentWindow.postMessage({
      source: 'EDITOR_PARENT',
      type: 'APPLY_HTML',
      data: html,
    }, '*');
    
    lastHtmlRef.current = html;
  }, [iframeRef]);

  // 🎯 UNDO: Desfazer última edição
  const undo = useCallback(async () => {
    if (!canUndo) return;
    
    isApplyingHistoryRef.current = true;
    
    const previousHtml = undoHistory();
    if (previousHtml) {
      applyHtmlToIframe(previousHtml);
      setHasEdits(true);
    }
    
    setTimeout(() => {
      isApplyingHistoryRef.current = false;
    }, 300);
  }, [undoHistory, applyHtmlToIframe, canUndo]);

  // 🎯 REDO: Refazer última edição desfeita
  const redo = useCallback(() => {
    if (!canRedo) return;
    
    isApplyingHistoryRef.current = true;
    
    const nextHtml = redoHistory();
    if (nextHtml) {
      applyHtmlToIframe(nextHtml);
      setHasEdits(true);
    }
    
    setTimeout(() => {
      isApplyingHistoryRef.current = false;
    }, 300);
  }, [redoHistory, applyHtmlToIframe, canRedo]);

  // 🎯 Enviar update para iframe (SEM salvar histórico aqui)
  const updateElement = useCallback(
    async (update: ElementUpdate) => {
      if (!iframeRef.current?.contentWindow) {
        return;
      }

      // Apenas enviar o update - o histórico será salvo DEPOIS no ELEMENT_UPDATED
      iframeRef.current.contentWindow.postMessage({
        source: 'EDITOR_PARENT',
        type: 'UPDATE_ELEMENT',
        data: update,
      }, '*');
    },
    [iframeRef]
  );

  // Get current HTML from iframe (para uso externo)
  const getEditedHtml = useCallback((): Promise<string> => {
    return requestCurrentHtml();
  }, [requestCurrentHtml]);

  // Restore original HTML
  const restoreOriginalHtml = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;

    if (window.confirm('Tem certeza que deseja remover todas as edições? Esta ação não pode ser desfeita.')) {
      iframeRef.current.contentWindow.postMessage({
        source: 'EDITOR_PARENT',
        type: 'RESTORE_HTML',
      }, '*');
      setHasSavedEdits(false);
      clearHistory();
    }
  }, [iframeRef, clearHistory]);

  // Save edits
  const saveEdits = useCallback(() => {
    if (!hasEdits) {
      console.warn('⚠️ [saveEdits] No edits to save');
      return;
    }
    console.log('💾 [saveEdits] Saving edits...');
    setHasSavedEdits(true);
    setHasEdits(false);
  }, [hasEdits]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  // 🔧 Abrir configurações da página (Ferramentas) automaticamente
  // Cria um elemento virtual para abrir o EditorPanel na aba Ferramentas
  const openPageSettings = useCallback(() => {
    console.log('🔧 [useEditor] Abrindo configurações da página...');
    
    // Criar elemento especial que indica "configurações da página"
    const pageSettingsElement: SelectedElement = {
      xpath: '//html',
      tagName: '', // tagName vazio indica que é configuração global
      textContent: '',
      className: '',
      id: 'page-settings',
      styles: {
        backgroundColor: '',
        color: '',
        borderColor: '',
        width: '',
        height: '',
        padding: '',
        margin: '',
        borderRadius: '',
        borderWidth: '',
        borderStyle: '',
        boxShadow: '',
        textShadow: '',
        opacity: '',
        filter: '',
        transform: '',
        fontSize: '',
        fontWeight: '',
        fontStyle: '',
        textAlign: '',
        textDecoration: '',
        backgroundImage: '',
        backgroundSize: '',
        backgroundPosition: '',
      },
      attributes: {},
      boundingRect: {
        top: 100,
        left: 100,
        right: 500,
        bottom: 300,
        width: 400,
        height: 200,
      },
    };

    setSelectedElement(pageSettingsElement);
  }, []);

  // Duplicate element
  const duplicateElement = useCallback(async () => {
    if (!iframeRef.current?.contentWindow) {
      console.warn('❌ [duplicateElement] iframe não disponível');
      return;
    }

    // Apenas duplicar - o histórico será salvo depois no ELEMENT_UPDATED
    console.log('📋 [duplicateElement] Duplicando elemento...');
    iframeRef.current.contentWindow.postMessage({
      source: 'EDITOR_PARENT',
      type: 'DUPLICATE_ELEMENT',
    }, '*');
    setHasEdits(true);
  }, [iframeRef]);

  // 🎯 Atalhos de teclado para Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se estiver em input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ctrl+Z ou Cmd+Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Y ou Cmd+Shift+Z = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  return {
    selectedElement,
    hasEdits,
    hasSavedEdits,
    updateElement,
    getEditedHtml,
    restoreOriginalHtml,
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
  };
};
