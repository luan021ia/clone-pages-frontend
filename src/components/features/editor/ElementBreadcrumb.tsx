import React from 'react';
import { ChevronRight, Tag, Hash, Type } from 'lucide-react';
import type { HierarchyItem } from '../../../types/editor.types';

interface ElementBreadcrumbProps {
  hierarchy: HierarchyItem[];
}

export const ElementBreadcrumb: React.FC<ElementBreadcrumbProps> = ({ hierarchy }) => {
  if (!hierarchy || hierarchy.length === 0) {
    return null;
  }

  // 🎯 FILTRAR HIERARQUIA: Remover divs genéricas do Elementor e mostrar apenas elementos relevantes
  const filterHierarchy = (items: HierarchyItem[]): HierarchyItem[] => {
    const filtered: HierarchyItem[] = [];
    
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const isBody = item.tagName === 'body';
      const isSemanticTag = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'].includes(item.tagName);
      const isImportantTag = ['img', 'iframe', 'video', 'a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol'].includes(item.tagName);
      const hasId = item.id && item.id.trim() !== '';
      const hasSimpleClass = item.className && !item.className.includes('elementor-element-');
      
      // Sempre incluir:
      // 1. Elemento final (selecionado)
      // 2. body
      // 3. Tags semânticas (header, main, section, etc)
      // 4. Tags importantes (img, iframe, button, h1, etc)
      // 5. Elementos com ID
      // 6. Elementos com classe simples (não elementor-element-xxx)
      if (isLast || isBody || isSemanticTag || isImportantTag || hasId || hasSimpleClass) {
        filtered.push(item);
      }
    });
    
    // Se ficou muito curto (menos de 2), manter últimos 3 elementos originais
    if (filtered.length < 2 && items.length >= 2) {
      return items.slice(-3);
    }
    
    return filtered;
  };

  const filteredHierarchy = filterHierarchy(hierarchy);

  const getTagColor = (tagName: string): string => {
    const colors: Record<string, string> = {
      'body': 'bg-gray-100 text-gray-700',
      'header': 'bg-blue-100 text-blue-700',
      'nav': 'bg-indigo-100 text-indigo-700',
      'main': 'bg-green-100 text-green-700',
      'section': 'bg-yellow-100 text-yellow-700',
      'article': 'bg-orange-100 text-orange-700',
      'aside': 'bg-purple-100 text-purple-700',
      'footer': 'bg-pink-100 text-pink-700',
      'div': 'bg-gray-50 text-gray-600',
      'span': 'bg-gray-50 text-gray-500',
      'a': 'bg-cyan-100 text-cyan-700',
      'button': 'bg-emerald-100 text-emerald-700',
      'img': 'bg-rose-100 text-rose-700',
      'h1': 'bg-red-100 text-red-700',
      'h2': 'bg-red-100 text-red-600',
      'h3': 'bg-red-100 text-red-500',
      'h4': 'bg-red-50 text-red-700',
      'h5': 'bg-red-50 text-red-600',
      'h6': 'bg-red-50 text-red-500',
      'p': 'bg-slate-100 text-slate-700',
      'ul': 'bg-violet-100 text-violet-700',
      'ol': 'bg-violet-100 text-violet-600',
      'li': 'bg-violet-50 text-violet-700',
    };
    
    return colors[tagName.toLowerCase()] || 'bg-gray-100 text-gray-600';
  };

  const formatClassName = (className: string): string => {
    if (!className || className.trim() === '') return '';
    
    const classes = className.trim().split(/\s+/);
    
    // Mostrar primeira classe se tiver mais de 2, ou todas se tiver 1-2
    if (classes.length > 2) {
      return `.${classes[0]}... (+${classes.length - 1})`;
    }
    
    return '.' + classes.join('.');
  };

  const formatText = (text?: string): string => {
    if (!text || text.trim() === '') return '';
    
    const trimmed = text.trim();
    if (trimmed.length > 20) {
      return `"${trimmed.substring(0, 20)}..."`;
    }
    return `"${trimmed}"`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-1 text-xs overflow-x-auto">
        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
          <Tag size={12} />
          <span className="font-medium">Elemento:</span>
        </div>
        
        {filteredHierarchy.map((item, index) => {
          const isLast = index === filteredHierarchy.length - 1;
          const classLabel = formatClassName(item.className);
          const textLabel = formatText(item.text);
          
          return (
            <React.Fragment key={index}>
              <div 
                className={`
                  flex items-center gap-1 px-2 py-1 rounded transition-all
                  ${isLast 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' 
                    : getTagColor(item.tagName) + ' opacity-70 hover:opacity-100'
                  }
                `}
              >
                <span className="font-mono">{item.tagName}</span>
                
                {item.id && (
                  <span className="flex items-center gap-0.5 text-blue-600">
                    <Hash size={10} />
                    <span className="font-medium">{item.id}</span>
                  </span>
                )}
                
                {classLabel && (
                  <span className="text-[10px] opacity-75">{classLabel}</span>
                )}
                
                {textLabel && (
                  <span className="flex items-center gap-0.5 text-gray-500 italic text-[10px]">
                    <Type size={10} />
                    {textLabel}
                  </span>
                )}
              </div>
              
              {!isLast && (
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
        
        <div className="ml-2 text-gray-400 text-[10px] flex-shrink-0">
          ({filteredHierarchy.length} {filteredHierarchy.length === 1 ? 'nível' : 'níveis'})
        </div>
      </div>
    </div>
  );
};

