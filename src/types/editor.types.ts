// ✨ Tipos de Categoria de Seção
export type SectionCategory =
    | 'header'
    | 'hero'
    | 'features'
    | 'about'
    | 'services'
    | 'testimonials'
    | 'pricing'
    | 'cta'
    | 'contact'
    | 'footer'
    | 'other';

// ✨ Informações de Seção Detectada
export interface SectionInfo {
    category: SectionCategory;
    name: string;
    id: string;
    confidence: number; // 0-100
}

export interface HierarchyItem {
  tagName: string;
  id: string;
  className: string;
  text?: string;
}

export interface SelectedElement {
  xpath: string;
  selector?: string; // 🎯 CSS selector for element operations
  cssSelector?: string; // 🎯 NOVO: Seletor CSS como fallback
  hierarchy?: HierarchyItem[]; // 🌳 NOVO: Hierarquia para breadcrumb
  tagName: string;
  textContent: string;
  src?: string;
  href?: string;
  alt?: string;
  className: string;
  id: string;
  styles: ElementStyles;
  attributes: Record<string, string>;
  boundingRect?: {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
  // ✨ NOVO: Informações de seção detectada automaticamente
  sectionInfo?: SectionInfo;
}

export interface ElementStyles {
  // Cores
  backgroundColor: string;
  color: string;
  borderColor: string;

  // Dimensões
  width: string;
  height: string;
  padding: string;
  margin: string;

  // Bordas
  borderRadius: string;
  borderWidth: string;
  borderStyle: string;

  // Efeitos
  boxShadow: string;
  textShadow: string;
  opacity: string;
  filter: string;
  transform: string;

  // Texto
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  textDecoration: string;

  // Background
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
}

export interface Animation {
  name: string;
  duration: string;
  iterationCount: string;
  timingFunction: string;
  delay: string;
}

export type EditorTab = 'section' | 'link' | 'text' | 'media' | 'layout' | 'borders' | 'shadows' | 'effects' | 'advanced' | 'background' | 'tools';

export interface EditorMessage {
  source: 'EDITOR_PARENT' | 'EDITOR_IFRAME';
  type: 'SELECT_ELEMENT' | 'UPDATE_ELEMENT' | 'GET_HTML' | 'RESTORE_HTML' | 'ELEMENT_SELECTED' | 'ELEMENT_UPDATED' | 'HTML_CONTENT' | 'HTML_RESTORED' | 'GET_SECTIONS' | 'SECTIONS_LIST' | 'GET_PAGE_SETTINGS' | 'UPDATE_PAGE_SETTINGS' | 'PAGE_SETTINGS_DATA' | 'PAGE_SETTINGS_UPDATED';
  data?: any;
}

export interface ElementUpdate {
  xpath: string;
  property: string;
  value: string;
  type: 'style' | 'attribute' | 'content' | 'link' | 'remove-link';
  viewport?: 'desktop' | 'mobile'; // Indica se a edição é para desktop ou mobile
  immediate?: boolean; // Força atualização imediata no iframe
  metadata?: Record<string, any>; // Metadados adicionais (target, rel, etc)
}

// 🔧 Configurações Globais da Página (Ferramentas)
export interface PageSettings {
  // SEO
  title: string;           // Título da página (aparece na aba do navegador)
  description: string;     // Meta description
  keywords?: string;       // Meta keywords (opcional)
  
  // Identidade Visual
  favicon: string;         // URL ou Base64 do favicon
  
  // Códigos Customizados
  headerCode: string;      // Código injetado no <head>
  footerCode: string;      // Código injetado antes de </body>
}

// Tipo para mensagens de configuração da página
export interface PageSettingsMessage {
  source: 'EDITOR_PARENT' | 'EDITOR_IFRAME';
  type: 'GET_PAGE_SETTINGS' | 'UPDATE_PAGE_SETTINGS' | 'PAGE_SETTINGS_DATA' | 'PAGE_SETTINGS_UPDATED';
  data?: PageSettings | Partial<PageSettings>;
}