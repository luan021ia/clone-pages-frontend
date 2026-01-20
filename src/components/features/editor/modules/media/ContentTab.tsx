import React, { useState } from 'react';
import type { SelectedElement, ElementUpdate } from '@/types/editor.types';
import '../../EditorTabs.css';

interface ContentTabProps {
  element: SelectedElement;
  onUpdate: (update: ElementUpdate) => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({ element, onUpdate }) => {
  const [text, setText] = useState(element?.textContent);
  const [imageSrc, setImageSrc] = useState(element?.src || '');
  const [linkHref, setLinkHref] = useState(element?.href || '');
  const [imageAlt, setImageAlt] = useState(element?.alt || '');

  // 🎯 FIX: Adicionar null safety para tagName
  const tagName = element?.tagName || '';
  const isImage = tagName === 'IMG';
  const isLink = tagName === 'A' || (element?.href && element.href.trim().length > 0);
  const isVideo = tagName === 'VIDEO' || tagName === 'IFRAME';
  const hasText = element?.textContent && element.textContent.trim().length > 0;

  console.log('🔍 [ContentTab] Elemento recebido:', {
    tagName,
    isLink,
    hasHref: !!element?.href,
    href: element?.href?.substring(0, 50)
  });

  const handleTextUpdate = () => {
    onUpdate({
      xpath: element.xpath,
      property: 'textContent',
      value: text,
      type: 'content'
    });
  };

  const handleImageUpdate = () => {
    console.log('🖼️ [ContentTab] Atualizando imagem:', {
      xpath: element.xpath,
      newSrc: imageSrc.substring(0, 100) + '...',
      hasAlt: !!imageAlt
    });

    // 🔄 ORDEM IMPORTANTE: Primeiro remove srcset e sizes ANTES de atualizar src
    // Isso garante que o navegador não tente usar srcset ao processar o novo src

    // 1. Remove srcset para evitar conflito com a nova imagem
    console.log('🗑️ [ContentTab] PASSO 1: Removendo srcset...');
    onUpdate({
      xpath: element.xpath,
      property: 'srcset',
      value: '', // Remove o srcset
      type: 'attribute'
    });

    // 2. Remove sizes também (usado junto com srcset)
    console.log('🗑️ [ContentTab] PASSO 2: Removendo sizes...');
    onUpdate({
      xpath: element.xpath,
      property: 'sizes',
      value: '', // Remove sizes
      type: 'attribute'
    });

    // 3. Atualiza o src principal (agora sem conflito com srcset)
    console.log('📝 [ContentTab] PASSO 3: Atualizando src...');
    onUpdate({
      xpath: element.xpath,
      property: 'src',
      value: imageSrc,
      type: 'attribute'
    });

    // 4. Atualiza o alt se fornecido
    if (imageAlt) {
      console.log('📝 [ContentTab] PASSO 4: Atualizando alt...');
      onUpdate({
        xpath: element.xpath,
        property: 'alt',
        value: imageAlt,
        type: 'attribute'
      });
    }

    console.log('✅ [ContentTab] Atualização de imagem concluída!');
  };

  const handleLinkUpdate = () => {
    onUpdate({
      xpath: element.xpath,
      property: 'href',
      value: linkHref,
      type: 'attribute'
    });
  };

  return (
    <div className="editor-tab-content">
      {/* TEXT EDITING */}
      {hasText && !isImage && (
        <div className="editor-section">
          <label className="editor-label">
            📝 Texto
          </label>
          <textarea
            className="editor-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Digite o texto..."
          />
          <button className="editor-apply-btn" onClick={handleTextUpdate}>
            Aplicar Texto
          </button>
        </div>
      )}

      {/* IMAGE EDITING */}
      {isImage && (
        <div className="editor-section">
          <label className="editor-label">
            🖼️ Imagem
          </label>
          <div className="image-preview">
            <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
          </div>
          <input
            type="text"
            className="editor-input"
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
            placeholder="URL da imagem..."
          />
          <input
            type="text"
            className="editor-input"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Texto alternativo (alt)..."
          />
          <button className="editor-apply-btn" onClick={handleImageUpdate}>
            Aplicar Imagem
          </button>
        </div>
      )}

      {/* VIDEO EDITING */}
      {isVideo && (
        <div className="editor-section">
          <label className="editor-label">
            🎥 Vídeo
          </label>
          <input
            type="text"
            className="editor-input"
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
            placeholder="URL do vídeo (YouTube, Vimeo, MP4)..."
          />
          <div className="editor-hint">
            💡 Cole o link do YouTube, Vimeo ou URL direta do vídeo
          </div>
          <button className="editor-apply-btn" onClick={handleImageUpdate}>
            Aplicar Vídeo
          </button>
        </div>
      )}

      {/* LINK EDITING */}
      {isLink && (
        <div className="editor-section">
          <label className="editor-label">
            🔗 Link
          </label>
          <input
            type="text"
            className="editor-input"
            value={linkHref}
            onChange={(e) => setLinkHref(e.target.value)}
            placeholder="URL de destino..."
          />
          <div className="editor-checkbox-group">
            <label>
              <input type="checkbox" />
              Abrir em nova aba
            </label>
          </div>
          <button className="editor-apply-btn" onClick={handleLinkUpdate}>
            Aplicar Link
          </button>
        </div>
      )}

      {/* GENERAL INFO */}
      <div className="editor-section">
        <div className="editor-info-box">
          <strong>Elemento:</strong> {element.tagName.toLowerCase()}<br />
          {element.id && <><strong>ID:</strong> {element.id}<br /></>}
          {element.className && <><strong>Classes:</strong> {element.className}</>}
        </div>
      </div>
    </div>
  );
};
