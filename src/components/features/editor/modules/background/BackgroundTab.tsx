import React, { useState, useEffect, useRef } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import { convertToWebP } from '@/utils/imageUtils';
import {
    MATERIAL_COLORS,
    TAILWIND_COLORS,
    PASTEL_COLORS,
    NEON_COLORS,
    CLASSIC_GRADIENTS_BICOLOR,
    CLASSIC_GRADIENTS_TRICOLOR,
    CLASSIC_GRADIENTS_MULTICOLOR,
    NEON_GRADIENTS_BICOLOR,
    NEON_GRADIENTS_TRICOLOR,
    NEON_GRADIENTS_MULTICOLOR,
    PASTEL_GRADIENTS_BICOLOR,
    PASTEL_GRADIENTS_TRICOLOR,
    PASTEL_GRADIENTS_MULTICOLOR
} from '@/constants/color-palettes';

interface BackgroundTabProps {
    element: SelectedElement;
    onUpdate: (update: ElementUpdate) => void;
}

type BackgroundCategory = 'solid' | 'gradient' | 'image';
type SolidPalette = 'material' | 'tailwind' | 'pastel' | 'neon';
type GradientType = 'classic' | 'neon' | 'pastel';

export const BackgroundTab: React.FC<BackgroundTabProps> = ({ element, onUpdate }) => {
    const [backgroundCategory, setBackgroundCategory] = useState<BackgroundCategory>('solid');
    const [solidPalette, setSolidPalette] = useState<SolidPalette>('material');
    const [gradientType, setGradientType] = useState<GradientType>('classic');

    const [tempColor, setTempColor] = useState('');
    const [tempGradient, setTempGradient] = useState('');
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [darkOverlay, setDarkOverlay] = useState(0); // 0 = sem overlay, 100 = totalmente preto

    const [appliedColor, setAppliedColor] = useState('');
    const [appliedGradient, setAppliedGradient] = useState('');
    const [appliedImage, setAppliedImage] = useState('');
    const [appliedOverlay, setAppliedOverlay] = useState(0);

    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (element?.styles?.backgroundColor) {
            const bgColor = element.styles.backgroundColor;
            setAppliedColor(bgColor);
            setTempColor(bgColor);
        }

        if (element?.styles?.backgroundImage && element.styles.backgroundImage !== 'none') {
            const bgImg = element.styles.backgroundImage;
            if (bgImg.includes('gradient')) {
                setAppliedGradient(bgImg);
                setTempGradient(bgImg);
                setBackgroundCategory('gradient');
            } else {
                const urlMatch = bgImg.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch) {
                    const imageUrl = urlMatch[1];
                    setAppliedImage(imageUrl);
                    setTempImageUrl(imageUrl);
                    setBackgroundCategory('image');
                }
            }
        }
    }, [element?.xpath]);

    // Limpar propriedades conflitantes ao trocar de categoria
    useEffect(() => {
        if (backgroundCategory === 'solid') {
            // Limpar gradientes e imagens (usar 'none' para remover propriedades CSS)
            onUpdate({ xpath: element.xpath, property: 'background', value: 'none', type: 'style', immediate: true });
            onUpdate({ xpath: element.xpath, property: 'backgroundImage', value: 'none', type: 'style', immediate: true });
        } else if (backgroundCategory === 'gradient') {
            // Limpar backgroundColor e imagens (usar 'transparent' para backgroundColor, 'none' para images)
            onUpdate({ xpath: element.xpath, property: 'backgroundColor', value: 'transparent', type: 'style', immediate: true });
            onUpdate({ xpath: element.xpath, property: 'backgroundImage', value: 'none', type: 'style', immediate: true });
        } else if (backgroundCategory === 'image') {
            // Limpar backgroundColor e background/gradientes
            onUpdate({ xpath: element.xpath, property: 'backgroundColor', value: 'transparent', type: 'style', immediate: true });
            onUpdate({ xpath: element.xpath, property: 'background', value: 'none', type: 'style', immediate: true });
        }
    }, [backgroundCategory]);

    // Auto-aplicar cores, gradientes e overlay (preview instantâneo)
    useEffect(() => {
        const overlayOpacity = darkOverlay / 100;
        const overlayGradient = darkOverlay > 0
            ? `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity}))`
            : '';

        if (backgroundCategory === 'solid' && tempColor) {
            // Auto-aplicar cor sólida com overlay (somente se uma cor foi selecionada)
            if (darkOverlay > 0) {
                const backgroundValue = `${overlayGradient}, ${tempColor}`;
                onUpdate({
                    xpath: element.xpath,
                    property: 'background',
                    value: backgroundValue,
                    type: 'style',
                    immediate: true
                });
            } else {
                onUpdate({
                    xpath: element.xpath,
                    property: 'backgroundColor',
                    value: tempColor,
                    type: 'style',
                    immediate: true
                });
            }
        } else if (backgroundCategory === 'gradient') {
            // Auto-aplicar gradiente com overlay
            const backgroundValue = overlayGradient ? `${overlayGradient}, ${tempGradient}` : tempGradient;
            onUpdate({
                xpath: element.xpath,
                property: 'background',
                value: backgroundValue,
                type: 'style',
                immediate: true
            });
        } else if (backgroundCategory === 'image' && appliedImage) {
            // Auto-aplicar overlay sobre imagem já aplicada
            applyBackgroundImage(appliedImage, overlayGradient, true);
        }
    }, [tempColor, tempGradient, darkOverlay, backgroundCategory, appliedImage]);

    // Detectar mudanças apenas para seleção de imagem (overlay é auto-aplicado)
    useEffect(() => {
        if (backgroundCategory === 'image') {
            const imageChanged = tempImageUrl !== appliedImage;
            setHasChanges(imageChanged);
        } else {
            setHasChanges(false);
        }
    }, [tempImageUrl, appliedImage, backgroundCategory]);

    const handleApply = () => {
        if (!hasChanges) return;

        const overlayOpacity = darkOverlay / 100;
        const overlayGradient = darkOverlay > 0
            ? `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity}))`
            : '';

        if (backgroundCategory === 'solid') {
            if (darkOverlay > 0) {
                // Aplicar cor sólida com overlay usando background (não backgroundColor)
                const backgroundValue = overlayGradient ? `${overlayGradient}, ${tempColor}` : tempColor;
                onUpdate({
                    xpath: element.xpath,
                    property: 'background',
                    value: backgroundValue,
                    type: 'style',
                    immediate: true
                });
            } else {
                // Sem overlay, usar backgroundColor normal
                onUpdate({
                    xpath: element.xpath,
                    property: 'backgroundColor',
                    value: tempColor,
                    type: 'style',
                    immediate: true
                });
            }
            setAppliedColor(tempColor);
        } else if (backgroundCategory === 'gradient') {
            const backgroundValue = overlayGradient ? `${overlayGradient}, ${tempGradient}` : tempGradient;
            onUpdate({
                xpath: element.xpath,
                property: 'background',
                value: backgroundValue,
                type: 'style',
                immediate: true
            });
            setAppliedGradient(tempGradient);
        } else {
            applyBackgroundImage(tempImageUrl, overlayGradient, true);
        }

        setAppliedOverlay(darkOverlay);
        setHasChanges(false);
    };

    const handleRevert = () => {
        if (backgroundCategory === 'solid') {
            setTempColor(appliedColor);
        } else if (backgroundCategory === 'gradient') {
            setTempGradient(appliedGradient);
        } else {
            setTempImageUrl(appliedImage);
        }
        setDarkOverlay(appliedOverlay);
        setHasChanges(false);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            alert('Imagem muito grande. Máximo: 100MB');
            return;
        }

        // 🎯 NOVO: Converter para WebP automaticamente (formato mais leve)
        convertToWebP(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.85,
            maintainAspectRatio: true,
        })
            .then((webpBase64) => {
                console.log('✅ [BackgroundTab] Imagem convertida para WebP com sucesso');
                setTempImageUrl(webpBase64);
            })
            .catch((error) => {
                console.error('❌ [BackgroundTab] Erro ao converter imagem:', error);
                alert('Erro ao processar a imagem. Tente outra.');
            });
    };

    const applyBackgroundImage = (imageUrl: string, overlayGradient: string = '', immediate: boolean = false) => {
        const backgroundValue = overlayGradient
            ? `${overlayGradient}, url('${imageUrl}')`
            : `url('${imageUrl}')`;

        onUpdate({ xpath: element.xpath, property: 'backgroundImage', value: backgroundValue, type: 'style', immediate });
        onUpdate({ xpath: element.xpath, property: 'backgroundSize', value: 'cover', type: 'style', immediate });
        onUpdate({ xpath: element.xpath, property: 'backgroundPosition', value: 'center', type: 'style', immediate });
        onUpdate({ xpath: element.xpath, property: 'backgroundRepeat', value: 'no-repeat', type: 'style', immediate });

        if (immediate) {
            setAppliedImage(imageUrl);
        }
    };

    const getCurrentPalette = (): string[] => {
        switch (solidPalette) {
            case 'material': return MATERIAL_COLORS;
            case 'tailwind': return TAILWIND_COLORS;
            case 'pastel': return PASTEL_COLORS;
            case 'neon': return NEON_COLORS;
            default: return MATERIAL_COLORS;
        }
    };


    const ColorPalette = () => {
        const currentPalette = getCurrentPalette();

        return (
            <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                    <button
                        onClick={() => setSolidPalette('material')}
                        style={{
                            padding: '5px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: solidPalette === 'material' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                            backgroundColor: solidPalette === 'material' ? '#60a5fa' : 'rgba(45, 52, 65, 0.8)',
                            color: solidPalette === 'material' ? '#ffffff' : '#d1d5db',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: solidPalette === 'material' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (solidPalette !== 'material') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                e.currentTarget.style.borderColor = '#818cf8';
                                e.currentTarget.style.color = '#e0e7ff';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (solidPalette !== 'material') {
                                e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                e.currentTarget.style.color = '#d1d5db';
                            }
                        }}
                    >
                        Material
                    </button>
                    <button
                        onClick={() => setSolidPalette('tailwind')}
                        style={{
                            padding: '5px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: solidPalette === 'tailwind' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                            backgroundColor: solidPalette === 'tailwind' ? '#60a5fa' : 'rgba(45, 52, 65, 0.8)',
                            color: solidPalette === 'tailwind' ? '#ffffff' : '#d1d5db',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: solidPalette === 'tailwind' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (solidPalette !== 'tailwind') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                e.currentTarget.style.borderColor = '#818cf8';
                                e.currentTarget.style.color = '#e0e7ff';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (solidPalette !== 'tailwind') {
                                e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                e.currentTarget.style.color = '#d1d5db';
                            }
                        }}
                    >
                        Tailwind
                    </button>
                    <button
                        onClick={() => setSolidPalette('pastel')}
                        style={{
                            padding: '5px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: solidPalette === 'pastel' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                            backgroundColor: solidPalette === 'pastel' ? '#60a5fa' : 'rgba(45, 52, 65, 0.8)',
                            color: solidPalette === 'pastel' ? '#ffffff' : '#d1d5db',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: solidPalette === 'pastel' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (solidPalette !== 'pastel') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                e.currentTarget.style.borderColor = '#818cf8';
                                e.currentTarget.style.color = '#e0e7ff';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (solidPalette !== 'pastel') {
                                e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                e.currentTarget.style.color = '#d1d5db';
                            }
                        }}
                    >
                        Pastel
                    </button>
                    <button
                        onClick={() => setSolidPalette('neon')}
                        style={{
                            padding: '5px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: solidPalette === 'neon' ? '2px solid #39FF14' : '1px solid rgba(96, 165, 250, 0.3)',
                            backgroundColor: solidPalette === 'neon' ? 'rgba(57, 255, 20, 0.2)' : 'rgba(45, 52, 65, 0.8)',
                            color: solidPalette === 'neon' ? '#39FF14' : '#d1d5db',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: solidPalette === 'neon' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (solidPalette !== 'neon') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                e.currentTarget.style.borderColor = '#818cf8';
                                e.currentTarget.style.color = '#e0e7ff';
                            } else {
                                e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
                                e.currentTarget.style.borderColor = '#39FF14';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (solidPalette !== 'neon') {
                                e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                e.currentTarget.style.color = '#d1d5db';
                            } else {
                                e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
                                e.currentTarget.style.borderColor = '#39FF14';
                            }
                        }}
                    >
                        Neon
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                    {currentPalette.map((color, index) => (
                        <button
                            key={`bg-${color}-${index}`}
                            onClick={() => setTempColor(color)}
                            style={{
                                width: '100%',
                                height: '24px',
                                backgroundColor: color,
                                border: tempColor === color ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                            title={color}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="editor-tab-content">
            {/* Seletor de Categoria */}
            <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                <label>Tipo de Fundo</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <button
                        onClick={() => setBackgroundCategory('solid')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: backgroundCategory === 'solid' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.5)',
                            background: backgroundCategory === 'solid' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
                            color: backgroundCategory === 'solid' ? '#fff' : '#e5e7eb',
                            cursor: 'pointer',
                            fontWeight: backgroundCategory === 'solid' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Cor Sólida
                    </button>
                    <button
                        onClick={() => setBackgroundCategory('gradient')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: backgroundCategory === 'gradient' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.5)',
                            background: backgroundCategory === 'gradient' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
                            color: backgroundCategory === 'gradient' ? '#fff' : '#e5e7eb',
                            cursor: 'pointer',
                            fontWeight: backgroundCategory === 'gradient' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Gradiente
                    </button>
                    <button
                        onClick={() => setBackgroundCategory('image')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: backgroundCategory === 'image' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.5)',
                            background: backgroundCategory === 'image' ? '#60a5fa' : 'rgba(31, 41, 55, 0.9)',
                            color: backgroundCategory === 'image' ? '#fff' : '#e5e7eb',
                            cursor: 'pointer',
                            fontWeight: backgroundCategory === 'image' ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Imagem
                    </button>
                </div>
            </div>

            {/* CONTROLE DE OVERLAY ESCURO - Aparece em todas as categorias */}
            <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                <label>Overlay Escuro ({darkOverlay}%)</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={darkOverlay}
                    onChange={(e) => setDarkOverlay(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: `linear-gradient(to right,
                            rgba(255,255,255,0.3) 0%,
                            rgba(0,0,0,0.5) 50%,
                            rgba(0,0,0,1) 100%)`,
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: '#9ca3af',
                    marginTop: '4px'
                }}>
                    <span>0% (Original)</span>
                    <span>50%</span>
                    <span>100% (Preto)</span>
                </div>
            </div>

            {/* COR SÓLIDA */}
            {backgroundCategory === 'solid' && (
                <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <label>Cor de Fundo</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                            type="color"
                            value={tempColor || '#000000'}
                            onChange={(e) => setTempColor(e.target.value)}
                            style={{
                                width: '60px',
                                height: '40px',
                                borderRadius: '6px',
                                border: '1px solid rgba(96, 165, 250, 0.5)',
                                cursor: 'pointer'
                            }}
                        />
                        <input
                            type="text"
                            value={tempColor}
                            onChange={(e) => setTempColor(e.target.value)}
                            placeholder="#ffffff"
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(96, 165, 250, 0.5)',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                color: '#f3f4f6'
                            }}
                        />
                    </div>
                    <ColorPalette />
                </div>
            )}

            {/* GRADIENTES */}
            {backgroundCategory === 'gradient' && (
                <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <label>Gradientes</label>

                    {/* Seletor de Paleta */}
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                        <button
                            onClick={() => setGradientType('classic')}
                            style={{
                                padding: '5px 8px',
                                fontSize: '11px',
                                borderRadius: '4px',
                                border: gradientType === 'classic' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                                backgroundColor: gradientType === 'classic' ? '#60a5fa' : 'rgba(45, 52, 65, 0.8)',
                                color: gradientType === 'classic' ? '#ffffff' : '#d1d5db',
                                cursor: 'pointer',
                                flex: 1,
                                fontWeight: gradientType === 'classic' ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (gradientType !== 'classic') {
                                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                    e.currentTarget.style.borderColor = '#818cf8';
                                    e.currentTarget.style.color = '#e0e7ff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (gradientType !== 'classic') {
                                    e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                    e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                    e.currentTarget.style.color = '#d1d5db';
                                }
                            }}
                        >
                            Clássicos
                        </button>
                        <button
                            onClick={() => setGradientType('neon')}
                            style={{
                                padding: '5px 8px',
                                fontSize: '11px',
                                borderRadius: '4px',
                                border: gradientType === 'neon' ? '2px solid #39FF14' : '1px solid rgba(96, 165, 250, 0.3)',
                                backgroundColor: gradientType === 'neon' ? 'rgba(57, 255, 20, 0.2)' : 'rgba(45, 52, 65, 0.8)',
                                color: gradientType === 'neon' ? '#39FF14' : '#d1d5db',
                                cursor: 'pointer',
                                flex: 1,
                                fontWeight: gradientType === 'neon' ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (gradientType !== 'neon') {
                                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                    e.currentTarget.style.borderColor = '#818cf8';
                                    e.currentTarget.style.color = '#e0e7ff';
                                } else {
                                    e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
                                    e.currentTarget.style.borderColor = '#39FF14';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (gradientType !== 'neon') {
                                    e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                    e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                    e.currentTarget.style.color = '#d1d5db';
                                } else {
                                    e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
                                    e.currentTarget.style.borderColor = '#39FF14';
                                }
                            }}
                        >
                            ⚡ Neon
                        </button>
                        <button
                            onClick={() => setGradientType('pastel')}
                            style={{
                                padding: '5px 8px',
                                fontSize: '11px',
                                borderRadius: '4px',
                                border: gradientType === 'pastel' ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                                backgroundColor: gradientType === 'pastel' ? '#60a5fa' : 'rgba(45, 52, 65, 0.8)',
                                color: gradientType === 'pastel' ? '#ffffff' : '#d1d5db',
                                cursor: 'pointer',
                                flex: 1,
                                fontWeight: gradientType === 'pastel' ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (gradientType !== 'pastel') {
                                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                                    e.currentTarget.style.borderColor = '#818cf8';
                                    e.currentTarget.style.color = '#e0e7ff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (gradientType !== 'pastel') {
                                    e.currentTarget.style.backgroundColor = 'rgba(45, 52, 65, 0.8)';
                                    e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                                    e.currentTarget.style.color = '#d1d5db';
                                }
                            }}
                        >
                            Pastel
                        </button>
                    </div>

                    {/* Gradientes Bicolor */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
                            🎨 Bicolor (2 cores)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {(gradientType === 'classic' ? CLASSIC_GRADIENTS_BICOLOR :
                                gradientType === 'neon' ? NEON_GRADIENTS_BICOLOR : PASTEL_GRADIENTS_BICOLOR).map((gradient, index) => (
                                <button
                                    key={`bicolor-${index}`}
                                    onClick={() => setTempGradient(gradient.value)}
                                    style={{
                                        width: '100%',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: tempGradient === gradient.value ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                                        background: gradient.value,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    title={gradient.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Gradientes Tricolor */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
                            🌈 Tricolor (3 cores)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {(gradientType === 'classic' ? CLASSIC_GRADIENTS_TRICOLOR :
                                gradientType === 'neon' ? NEON_GRADIENTS_TRICOLOR : PASTEL_GRADIENTS_TRICOLOR).map((gradient, index) => (
                                <button
                                    key={`tricolor-${index}`}
                                    onClick={() => setTempGradient(gradient.value)}
                                    style={{
                                        width: '100%',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: tempGradient === gradient.value ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                                        background: gradient.value,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    title={gradient.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Gradientes Multicolor */}
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#a5b4fc', marginBottom: '8px', display: 'block' }}>
                            ✨ Multicolor (4+ cores)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {(gradientType === 'classic' ? CLASSIC_GRADIENTS_MULTICOLOR :
                                gradientType === 'neon' ? NEON_GRADIENTS_MULTICOLOR : PASTEL_GRADIENTS_MULTICOLOR).map((gradient, index) => (
                                <button
                                    key={`multicolor-${index}`}
                                    onClick={() => setTempGradient(gradient.value)}
                                    style={{
                                        width: '100%',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: tempGradient === gradient.value ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)',
                                        background: gradient.value,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    title={gradient.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* IMAGEM */}
            {backgroundCategory === 'image' && (
                <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <label>Imagem de Fundo</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(96, 165, 250, 0.5)',
                            background: 'rgba(31, 41, 55, 0.9)',
                            color: '#e5e7eb',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Carregar Imagem
                    </button>
                    <input
                        type="text"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        placeholder="ou cole a URL da imagem"
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(96, 165, 250, 0.5)',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            color: '#f3f4f6'
                        }}
                    />
                    {tempImageUrl && (
                        <div
                            style={{
                                width: '100%',
                                height: '120px',
                                borderRadius: '6px',
                                border: '1px solid rgba(96, 165, 250, 0.5)',
                                backgroundImage: `url('${tempImageUrl}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    )}
                </div>
            )}

            {/* Botões de Ação */}
            {hasChanges && (
                <div className="editor-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleApply}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px'
                            }}
                        >
                            Aplicar
                        </button>
                        <button
                            onClick={handleRevert}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                background: 'rgba(31, 41, 55, 0.9)',
                                color: '#f87171',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px'
                            }}
                        >
                            Reverter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
