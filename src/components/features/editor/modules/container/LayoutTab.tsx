import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface LayoutTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

type ViewportMode = 'desktop' | 'mobile';

// 🎯 SOLUÇÃO: Mover SpacingControl para FORA do LayoutTab para evitar re-criação a cada render
interface SpacingControlProps {
  label: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  linked: boolean;
  onLinkedChange: (linked: boolean) => void;
  onChange: (side: 'top' | 'right' | 'bottom' | 'left', value: number) => void;
}

const SpacingControl: React.FC<SpacingControlProps> = React.memo(({
  label,
  top,
  right,
  bottom,
  left,
  linked,
  onLinkedChange,
  onChange
}) => {
  return (
    <div className="editor-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <label style={{ margin: 0 }}>{label}</label>
        <button
          onClick={() => onLinkedChange(!linked)}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            backgroundColor: linked ? '#60a5fa' : 'white',
            color: linked ? 'white' : '#f3f4f6',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title={linked ? 'Desvincular valores' : 'Vincular valores'}
        >
          {linked ? '🔗' : '🔓'}
        </button>
      </div>

      {/* BARRA RETA COM 4 COMPARTIMENTOS (ESTILO ELEMENTOR) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↑ Top</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="range"
              min="-100"
              max="100"
              value={top}
              onChange={(e) => onChange('top', Number(e.target.value))}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(31, 41, 55, 0.8)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{
              minWidth: '35px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: '#e0e7ff',
              background: 'rgba(79, 70, 229, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid rgba(96, 165, 250, 0.4)'
            }}>
              {top}px
            </span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>← Left</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="range"
              min="-100"
              max="100"
              value={left}
              onChange={(e) => onChange('left', Number(e.target.value))}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(31, 41, 55, 0.8)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{
              minWidth: '35px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: '#e0e7ff',
              background: 'rgba(79, 70, 229, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid rgba(96, 165, 250, 0.4)'
            }}>
              {left}px
            </span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Right →</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="range"
              min="-100"
              max="100"
              value={right}
              onChange={(e) => onChange('right', Number(e.target.value))}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(31, 41, 55, 0.8)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{
              minWidth: '35px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: '#e0e7ff',
              background: 'rgba(79, 70, 229, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid rgba(96, 165, 250, 0.4)'
            }}>
              {right}px
            </span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', display: 'block', marginBottom: '4px' }}>↓ Bottom</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="range"
              min="-100"
              max="100"
              value={bottom}
              onChange={(e) => onChange('bottom', Number(e.target.value))}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(31, 41, 55, 0.8)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{
              minWidth: '35px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              color: '#e0e7ff',
              background: 'rgba(79, 70, 229, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid rgba(96, 165, 250, 0.4)'
            }}>
              {bottom}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export const LayoutTab: React.FC<LayoutTabProps> = ({ element, onUpdate }) => {
  // Viewport mode
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');

  // 🎯 NOVO: Viewport-specific Margin storage
  const [desktopMargin, setDesktopMargin] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [mobileMargin, setMobileMargin] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [marginLinked, setMarginLinked] = useState(true);

  // 🎯 NOVO: Viewport-specific Padding storage
  const [desktopPadding, setDesktopPadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [mobilePadding, setMobilePadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [paddingLinked, setPaddingLinked] = useState(true);

  // 🎯 NOVO: Viewport-specific Dimensions
  const [desktopWidth, setDesktopWidth] = useState('auto');
  const [mobileWidth, setMobileWidth] = useState('auto');
  const [desktopHeight, setDesktopHeight] = useState('auto');
  const [mobileHeight, setMobileHeight] = useState('auto');

  // Display e Position (não variam por viewport)
  const [display, setDisplay] = useState('block');
  const [position, setPosition] = useState('static');

  // 🎯 Computed values based on viewport mode
  const currentMargin = viewportMode === 'desktop' ? desktopMargin : mobileMargin;
  const currentPadding = viewportMode === 'desktop' ? desktopPadding : mobilePadding;
  const currentWidth = viewportMode === 'desktop' ? desktopWidth : mobileWidth;
  const currentHeight = viewportMode === 'desktop' ? desktopHeight : mobileHeight;

  // 🎯 SOLUÇÃO DEFINITIVA: Debounce timer para evitar perda de foco
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🎯 FIX: Usar useEffect apenas quando o XPATH do elemento mudar (novo elemento selecionado)
  // Isso evita que os inputs percam foco ao digitar
  useEffect(() => {
    // 🛡️ Null safety check
    if (!element?.styles) {
      console.warn('⚠️ [LayoutTab] element.styles is undefined');
      return;
    }

    // Parse margin - 🎯 Inicializar ambas as viewports com o mesmo valor inicial
    const marginValue = element?.styles?.margin as string || '0px';
    const margins = marginValue.split(' ').map(v => parseInt(v) || 0);
    let marginObj = { top: 0, right: 0, bottom: 0, left: 0 };

    if (margins.length === 1) {
      marginObj = { top: margins[0], right: margins[0], bottom: margins[0], left: margins[0] };
    } else if (margins.length === 4) {
      marginObj = { top: margins[0], right: margins[1], bottom: margins[2], left: margins[3] };
    }

    setDesktopMargin(marginObj);
    setMobileMargin(marginObj);

    // Parse padding - 🎯 Inicializar ambas as viewports com o mesmo valor inicial
    const paddingValue = element?.styles?.padding as string || '0px';
    const paddings = paddingValue.split(' ').map(v => parseInt(v) || 0);
    let paddingObj = { top: 0, right: 0, bottom: 0, left: 0 };

    if (paddings.length === 1) {
      paddingObj = { top: paddings[0], right: paddings[0], bottom: paddings[0], left: paddings[0] };
    } else if (paddings.length === 4) {
      paddingObj = { top: paddings[0], right: paddings[1], bottom: paddings[2], left: paddings[3] };
    }

    setDesktopPadding(paddingObj);
    setMobilePadding(paddingObj);

    // Dimensões - 🎯 Inicializar ambas as viewports
    const widthValue = element?.styles?.width as string || 'auto';
    const heightValue = element?.styles?.height as string || 'auto';
    setDesktopWidth(widthValue);
    setMobileWidth(widthValue);
    setDesktopHeight(heightValue);
    setMobileHeight(heightValue);

    // Reset viewport para desktop quando novo elemento é selecionado
    setViewportMode('desktop');
  }, [element.xpath]); // 🎯 Mudança crítica: apenas quando elemento mudar, não quando styles mudarem

  // 🔲 NOVO: Atualizar dimensões quando element.styles mudar (ex: via resize visual)
  useEffect(() => {
    if (!element?.styles) return;
    
    const widthValue = element.styles.width as string || 'auto';
    const heightValue = element.styles.height as string || 'auto';
    
    // Atualizar apenas se valores forem diferentes
    if (widthValue !== currentWidth) {
      if (viewportMode === 'desktop') {
        setDesktopWidth(widthValue);
      } else {
        setMobileWidth(widthValue);
      }
    }
    
    if (heightValue !== currentHeight) {
      if (viewportMode === 'desktop') {
        setDesktopHeight(heightValue);
      } else {
        setMobileHeight(heightValue);
      }
    }
  }, [element?.styles?.width, element?.styles?.height]);

  // 🎯 Função debounced para atualizar margin - AGORA com suporte a viewport
  const updateMarginDebounced = useCallback((top: number, right: number, bottom: number, left: number) => {
    // Limpar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Criar novo timer
    debounceTimerRef.current = setTimeout(() => {
      const value = `${top}px ${right}px ${bottom}px ${left}px`;
      console.log(`📐 [updateMarginDebounced] Atualizando margin para ${viewportMode}:`, value);
      onUpdate({
        xpath: element.xpath,
        property: 'margin',
        value,
        type: 'style',
        viewport: viewportMode
      });
    }, 300); // Aguardar 300ms após última digitação
  }, [element.xpath, viewportMode, onUpdate]);

  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    // 🎯 Atualizar o estado correto baseado no viewport mode
    const newMargin = { ...currentMargin };

    if (marginLinked) {
      newMargin.top = value;
      newMargin.right = value;
      newMargin.bottom = value;
      newMargin.left = value;
    } else {
      newMargin[side] = value;
    }

    // Atualizar state correto
    if (viewportMode === 'desktop') {
      setDesktopMargin(newMargin);
    } else {
      setMobileMargin(newMargin);
    }

    // Enviar update
    updateMarginDebounced(newMargin.top, newMargin.right, newMargin.bottom, newMargin.left);
  };

  // 🎯 Função debounced para atualizar padding - AGORA com suporte a viewport
  const updatePaddingDebounced = useCallback((top: number, right: number, bottom: number, left: number) => {
    // Limpar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Criar novo timer
    debounceTimerRef.current = setTimeout(() => {
      const value = `${top}px ${right}px ${bottom}px ${left}px`;
      console.log(`📐 [updatePaddingDebounced] Atualizando padding para ${viewportMode}:`, value);
      onUpdate({
        xpath: element.xpath,
        property: 'padding',
        value,
        type: 'style',
        viewport: viewportMode
      });
    }, 300); // Aguardar 300ms após última digitação
  }, [element.xpath, viewportMode, onUpdate]);

  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    // 🎯 Atualizar o estado correto baseado no viewport mode
    const newPadding = { ...currentPadding };

    if (paddingLinked) {
      newPadding.top = value;
      newPadding.right = value;
      newPadding.bottom = value;
      newPadding.left = value;
    } else {
      newPadding[side] = value;
    }

    // Atualizar state correto
    if (viewportMode === 'desktop') {
      setDesktopPadding(newPadding);
    } else {
      setMobilePadding(newPadding);
    }

    // Enviar update
    updatePaddingDebounced(newPadding.top, newPadding.right, newPadding.bottom, newPadding.left);
  };

  return (
    <div className="editor-tab-content">
      {/* Seletor de Viewport */}
      <div className="viewport-notice" style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#e5e7eb' }}>
          🖥️ / 📱 Edição Responsiva
        </div>
        <button
          onClick={() => setViewportMode(viewportMode === 'desktop' ? 'mobile' : 'desktop')}
          title={`Alternar para ${viewportMode === 'desktop' ? 'Mobile' : 'Desktop'}`}
          style={{
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(96, 165, 250, 0.3)',
            color: '#e2e8f0',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '44px',
            height: '32px'
          }}
        >
          {viewportMode === 'desktop' ? '🖥️' : '📱'}
        </button>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#a5b4fc', lineHeight: '1.4' }}>
          {viewportMode === 'mobile'
            ? '📱 Editando para Mobile - Alterações aplicadas apenas em telas pequenas (max-width: 768px)'
            : '🖥️ Editando para Desktop - Alterações aplicadas em telas normais'}
        </div>
      </div>

      <SpacingControl
        label="Espaçamento Externo (Margin)"
        top={currentMargin.top}
        right={currentMargin.right}
        bottom={currentMargin.bottom}
        left={currentMargin.left}
        linked={marginLinked}
        onLinkedChange={setMarginLinked}
        onChange={handleMarginChange}
      />

      <SpacingControl
        label="Espaçamento Interno (Padding)"
        top={currentPadding.top}
        right={currentPadding.right}
        bottom={currentPadding.bottom}
        left={currentPadding.left}
        linked={paddingLinked}
        onLinkedChange={setPaddingLinked}
        onChange={handlePaddingChange}
      />

      <div className="editor-group">
        <label>Largura</label>
        <input
          type="text"
          value={currentWidth}
          onChange={(e) => {
            // 🎯 Atualizar o estado correto baseado no viewport mode
            if (viewportMode === 'desktop') {
              setDesktopWidth(e.target.value);
            } else {
              setMobileWidth(e.target.value);
            }

            onUpdate({
              xpath: element.xpath,
              property: 'width',
              value: e.target.value,
              type: 'style',
              viewport: viewportMode
            });
          }}
          placeholder="auto, 100px, 50%, etc"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        />
      </div>

      <div className="editor-group">
        <label>Altura</label>
        <input
          type="text"
          value={currentHeight}
          onChange={(e) => {
            // 🎯 Atualizar o estado correto baseado no viewport mode
            if (viewportMode === 'desktop') {
              setDesktopHeight(e.target.value);
            } else {
              setMobileHeight(e.target.value);
            }

            onUpdate({
              xpath: element.xpath,
              property: 'height',
              value: e.target.value,
              type: 'style',
              viewport: viewportMode
            });
          }}
          placeholder="auto, 100px, 50vh, etc"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        />
      </div>

      <div className="editor-group">
        <label>Display</label>
        <select
          value={display}
          onChange={(e) => {
            setDisplay(e.target.value);
            onUpdate({
              xpath: element.xpath,
              property: 'display',
              value: e.target.value,
              type: 'style',
              viewport: viewportMode
            });
          }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        >
          <option value="block">Block</option>
          <option value="inline">Inline</option>
          <option value="inline-block">Inline Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="none">None (Ocultar)</option>
        </select>
      </div>

      <div className="editor-group">
        <label>Position</label>
        <select
          value={position}
          onChange={(e) => {
            setPosition(e.target.value);
            onUpdate({
              xpath: element.xpath,
              property: 'position',
              value: e.target.value,
              type: 'style',
              viewport: viewportMode
            });
          }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(96, 165, 250, 0.5)'
          }}
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>
    </div>
  );
};
