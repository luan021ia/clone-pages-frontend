import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import type { SelectedElement, EditorTab, ElementUpdate } from '../../types/editor.types';
// 📁 Módulos organizados por tipo de elemento
import { TextTab } from '@/components/features/editor/modules/text';
import { MediaTab } from '@/components/features/editor/modules/media';
import { LayoutTab, BordersTab, AdvancedTab } from '@/components/features/editor/modules/container';
import { BackgroundTab } from '@/components/features/editor/modules/background/BackgroundTab';
import { SectionTab } from '@/components/features/editor/modules/section/SectionTab';
import { LinkTab } from '@/components/features/editor/modules/link/LinkTab';
import { ToolsTab } from '@/components/features/editor/modules/tools';
import { detectElementType, MODULE_LABELS, type ElementModuleType } from './editor/modules/detectElementType';
import { Undo2, Redo2, Check, Copy, Trash2, X } from 'lucide-react';
import './EditorPanel.css';

interface EditorPanelProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
  onClose: () => void;
  onSave: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  // 🎯 Undo/Redo
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  historyLength?: number;
  // 🔧 Referência do iframe para ToolsTab
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  // 🎯 Indica se o painel está embutido na sidebar (não flutuante)
  embedded?: boolean;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  element,
  onUpdate,
  onClose,
  onSave,
  onRemove: _onRemove,
  onDuplicate,
  // 🎯 Undo/Redo
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  historyLength = 0,
  // 🔧 Referência do iframe
  iframeRef,
  // 🎯 Modo embutido na sidebar (não flutuante)
  embedded = true, // Por padrão está na sidebar
}) => {
  // 🔧 Verificar se é abertura de configurações da página (tagName vazio)
  const isPageSettings = !element.tagName || element.id === 'page-settings';
  const [activeTab, setActiveTab] = useState<EditorTab>('text');
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const [allSections, setAllSections] = useState<Array<{ id: string; category: string; name: string }>>([]);

  // 🆆 Detecta o tipo de elemento para exibir abas relevantes
  const elementType = detectElementType(element);
  const elementTypeLabel = MODULE_LABELS[elementType];

  // ✨ NOVO: Seleção automática de tab baseada no tipo de elemento
  useEffect(() => {
    // 🔧 Se for abertura de configurações da página, abrir diretamente em Ferramentas
    if (isPageSettings) {
      setActiveTab('tools');
      console.log('🔧 [EditorPanel] Abrindo aba Ferramentas (Configurações da Página)');
      return;
    }

    // Mapear tipo de elemento para a tab apropriada
    const tabMapping: Record<ElementModuleType, EditorTab> = {
      'media': 'media',        // Vídeo/Imagem → "Imagens e Vídeos"
      'text': 'text',          // Texto → "Textos e Fontes"
      'container': 'background',   // Container → "Cores e Fundos"
      'advanced': 'advanced'   // Outros → "Sombras e Animações"
    };

    const suggestedTab = tabMapping[elementType] || 'text';
    setActiveTab(suggestedTab);

    console.log('🎯 [EditorPanel] Tab automática selecionada:', {
      elementType,
      elementTypeLabel,
      tagName: element.tagName,
      selectedTab: suggestedTab
    });
  }, [elementType, element.tagName, elementTypeLabel, isPageSettings]);

  // 🔗 NOVO: Buscar todas as seções detectadas na página para LinkTab
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'EDITOR_IFRAME' && event.data?.type === 'SECTIONS_LIST') {
        setAllSections(event.data.data || []);
        console.log('🎯 [EditorPanel] Seções recebidas:', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);

    // Solicitar lista de seções ao iframe sempre que necessário
    const requestSections = () => {
      const iframe = document.querySelector('iframe');
      if (iframe?.contentWindow) {
        console.log('🔗 [EditorPanel] Solicitando seções...');
        iframe.contentWindow.postMessage({
          source: 'EDITOR_PARENT',
          type: 'GET_SECTIONS'
        }, '*');
      }
    };

    // Solicitar imediatamente
    requestSections();

    // Solicitar novamente quando a tab link é aberta ou elemento muda
    if (activeTab === 'link') {
      requestSections();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [activeTab, element.xpath]);

  // 🎯 NOVO: Posicionamento dinâmico com inline styles (apenas quando NÃO está embutido)
  useLayoutEffect(() => {
    // 🎯 Se está embutido na sidebar, não calcular posicionamento
    if (embedded) {
      setPanelStyle({}); // Limpar estilos inline para deixar CSS da sidebar funcionar
      return;
    }
    
    if (!element.boundingRect || !panelRef.current) return;

    const elementRect = element.boundingRect;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Margem segura do viewport

    // Obter dimensões reais do painel medindo o DOM
    const panelRect = panelRef.current.getBoundingClientRect();
    const actualPanelWidth = panelRect.width || 420;
    const actualPanelHeight = panelRect.height || 600;

    console.log('📏 [EditorPanel] Dimensões reais do painel:', {
      width: actualPanelWidth.toFixed(0),
      height: actualPanelHeight.toFixed(0)
    });

    // Função para calcular bounds do painel em uma posição
    const getPanelRect = (x: number, y: number) => {
      return {
        top: y,
        left: x,
        right: x + actualPanelWidth,
        bottom: y + actualPanelHeight
      };
    };

    // Função para detectar colisão AABB
    const hasCollision = (rect1: typeof elementRect, rect2: ReturnType<typeof getPanelRect>) => {
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    };

    // Função para gerar posições candidatas
    const generatePositions = () => {
      const positions: Array<{ x: number; y: number; label: string }> = [];

      // ACIMA do elemento
      if (elementRect.top - actualPanelHeight - margin > 0) {
        positions.push({
          x: Math.max(margin, Math.min(elementRect.left + elementRect.width / 2 - actualPanelWidth / 2, viewportWidth - actualPanelWidth - margin)),
          y: elementRect.top - actualPanelHeight - margin,
          label: 'TOP-CENTER'
        });
      }

      // ABAIXO do elemento
      if (elementRect.bottom + actualPanelHeight + margin < viewportHeight) {
        positions.push({
          x: Math.max(margin, Math.min(elementRect.left + elementRect.width / 2 - actualPanelWidth / 2, viewportWidth - actualPanelWidth - margin)),
          y: elementRect.bottom + margin,
          label: 'BOTTOM-CENTER'
        });
      }

      // À ESQUERDA do elemento
      if (elementRect.left - actualPanelWidth - margin > 0) {
        positions.push({
          x: elementRect.left - actualPanelWidth - margin,
          y: Math.max(margin, Math.min(elementRect.top + elementRect.height / 2 - actualPanelHeight / 2, viewportHeight - actualPanelHeight - margin)),
          label: 'LEFT-MIDDLE'
        });
      }

      // À DIREITA do elemento
      if (elementRect.right + actualPanelWidth + margin < viewportWidth) {
        positions.push({
          x: elementRect.right + margin,
          y: Math.max(margin, Math.min(elementRect.top + elementRect.height / 2 - actualPanelHeight / 2, viewportHeight - actualPanelHeight - margin)),
          label: 'RIGHT-MIDDLE'
        });
      }

      // Fallback: cantos se necessário
      if (positions.length === 0) {
        positions.push(
          { x: margin, y: margin, label: 'TOP-LEFT-CORNER' },
          { x: viewportWidth - actualPanelWidth - margin, y: margin, label: 'TOP-RIGHT-CORNER' },
          { x: margin, y: viewportHeight - actualPanelHeight - margin, label: 'BOTTOM-LEFT-CORNER' },
          { x: viewportWidth - actualPanelWidth - margin, y: viewportHeight - actualPanelHeight - margin, label: 'BOTTOM-RIGHT-CORNER' }
        );
      }

      return positions;
    };

    // Encontrar melhor posição sem colisão
    const candidatePositions = generatePositions();
    let bestPos = candidatePositions[0];
    let hasNoCollision = false;

    for (const candidate of candidatePositions) {
      const panelBounds = getPanelRect(candidate.x, candidate.y);
      if (!hasCollision(elementRect, panelBounds)) {
        bestPos = candidate;
        hasNoCollision = true;
        break;
      }
    }

    // Garantir que a posição final está dentro do viewport
    const finalX = Math.max(margin, Math.min(bestPos.x, viewportWidth - actualPanelWidth - margin));
    const finalY = Math.max(margin, Math.min(bestPos.y, viewportHeight - actualPanelHeight - margin));

    // Aplicar inline styles para posicionamento real
    const newStyle: React.CSSProperties = {
      position: 'fixed',
      top: `${finalY}px`,
      left: `${finalX}px`,
      width: '420px',
      maxWidth: '90vw',
      maxHeight: '85vh'
    };

    setPanelStyle(newStyle);

    console.log('📍 [EditorPanel] Posicionamento fluido calculado:', {
      elemento: {
        top: elementRect.top.toFixed(0),
        left: elementRect.left.toFixed(0),
        width: elementRect.width.toFixed(0),
        height: elementRect.height.toFixed(0)
      },
      painel: {
        x: finalX.toFixed(0),
        y: finalY.toFixed(0),
        width: actualPanelWidth.toFixed(0),
        height: actualPanelHeight.toFixed(0),
        posicao: bestPos.label,
        semColisao: hasNoCollision
      },
      viewport: { width: viewportWidth, height: viewportHeight }
    });
  }, [element.boundingRect, embedded]);

  // 🎯 REMOVIDO: handleSave - salvamento agora é automático

  return (
    <div
      ref={panelRef}
      className="editor-panel"
      style={embedded ? {} : panelStyle}
    >
      <div className="editor-panel-header">
        {/* Botões de ação - linha única compacta */}
        <div className="header-actions-row">
          <div className="header-actions-left">
            {/* 🎯 Botões de Undo/Redo */}
            {onUndo && (
              <button
                className={`editor-undo-btn ${!canUndo ? 'disabled' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (canUndo) onUndo();
                }}
                disabled={!canUndo}
                title={canUndo ? `Desfazer (Ctrl+Z) - ${historyLength} estados` : 'Nada para desfazer'}
              >
                <Undo2 size={18} strokeWidth={2.5} />
              </button>
            )}
            {onRedo && (
              <button
                className={`editor-redo-btn ${!canRedo ? 'disabled' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (canRedo) onRedo();
                }}
                disabled={!canRedo}
                title={canRedo ? 'Refazer (Ctrl+Y)' : 'Nada para refazer'}
              >
                <Redo2 size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="header-actions-right">
            <button
              className="editor-save-btn"
              onClick={(e) => {
                console.log('🟢 Botão SALVAR clicado');
                e.preventDefault();
                e.stopPropagation();
                onSave(); // Salvar edições primeiro
                onClose(); // Depois fechar o painel para visualizar melhor
              }}
              title="Salvar edições"
            >
              <Check size={18} strokeWidth={2.5} />
            </button>
            <button
              className="editor-duplicate-btn"
              onClick={(e) => {
                console.log('📋 Botão DUPLICAR clicado');
                e.preventDefault();
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicar elemento"
            >
              <Copy size={18} strokeWidth={2.5} />
            </button>
            <button
              className="editor-remove-btn"
              onClick={(e) => {
                console.log('🔴 Botão REMOVER clicado');
                e.preventDefault();
                e.stopPropagation();
                // Unifica com Ferramentas Avançadas: aplicar display:none via onUpdate
                onUpdate({
                  xpath: element.xpath,
                  property: 'display',
                  value: 'none',
                  type: 'style'
                });
              }}
              title="Remover elemento"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>
            <button
              className="editor-close-btn"
              onClick={(e) => {
                console.log('⚪ Botão FECHAR clicado');
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              title="Fechar painel"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="editor-tabs">
        {/* Primeira linha */}
        <div className="editor-tabs-row">
          <button
            className={`editor-tab ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            Texto e Fontes
          </button>
          <button
            className={`editor-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Imagens e Vídeos
          </button>
          <button
            className={`editor-tab ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Layout e Espaçamento
          </button>
        </div>

        {/* Segunda linha */}
        <div className="editor-tabs-row">
          <button
            className={`editor-tab ${activeTab === 'section' ? 'active' : ''}`}
            onClick={() => setActiveTab('section')}
          >
            Identificação
          </button>
          <button
            className={`editor-tab ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => setActiveTab('link')}
          >
            Links
          </button>
          <button
            className={`editor-tab ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => setActiveTab('background')}
          >
            Backgrounds
          </button>
          <button
            className={`editor-tab ${activeTab === 'borders' ? 'active' : ''}`}
            onClick={() => setActiveTab('borders')}
          >
            Bordas e Cantos
          </button>
          <button
            className={`editor-tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Sombras e Animações
          </button>
          <button
            className={`editor-tab ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            Ferramentas
          </button>
        </div>
      </div>

      <div className="editor-content">
        {activeTab === 'section' && (
          <SectionTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'link' && (
          <LinkTab element={element} onUpdate={onUpdate} allSections={allSections} />
        )}
        {activeTab === 'text' && (
          <TextTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'media' && (
          <MediaTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'layout' && (
          <LayoutTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'background' && (
          <BackgroundTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'borders' && (
          <BordersTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'advanced' && (
          <AdvancedTab element={element} onUpdate={onUpdate} />
        )}
        {activeTab === 'tools' && (
          <ToolsTab element={element} onUpdate={onUpdate} iframeRef={iframeRef} onSaveEdits={onSave} />
        )}
      </div>

      {/* 🎯 INFO: Instruções de salvamento */}
      <div style={{
        padding: '12px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        marginTop: '12px'
      }}>
        <p style={{
          fontSize: '11px',
          color: '#10b981',
          margin: '0',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          💾 Clique no botão ✓ acima para salvar todas as edições
        </p>
      </div>
    </div>
  );
};
