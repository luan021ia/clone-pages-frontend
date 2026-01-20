import React, { useState } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';

interface EffectsTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const EffectsTab: React.FC<EffectsTabProps> = ({ element, onUpdate }) => {
  // Filters
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [saturate, setSaturate] = useState(100);

  // Animation
  const [animationName, setAnimationName] = useState('none');
  const [animationDuration, setAnimationDuration] = useState(1);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [animationIterationCount, setAnimationIterationCount] = useState('1');

  // Transition
  const [transitionDuration, setTransitionDuration] = useState(0.3);

  // Transform
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const updateFilters = () => {
    const filters = [];
    if (blur > 0) filters.push(`blur(${blur}px)`);
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (grayscale > 0) filters.push(`grayscale(${grayscale}%)`);
    if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);

    const value = filters.length > 0 ? filters.join(' ') : 'none';
    onUpdate({
      xpath: element.xpath,
      property: 'filter',
      value,
      type: 'style'
    });
  };

  const applyAnimation = () => {
    console.log('🎬 [EffectsTab] Aplicando animação:', animationName);

    const value = animationName === 'none'
      ? 'none'
      : `${animationName} ${animationDuration}s ease-in-out ${animationDelay}s ${animationIterationCount}`;

    console.log('🎬 [EffectsTab] Valor da animação:', value);

    onUpdate({
      xpath: element.xpath,
      property: 'animation',
      value,
      type: 'style'
    });
  };

  return (
    <div className="editor-tab-content">
      <div className="editor-group">
        <label>Filtros CSS</label>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Desfoque (Blur)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={blur}
              onChange={(e) => {
                setBlur(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="20"
              step="0.5"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="range"
              value={blur}
              onChange={(e) => {
                setBlur(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="20"
              step="0.5"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Brilho (Brightness)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={brightness}
              onChange={(e) => {
                setBrightness(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="200"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>%</span>
            <input
              type="range"
              value={brightness}
              onChange={(e) => {
                setBrightness(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="200"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Contraste (Contrast)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={contrast}
              onChange={(e) => {
                setContrast(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="200"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>%</span>
            <input
              type="range"
              value={contrast}
              onChange={(e) => {
                setContrast(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="200"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Escala de Cinza (Grayscale)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={grayscale}
              onChange={(e) => {
                setGrayscale(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="100"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>%</span>
            <input
              type="range"
              value={grayscale}
              onChange={(e) => {
                setGrayscale(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="100"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Saturação (Saturate)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={saturate}
              onChange={(e) => {
                setSaturate(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="200"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>%</span>
            <input
              type="range"
              value={saturate}
              onChange={(e) => {
                setSaturate(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="200"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Rotação de Matiz (Hue Rotate)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={hueRotate}
              onChange={(e) => {
                setHueRotate(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="360"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>°</span>
            <input
              type="range"
              value={hueRotate}
              onChange={(e) => {
                setHueRotate(Number(e.target.value));
                updateFilters();
              }}
              min="0"
              max="360"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setBlur(0);
            setBrightness(100);
            setContrast(100);
            setGrayscale(0);
            setHueRotate(0);
            setSaturate(100);
            updateFilters();
          }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 Resetar Filtros
        </button>
      </div>

      <div className="editor-group">
        <label>Animações</label>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Tipo de Animação</label>
          <select
            value={animationName}
            onChange={(e) => {
              setAnimationName(e.target.value);
              applyAnimation();
            }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="none">Nenhuma</option>
            <option value="pulse">Pulsar</option>
            <option value="bounce">Pular</option>
            <option value="shake">Tremer</option>
            <option value="fadeIn">Aparecer (Fade In)</option>
            <option value="slideInLeft">Deslizar da Esquerda</option>
            <option value="slideInRight">Deslizar da Direita</option>
            <option value="zoomIn">Zoom In</option>
            <option value="rotate">Rotacionar</option>
            <option value="float">Flutuar</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Duração (segundos)</label>
          <input
            type="number"
            value={animationDuration}
            onChange={(e) => {
              setAnimationDuration(Number(e.target.value));
              applyAnimation();
            }}
            min="0.1"
            max="10"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Atraso (segundos)</label>
          <input
            type="number"
            value={animationDelay}
            onChange={(e) => {
              setAnimationDelay(Number(e.target.value));
              applyAnimation();
            }}
            min="0"
            max="5"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Repetições</label>
          <select
            value={animationIterationCount}
            onChange={(e) => {
              setAnimationIterationCount(e.target.value);
              applyAnimation();
            }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="1">1 vez</option>
            <option value="2">2 vezes</option>
            <option value="3">3 vezes</option>
            <option value="infinite">Infinito</option>
          </select>
        </div>
      </div>

      <div className="editor-group">
        <label>Transformações</label>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Escala (Scale)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={scale}
              onChange={(e) => {
                const value = Number(e.target.value);
                setScale(value);
                onUpdate({
                  xpath: element.xpath,
                  property: 'transform',
                  value: `scale(${value}) rotate(${rotate}deg)`,
                  type: 'style'
                });
              }}
              min="0.1"
              max="3"
              step="0.1"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <input
              type="range"
              value={scale}
              onChange={(e) => {
                const value = Number(e.target.value);
                setScale(value);
                onUpdate({
                  xpath: element.xpath,
                  property: 'transform',
                  value: `scale(${value}) rotate(${rotate}deg)`,
                  type: 'style'
                });
              }}
              min="0.1"
              max="3"
              step="0.1"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Rotação (Rotate)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              value={rotate}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRotate(value);
                onUpdate({
                  xpath: element.xpath,
                  property: 'transform',
                  value: `scale(${scale}) rotate(${value}deg)`,
                  type: 'style'
                });
              }}
              min="-180"
              max="180"
              style={{
                width: '80px',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <span style={{ fontSize: '12px' }}>°</span>
            <input
              type="range"
              value={rotate}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRotate(value);
                onUpdate({
                  xpath: element.xpath,
                  property: 'transform',
                  value: `scale(${scale}) rotate(${value}deg)`,
                  type: 'style'
                });
              }}
              min="-180"
              max="180"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Duração da Transição</label>
          <input
            type="number"
            value={transitionDuration}
            onChange={(e) => {
              setTransitionDuration(Number(e.target.value));
              onUpdate({
                xpath: element.xpath,
                property: 'transition',
                value: `all ${e.target.value}s ease`,
                type: 'style'
              });
            }}
            min="0"
            max="5"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0 0' }}>
            Aplica transição suave a todas as mudanças de estilo
          </p>
        </div>
      </div>
    </div>
  );
};
