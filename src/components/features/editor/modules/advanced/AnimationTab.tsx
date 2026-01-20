import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import '../../EditorTabs.css';

interface AnimationTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

interface SliderInfo {
  type: string;
  hasInstance: boolean;
  config: {
    autoplay: boolean | { delay?: number };
    speed: number;
    delay?: number;
    loop: boolean;
    navigation: boolean;
    pagination: boolean;
    [key: string]: any;
  };
}

const ANIMATIONS = [
  { name: 'pulse', label: '💗 Pulsar' },
  { name: 'bounce', label: '⬆️ Bounce' },
  { name: 'shake', label: '🤝 Tremer' },
  { name: 'fadeIn', label: '👻 Fade In' },
  { name: 'slideInLeft', label: '⬅️ Deslizar Esquerda' },
  { name: 'slideInRight', label: '➡️ Deslizar Direita' },
  { name: 'zoomIn', label: '🔍 Zoom In' },
  { name: 'rotate', label: '🔄 Girar' },
  { name: 'float', label: '🎈 Flutuar' },
];

export const AnimationTab: React.FC<AnimationTabProps> = ({ element, onUpdate }) => {
  const [duration, setDuration] = useState('1');
  const [iterations, setIterations] = useState('infinite');
  
  // 🎠 Estado para slider (se elemento for um slider)
  const [sliderConfig, setSliderConfig] = useState<SliderInfo['config'] | null>(null);
  const [sliderType, setSliderType] = useState<string>('');
  
  // 🎠 Detectar se elemento é um slider
  useEffect(() => {
    const elem = element as any;
    if (elem.isSlider && elem.sliderInfo) {
      console.log('🎠 [AnimationTab] Slider detectado:', elem.sliderInfo);
      setSliderType(elem.sliderInfo.type);
      setSliderConfig(elem.sliderInfo.config);
    } else {
      setSliderType('');
      setSliderConfig(null);
    }
  }, [element]);

  const applyAnimation = (animationName: string) => {
    console.log('🎬 [AnimationTab] Aplicando animação:', animationName);

    const animationValue = `${animationName} ${duration}s ease-in-out ${iterations}`;
    console.log('🎬 [AnimationTab] Valor da animação:', animationValue);

    // Aplicar diretamente - o backend vai cuidar da reinicialização
    onUpdate({
      xpath: element.xpath,
      property: 'animation',
      value: animationValue,
      type: 'style'
    });
  };

  const removeAnimation = () => {
    onUpdate({
      xpath: element.xpath,
      property: 'animation',
      value: 'none',
      type: 'style'
    });
  };

  // 🎠 Handler para aplicar configurações do slider
  const applySliderConfig = () => {
    if (!sliderConfig) return;
    
    console.log('🎠 [AnimationTab] Aplicando configurações do slider:', sliderConfig);
    
    onUpdate({
      xpath: element.xpath,
      property: 'slider-config',
      value: JSON.stringify(sliderConfig),
      type: 'attribute' // Usar attribute como tipo especial
    });
  };

  return (
    <div className="editor-tab-content">
      {/* 🎠 SLIDER EDITOR - Aparece se elemento for slider */}
      {sliderConfig && (
        <div className="editor-section" style={{ 
          borderBottom: '2px solid #60a5fa',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}>
          <h4 className="editor-section-title">🎠 Configurações do Slider</h4>
          
          <div style={{
            padding: '8px 12px',
            background: 'rgba(96, 165, 250, 0.1)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#a5b4fc'
          }}>
            <strong>Tipo detectado:</strong> {sliderType.toUpperCase()}
            {sliderConfig.slidesPerView && (
              <div>Slides visíveis: {sliderConfig.slidesPerView}</div>
            )}
          </div>

          {/* Autoplay */}
          <div className="editor-field" style={{ marginBottom: '12px' }}>
            <label className="editor-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={!!sliderConfig.autoplay}
                onChange={(e) => setSliderConfig({ 
                  ...sliderConfig, 
                  autoplay: e.target.checked 
                })}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Autoplay (Reprodução Automática)</span>
            </label>
          </div>

          {/* Speed */}
          <div className="editor-field">
            <label className="editor-label">Velocidade da Transição ({sliderConfig.speed}ms)</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={sliderConfig.speed}
              onChange={(e) => setSliderConfig({ 
                ...sliderConfig, 
                speed: parseInt(e.target.value) 
              })}
              className="editor-input"
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '4px' }}>
              <span>100ms (rápido)</span>
              <span>2000ms (lento)</span>
            </div>
          </div>

          {/* Delay (se autoplay ativo) */}
          {sliderConfig.autoplay && (
            <div className="editor-field">
              <label className="editor-label">Intervalo entre Slides ({sliderConfig.delay || 3000}ms)</label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={sliderConfig.delay || 3000}
                onChange={(e) => setSliderConfig({ 
                  ...sliderConfig, 
                  delay: parseInt(e.target.value) 
                })}
                className="editor-input"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '4px' }}>
                <span>1s</span>
                <span>10s</span>
              </div>
            </div>
          )}

          {/* Loop */}
          <div className="editor-field" style={{ marginBottom: '12px' }}>
            <label className="editor-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={!!sliderConfig.loop}
                onChange={(e) => setSliderConfig({ 
                  ...sliderConfig, 
                  loop: e.target.checked 
                })}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Loop (Voltar ao início automaticamente)</span>
            </label>
          </div>

          {/* Navigation */}
          <div className="editor-field" style={{ marginBottom: '12px' }}>
            <label className="editor-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={!!sliderConfig.navigation}
                onChange={(e) => setSliderConfig({ 
                  ...sliderConfig, 
                  navigation: e.target.checked 
                })}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Setas de Navegação (← →)</span>
            </label>
          </div>

          {/* Pagination */}
          <div className="editor-field" style={{ marginBottom: '16px' }}>
            <label className="editor-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={!!sliderConfig.pagination}
                onChange={(e) => setSliderConfig({ 
                  ...sliderConfig, 
                  pagination: e.target.checked 
                })}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Paginação (• • •)</span>
            </label>
          </div>

          {/* Botão Aplicar */}
          <button 
            className="editor-apply-btn"
            onClick={applySliderConfig}
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ✅ Aplicar Configurações do Slider
          </button>
        </div>
      )}

      <div className="editor-section">
        <h4 className="editor-section-title">✨ Biblioteca de Animações</h4>

        <div className="animation-grid">
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.name}
              className="animation-btn"
              onClick={() => applyAnimation(anim.name)}
            >
              {anim.label}
            </button>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <h4 className="editor-section-title">⚙️ Configurações</h4>

        <div className="editor-field">
          <label className="editor-label">Duração (segundos)</label>
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="editor-input"
          />
        </div>

        <div className="editor-field">
          <label className="editor-label">Repetição</label>
          <select
            value={iterations}
            onChange={(e) => setIterations(e.target.value)}
            className="editor-select"
          >
            <option value="1">1 vez</option>
            <option value="2">2 vezes</option>
            <option value="3">3 vezes</option>
            <option value="infinite">Infinito</option>
          </select>
        </div>

        <button className="editor-remove-btn" onClick={removeAnimation}>
          ❌ Remover Animação
        </button>
      </div>

      <div className="editor-section">
        <div className="editor-info-box">
          💡 <strong>Dica:</strong> Clique em uma animação para aplicar ao elemento selecionado.
          Ajuste a duração e repetição antes de aplicar.
        </div>
      </div>
    </div>
  );
};
