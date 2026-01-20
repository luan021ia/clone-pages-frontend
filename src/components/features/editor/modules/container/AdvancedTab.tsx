import React, { useState, useEffect } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import '../../EditorTabs.css';

interface AdvancedTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ element, onUpdate }) => {
  // 🎨 SOMBRAS - BOX SHADOW
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(0);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(50);
  const [shadowInset, setShadowInset] = useState(false);

  // 🎨 SOMBRAS - TEXT SHADOW
  const [textShadowX, setTextShadowX] = useState(0);
  const [textShadowY, setTextShadowY] = useState(0);
  const [textShadowBlur, setTextShadowBlur] = useState(0);
  const [textShadowColor, setTextShadowColor] = useState('#000000');

  // 🎭 ANIMAÇÕES - ANIMATION
  const [animationName, setAnimationName] = useState('none');
  const [animationDuration, setAnimationDuration] = useState(1);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [animationIterationCount, setAnimationIterationCount] = useState('1');
  const [animationDirection, setAnimationDirection] = useState('normal');

  // 🎭 ANIMAÇÕES - TRANSITION
  const [transitionDuration, setTransitionDuration] = useState(0.3);
  const [transitionProperty, setTransitionProperty] = useState('all');

  // 🎭 ANIMAÇÕES - TRANSFORM
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  // 🎭 ANIMAÇÕES - FILTROS
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [saturate, setSaturate] = useState(100);

  
  // 🎯 Carregar valores atuais do elemento
  useEffect(() => {
    // 🛡️ Null safety check
    if (!element?.styles) {
      console.warn('⚠️ [AdvancedTab] element.styles is undefined');
      return;
    }

    // Carregar Box Shadow
    const boxShadow = element?.styles?.boxShadow as string || 'none';
    if (boxShadow !== 'none') {
      const parts = boxShadow.split(' ');
      if (parts.length >= 4) {
        setShadowX(parseInt(parts[0]) || 0);
        setShadowY(parseInt(parts[1]) || 0);
        setShadowBlur(parseInt(parts[2]) || 0);
        setShadowSpread(parseInt(parts[3]) || 0);
      }
      setShadowInset(boxShadow.includes('inset'));
    }

    // Carregar Text Shadow
    const textShadow = element?.styles?.textShadow as string || 'none';
    if (textShadow !== 'none') {
      const parts = textShadow.split(' ');
      if (parts.length >= 3) {
        setTextShadowX(parseInt(parts[0]) || 0);
        setTextShadowY(parseInt(parts[1]) || 0);
        setTextShadowBlur(parseInt(parts[2]) || 0);
        const colorMatch = textShadow.match(/rgb\([^)]+\)|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/);
        if (colorMatch) {
          setTextShadowColor(colorMatch[0]);
        }
      }
    }

    // Carregar Transform
    const transform = element?.styles?.transform as string || '';
    if (transform) {
      const scaleMatch = transform.match(/scale\(([^)]+)\)/);
      if (scaleMatch) setScale(parseFloat(scaleMatch[1]));

      const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
      if (rotateMatch) setRotate(parseFloat(rotateMatch[1]));

      const translateXMatch = transform.match(/translateX\(([^)]+)px\)/);
      if (translateXMatch) setTranslateX(parseFloat(translateXMatch[1]));

      const translateYMatch = transform.match(/translateY\(([^)]+)px\)/);
      if (translateYMatch) setTranslateY(parseFloat(translateYMatch[1]));
    }

    // Carregar Filter
    const filter = element?.styles?.filter as string || '';
    if (filter) {
      const blurMatch = filter.match(/blur\(([^)]+)px\)/);
      if (blurMatch) setBlur(parseFloat(blurMatch[1]));

      const brightnessMatch = filter.match(/brightness\(([^)]+)%\)/);
      if (brightnessMatch) setBrightness(parseFloat(brightnessMatch[1]));

      const contrastMatch = filter.match(/contrast\(([^)]+)%\)/);
      if (contrastMatch) setContrast(parseFloat(contrastMatch[1]));

      const grayscaleMatch = filter.match(/grayscale\(([^)]+)%\)/);
      if (grayscaleMatch) setGrayscale(parseFloat(grayscaleMatch[1]));

      const hueRotateMatch = filter.match(/hue-rotate\(([^)]+)deg\)/);
      if (hueRotateMatch) setHueRotate(parseFloat(hueRotateMatch[1]));

      const saturateMatch = filter.match(/saturate\(([^)]+)%\)/);
      if (saturateMatch) setSaturate(parseFloat(saturateMatch[1]));
    }
  }, [element.xpath]);

  // 🎨 FUNÇÕES DE ATUALIZAÇÃO - SOMBRAS (TEMPO REAL)
  const updateBoxShadow = (immediate = false) => {
    const rgba = `rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(shadowColor.slice(5, 7), 16)}, ${shadowOpacity / 100})`;
    const value = shadowX === 0 && shadowY === 0 && shadowBlur === 0 && shadowSpread === 0
      ? 'none'
      : `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgba}`;

    onUpdate({
      xpath: element.xpath,
      property: 'boxShadow',
      value,
      type: 'style',
      immediate // Força atualização imediata no iframe
    });
  };

  const updateTextShadow = (immediate = false) => {
    const value = textShadowX === 0 && textShadowY === 0 && textShadowBlur === 0
      ? 'none'
      : `${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor}`;

    onUpdate({
      xpath: element.xpath,
      property: 'textShadow',
      value,
      type: 'style',
      immediate // Força atualização imediata no iframe
    });
  };

  // 🎭 FUNÇÕES DE ATUALIZAÇÃO - ANIMAÇÕES (TEMPO REAL)
  const updateAnimation = () => {
    if (animationName === 'none') {
      onUpdate({
        xpath: element.xpath,
        property: 'animation',
        value: 'none',
        type: 'style',
        immediate: true // Força atualização imediata no iframe
      });
    } else {
      const value = `${animationName} ${animationDuration}s ${animationDirection} ${animationIterationCount} ${animationDelay}s`;
      onUpdate({
        xpath: element.xpath,
        property: 'animation',
        value,
        type: 'style',
        immediate: true // Força atualização imediata no iframe
      });
    }
  };

  const updateTransition = () => {
    const value = `${transitionProperty} ${transitionDuration}s ease-in-out`;
    onUpdate({
      xpath: element.xpath,
      property: 'transition',
      value,
      type: 'style',
      immediate: true // Força atualização imediata no iframe
    });
  };

  const updateTransform = () => {
    const transforms = [];
    if (scale !== 1) transforms.push(`scale(${scale})`);
    if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);
    if (translateX !== 0) transforms.push(`translateX(${translateX}px)`);
    if (translateY !== 0) transforms.push(`translateY(${translateY}px)`);

    const value = transforms.length > 0 ? transforms.join(' ') : 'none';
    onUpdate({
      xpath: element.xpath,
      property: 'transform',
      value,
      type: 'style',
      immediate: true // Força atualização imediata no iframe
    });
  };

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
      type: 'style',
      immediate: true // Força atualização imediata no iframe
    });
  };

  // 🎨 PRESETS DE SOMBRAS
  const shadowPresets = [
    { name: 'Nenhuma', x: 0, y: 0, blur: 0, spread: 0 },
    { name: 'Sutil', x: 0, y: 2, blur: 4, spread: 0 },
    { name: 'Média', x: 0, y: 4, blur: 8, spread: 0 },
    { name: 'Forte', x: 0, y: 8, blur: 16, spread: 0 },
    { name: 'Elevada', x: 0, y: 12, blur: 24, spread: 0 }
  ];

  // 🎭 PRESETS DE ANIMAÇÕES
  const animationPresets = [
    { name: 'Nenhuma', value: 'none' },
    { name: 'Pulse', value: 'pulse 2s infinite' },
    { name: 'Fade In', value: 'fadeIn 0.5s ease-in' },
    { name: 'Slide In', value: 'slideIn 0.5s ease-out' },
    { name: 'Bounce', value: 'bounce 1s ease-in-out' },
    { name: 'Shake', value: 'shake 0.5s ease-in-out' },
    { name: 'Rotate', value: 'rotate 2s linear infinite' },
    { name: 'Zoom', value: 'zoom 0.5s ease-in-out' }
  ];

  return (
    <div className="editor-tab-content">
      {/* 🎨 SOMBRAS */}
      <div className="editor-section">
        <h4 className="editor-section-title">🎨 Sombras</h4>

        {/* Box Shadow */}
        <div className="editor-group">
          <label>Sombra da Caixa</label>
          <div className="preset-buttons">
            {shadowPresets.map((preset, index) => (
              <button
                key={index}
                className="preset-btn"
                onClick={() => {
                  setShadowX(preset.x);
                  setShadowY(preset.y);
                  setShadowBlur(preset.blur);
                  setShadowSpread(preset.spread);
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="control-row">
            <div className="control-col">
              <label>X:</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={shadowX}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setShadowX(value);
                  updateBoxShadow(true); // Atualização em tempo real
                }}
              />
              <span>{shadowX}px</span>
            </div>
            <div className="control-col">
              <label>Y:</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={shadowY}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setShadowY(value);
                  updateBoxShadow(true); // Atualização em tempo real
                }}
              />
              <span>{shadowY}px</span>
            </div>
          </div>

          <div className="control-row">
            <div className="control-col">
              <label>Desfoque:</label>
              <input
                type="range"
                min="0"
                max="50"
                value={shadowBlur}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setShadowBlur(value);
                  updateBoxShadow(true); // Atualização em tempo real
                }}
              />
              <span>{shadowBlur}px</span>
            </div>
            <div className="control-col">
              <label>Expansão:</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={shadowSpread}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setShadowSpread(value);
                  updateBoxShadow(true); // Atualização em tempo real
                }}
              />
              <span>{shadowSpread}px</span>
            </div>
          </div>

          <div className="control-row">
            <div className="control-col">
              <label>Cor:</label>
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => {
                  setShadowColor(e.target.value);
                  updateBoxShadow(true); // Atualização em tempo real
                }}
              />
            </div>
            <div className="control-col">
              <label>Opacidade:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={shadowOpacity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setShadowOpacity(value);
                  updateBoxShadow(true); // Atualização em tempo real
                }}
              />
              <span>{shadowOpacity}%</span>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input
              type="checkbox"
              checked={shadowInset}
              onChange={(e) => {
                setShadowInset(e.target.checked);
                updateBoxShadow(true); // Atualização em tempo real
              }}
            />
            <span>Sombra Interna (Inset)</span>
          </label>
        </div>

        {/* Text Shadow */}
        <div className="editor-group">
          <label>Sombra do Texto</label>
          <div className="control-row">
            <div className="control-col">
              <label>X:</label>
              <input
                type="range"
                min="-10"
                max="10"
                value={textShadowX}
                onChange={(e) => {
                  setTextShadowX(parseInt(e.target.value));
                  updateTextShadow(true); // Atualização em tempo real
                }}
              />
              <span>{textShadowX}px</span>
            </div>
            <div className="control-col">
              <label>Y:</label>
              <input
                type="range"
                min="-10"
                max="10"
                value={textShadowY}
                onChange={(e) => {
                  setTextShadowY(parseInt(e.target.value));
                  updateTextShadow(true); // Atualização em tempo real
                }}
              />
              <span>{textShadowY}px</span>
            </div>
            <div className="control-col">
              <label>Desfoque:</label>
              <input
                type="range"
                min="0"
                max="20"
                value={textShadowBlur}
                onChange={(e) => {
                  setTextShadowBlur(parseInt(e.target.value));
                  updateTextShadow(true); // Atualização em tempo real
                }}
              />
              <span>{textShadowBlur}px</span>
            </div>
            <div className="control-col">
              <label>Cor:</label>
              <input
                type="color"
                value={textShadowColor}
                onChange={(e) => {
                  setTextShadowColor(e.target.value);
                  updateTextShadow(true); // Atualização em tempo real
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🎭 ANIMAÇÕES */}
      <div className="editor-section">
        <h4 className="editor-section-title">🎭 Animações</h4>

        {/* Animation */}
        <div className="editor-group">
          <label>Animação</label>
          <div className="preset-buttons">
            {animationPresets.map((preset, index) => (
              <button
                key={index}
                className={`preset-btn ${animationName === preset.value.split(' ')[0] ? 'active' : ''}`}
                onClick={() => {
                  if (preset.value === 'none') {
                    setAnimationName('none');
                    setAnimationDuration(1);
                    setAnimationIterationCount('1');
                  } else {
                    const parts = preset.value.split(' ');
                    setAnimationName(parts[0]);
                    setAnimationDuration(parseFloat(parts[1]) || 1);
                    if (parts.includes('infinite')) {
                      setAnimationIterationCount('infinite');
                    }
                  }
                  updateAnimation();
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="control-row">
            <div className="control-col">
              <label>Duração:</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={animationDuration}
                onChange={(e) => {
                  setAnimationDuration(parseFloat(e.target.value));
                  updateAnimation(); // Atualização em tempo real
                }}
              />
              <span>{animationDuration}s</span>
            </div>
            <div className="control-col">
              <label>Atraso:</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={animationDelay}
                onChange={(e) => {
                  setAnimationDelay(parseFloat(e.target.value));
                  updateAnimation(); // Atualização em tempo real
                }}
              />
              <span>{animationDelay}s</span>
            </div>
          </div>

          <div className="control-row">
            <div className="control-col">
              <label>Repetições:</label>
              <select
                value={animationIterationCount}
                onChange={(e) => {
                  setAnimationIterationCount(e.target.value);
                  updateAnimation(); // Atualização em tempo real
                }}
              >
                <option value="1">1 vez</option>
                <option value="2">2 vezes</option>
                <option value="3">3 vezes</option>
                <option value="5">5 vezes</option>
                <option value="infinite">Infinito</option>
              </select>
            </div>
            <div className="control-col">
              <label>Direção:</label>
              <select
                value={animationDirection}
                onChange={(e) => {
                  setAnimationDirection(e.target.value);
                  updateAnimation(); // Atualização em tempo real
                }}
                              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverso</option>
                <option value="alternate">Alternado</option>
                <option value="alternate-reverse">Alternado Reverso</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transition */}
        <div className="editor-group">
          <label>Transição (Hover)</label>
          <div className="control-row">
            <div className="control-col">
              <label>Propriedade:</label>
              <select
                value={transitionProperty}
                onChange={(e) => {
                  setTransitionProperty(e.target.value);
                  updateTransition(); // Atualização em tempo real
                }}
                              >
                <option value="all">Todas</option>
                <option value="color">Cor</option>
                <option value="background-color">Fundo</option>
                <option value="border-color">Borda</option>
                <option value="transform">Transformação</option>
                <option value="opacity">Opacidade</option>
                <option value="box-shadow">Sombra</option>
              </select>
            </div>
            <div className="control-col">
              <label>Duração:</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={transitionDuration}
                onChange={(e) => {
                  setTransitionDuration(parseFloat(e.target.value));
                  updateTransition(); // Atualização em tempo real
                }}
              />
              <span>{transitionDuration}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎬 TRANSFORMAÇÕES */}
      <div className="editor-section">
        <h4 className="editor-section-title">🎬 Transformações</h4>

        <div className="editor-group">
          <label>Transformação Geométrica</label>
          <div className="control-row">
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Escala:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => {
                    setScale(parseFloat(e.target.value));
                    updateTransform(); // Atualização em tempo real
                  }}
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
                  {scale}x
                </span>
              </div>
            </div>
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Rotação:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotate}
                  onChange={(e) => {
                    setRotate(parseInt(e.target.value));
                    updateTransform(); // Atualização em tempo real
                  }}
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
                  {rotate}°
                </span>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Mover X:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={translateX}
                  onChange={(e) => {
                    setTranslateX(parseInt(e.target.value));
                    updateTransform(); // Atualização em tempo real
                  }}
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
                  {translateX}px
                </span>
              </div>
            </div>
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Mover Y:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={translateY}
                  onChange={(e) => {
                    setTranslateY(parseInt(e.target.value));
                    updateTransform(); // Atualização em tempo real
                  }}
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
                  {translateY}px
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔮 FILTROS VISUAIS */}
      <div className="editor-section">
        <h4 className="editor-section-title">🔮 Filtros Visuais</h4>

        <div className="editor-group">
          <label>Efeitos Visuais</label>
          <div className="control-row">
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Desfoque:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => {
                    setBlur(parseFloat(e.target.value));
                    updateFilters(); // Atualização em tempo real
                  }}
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
                  {blur}px
                </span>
              </div>
            </div>
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Brilho:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => {
                    setBrightness(parseInt(e.target.value));
                    updateFilters(); // Atualização em tempo real
                  }}
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
                  {brightness}%
                </span>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Contraste:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => {
                    setContrast(parseInt(e.target.value));
                    updateFilters(); // Atualização em tempo real
                  }}
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
                  {contrast}%
                </span>
              </div>
            </div>
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Escala Cinza:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => {
                    setGrayscale(parseInt(e.target.value));
                    updateFilters(); // Atualização em tempo real
                  }}
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
                  {grayscale}%
                </span>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Matiz:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hueRotate}
                  onChange={(e) => {
                    setHueRotate(parseInt(e.target.value));
                    updateFilters(); // Atualização em tempo real
                  }}
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
                  {hueRotate}°
                </span>
              </div>
            </div>
            <div className="control-col">
              <label style={{ color: '#a5b4fc', fontWeight: '600', marginBottom: '4px', fontSize: '11px' }}>Saturação:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturate}
                  onChange={(e) => {
                    setSaturate(parseInt(e.target.value));
                    updateFilters(); // Atualização em tempo real
                  }}
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
                  {saturate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ FERRAMENTAS ÚTEIS */}
      <div className="editor-section">
        <h4 className="editor-section-title">🛠️ Ferramentas Úteis</h4>

        <button
          className="editor-tool-btn"
          onClick={() => {
            const styles = JSON.stringify(element.styles, null, 2);
            navigator.clipboard.writeText(styles);
            alert('✅ Estilos CSS copiados para área de transferência!');
          }}
        >
          📋 Copiar Estilos CSS
        </button>

        <button
          className="editor-tool-btn"
          onClick={() => {
            if (confirm('❓ Tem certeza que deseja remover este elemento?')) {
              onUpdate({
                xpath: element.xpath,
                property: 'display',
                value: 'none',
                type: 'style'
              });
            }
          }}
        >
          🗑️ Remover Elemento
        </button>

        <button
          className="editor-tool-btn"
          onClick={() => {
            // Resetar todas as sombras e animações
            setShadowX(0);
            setShadowY(0);
            setShadowBlur(0);
            setShadowSpread(0);
            setShadowOpacity(50);
            setShadowInset(false);
            setTextShadowX(0);
            setTextShadowY(0);
            setTextShadowBlur(0);
            setAnimationName('none');
            setAnimationDuration(1);
            setScale(1);
            setRotate(0);
            setTranslateX(0);
            setTranslateY(0);
            setBlur(0);
            setBrightness(100);
            setContrast(100);
            setGrayscale(0);
            setHueRotate(0);
            setSaturate(100);

            // Aplicar resets
            onUpdate({ xpath: element.xpath, property: 'boxShadow', value: 'none', type: 'style' });
            onUpdate({ xpath: element.xpath, property: 'textShadow', value: 'none', type: 'style' });
            onUpdate({ xpath: element.xpath, property: 'animation', value: 'none', type: 'style' });
            onUpdate({ xpath: element.xpath, property: 'transform', value: 'none', type: 'style' });
            onUpdate({ xpath: element.xpath, property: 'filter', value: 'none', type: 'style' });
            onUpdate({ xpath: element.xpath, property: 'transition', value: 'none', type: 'style' });

            alert('🔄 Todas as sombras e animações foram removidas!');
          }}
        >
          🔄 Resetar Sombras & Animações
        </button>
      </div>

      {/* 📊 INFORMAÇÕES */}
      <div className="editor-section">
        <h4 className="editor-section-title">📊 Informações do Elemento</h4>

        <div className="info-table">
          <div className="info-row">
            <span className="info-label">Tag:</span>
            {/* 🎯 FIX: Usar optional chaining para tagName */}
            <span className="info-value">{element?.tagName || 'unknown'}</span>
          </div>
          {element?.id && (
            <div className="info-row">
              <span className="info-label">ID:</span>
              <span className="info-value">{element.id}</span>
            </div>
          )}
          {element?.className && (
            <div className="info-row">
              <span className="info-label">Classes:</span>
              <span className="info-value">{element.className}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">XPath:</span>
            <span className="info-value info-xpath">{element.xpath}</span>
          </div>
        </div>
      </div>

      <style>{`
        .preset-buttons {
          display: flex;
          gap: 5px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .preset-btn {
          padding: 5px 10px;
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 4px;
          background: rgba(45, 52, 65, 0.8);
          color: #d1d5db;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          background: rgba(79, 70, 229, 0.3);
          border-color: #818cf8;
          color: #e0e7ff;
        }

        .preset-btn.active {
          background: #60a5fa;
          color: white;
          border-color: #60a5fa;
          font-weight: 600;
        }

        .control-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .control-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .control-col label {
          font-size: 11px;
          color: #a5b4fc;
          font-weight: 600;
        }

        .control-col input[type="range"] {
          width: 100%;
          height: '6px';
          border-radius: '3px';
          background: 'rgba(31, 41, 55, 0.8)';
          outline: none;
          cursor: pointer;
        }

        .control-col input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #818cf8;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-col input[type="range"]::-webkit-slider-thumb:hover {
          background: #60a5fa;
          transform: scale(1.2);
        }

        .control-col input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #818cf8;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .control-col input[type="range"]::-moz-range-thumb:hover {
          background: #60a5fa;
          transform: scale(1.2);
        }

        .control-col span {
          font-size: 10px;
          color: #e0e7ff;
          text-align: center;
          background: rgba(79, 70, 229, 0.2);
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
          border: 1px solid rgba(96, 165, 250, 0.5);
        }

        .control-col select {
          padding: 4px;
          border: 1px solid rgba(96, 165, 250, 0.5);
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          background: rgba(31, 41, 55, 0.9);
          color: #e5e7eb;
        }

        .control-col input[type="color"] {
          width: 100%;
          height: 30px;
          border: 1px solid rgba(96, 165, 250, 0.5);
          border-radius: 4px;
          cursor: pointer;
          background: rgba(31, 41, 55, 0.9);
        }

        .info-table {
          background: rgba(31, 41, 55, 0.8);
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(96, 165, 250, 0.3);
          font-size: 11px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(96, 165, 250, 0.2);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #a5b4fc;
          min-width: 80px;
          font-size: 11px;
        }

        .info-value {
          color: #e5e7eb;
          word-break: break-all;
          font-weight: 500;
          font-size: 11px;
        }

        .info-xpath {
          font-family: monospace;
          font-size: 9px;
          color: #c7d2fe;
          background: rgba(79, 70, 229, 0.15);
          padding: 2px 4px;
          border-radius: 3px;
        }

        .editor-tool-btn {
          width: 100%;
          padding: 12px;
          background: rgba(45, 52, 65, 0.8);
          border: 2px solid rgba(96, 165, 250, 0.3);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 12px;
          transition: all 0.2s;
          color: #d1d5db;
          font-size: 12px;
        }

        .editor-tool-btn:hover {
          border-color: #818cf8;
          background: rgba(79, 70, 229, 0.3);
          color: #e0e7ff;
        }

        .editor-section {
          margin-bottom: 20px;
        }

        .editor-group {
          margin-bottom: 15px;
        }

        .editor-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #c7d2fe;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};